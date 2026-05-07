import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";
import { db, pool, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";

const router: IRouter = Router();

let usersTableReady = false;

const ensureUsersTable = async (): Promise<void> => {
  if (usersTableReady) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  usersTableReady = true;
};

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, encoded: string): boolean => {
  const [salt, storedHash] = encoded.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(derived, "hex"));
};

router.post("/auth/signup", async (req, res) => {
  await ensureUsersTable();

  const username = String(req.body?.username ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!username || !email || !password) {
    res.status(400).json({ message: "username, email e password sao obrigatorios" });
    return;
  }

  if (username.length < 3) {
    res.status(400).json({ message: "username deve ter pelo menos 3 caracteres" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "password deve ter pelo menos 8 caracteres" });
    return;
  }

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ message: "email ou username ja cadastrado" });
    return;
  }

  const inserted = await db
    .insert(usersTable)
    .values({
      id: randomUUID(),
      username,
      email,
      passwordHash: hashPassword(password),
    })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
    });

  res.status(201).json({ user: inserted[0] });
});

router.post("/auth/login", async (req, res) => {
  await ensureUsersTable();

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    res.status(400).json({ message: "email e password sao obrigatorios" });
    return;
  }

  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      passwordHash: usersTable.passwordHash,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  const user = users[0];

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ message: "credenciais invalidas" });
    return;
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

export default router;