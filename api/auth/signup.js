const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (typeof req.body === "object" && req.body !== null) {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function normalizeHandle(value) {
  return String(value ?? "").trim().replace(/^@+/, "");
}

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value) {
  return /^[a-zA-Z0-9._-]{3,32}$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { message: "Method not allowed" });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    json(res, 500, {
      message: "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configurados na Vercel para criar contas sem email rate limit.",
      code: "missing_supabase_admin_config",
    });
    return;
  }

  try {
    const body = await readBody(req);
    const username = normalizeHandle(body.username);
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? "");
    const category = String(body.category ?? "").trim();

    if (!username || !email || !password || !category) {
      json(res, 400, { message: "username, email, password e category sao obrigatorios" });
      return;
    }

    if (!isValidUsername(username)) {
      json(res, 400, { message: "username deve ter 3 a 32 caracteres e usar apenas letras, numeros, ponto, underscore ou hifen" });
      return;
    }

    if (!isValidEmail(email)) {
      json(res, 400, { message: "email invalido" });
      return;
    }

    if (password.length < 8) {
      json(res, 400, { message: "password deve ter pelo menos 8 caracteres" });
      return;
    }

    const createUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          category,
        },
      }),
    });

    const createUserPayload = await createUserResponse.json().catch(() => ({}));

    if (!createUserResponse.ok) {
      json(res, createUserResponse.status, {
        message: createUserPayload?.msg || createUserPayload?.message || "Falha ao criar usuario no Supabase Auth",
        details: createUserPayload,
      });
      return;
    }

    const user = createUserPayload?.user || createUserPayload;

    if (!user?.id) {
      json(res, 500, { message: "Supabase Auth nao retornou o usuario criado" });
      return;
    }

    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: user.id,
        username,
        category,
      }),
    });

    const profilePayload = await profileResponse.json().catch(() => ({}));

    if (!profileResponse.ok) {
      json(res, profileResponse.status, {
        message: profilePayload?.message || "Usuario criado, mas nao foi possivel salvar o perfil",
        details: profilePayload,
      });
      return;
    }

    json(res, 201, {
      user: {
        id: user.id,
        username,
        email,
        category,
      },
      profile: profilePayload?.[0] || profilePayload,
    });
  } catch (error) {
    json(res, 500, {
      message: error instanceof Error ? error.message : "Erro inesperado ao criar conta",
    });
  }
}