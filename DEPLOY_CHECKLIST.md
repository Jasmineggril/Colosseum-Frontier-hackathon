## Checklist de Deploy — DreamVault

Passos para preparar e publicar a demo (produção).

- **Provisionar/Verificar Supabase**: crie um projeto Postgres e ative Auth.
- **Executar migration**: cole o SQL em `artifacts/api-server/sql/create_dreams_table.sql` no editor SQL do Supabase para criar a tabela `dreams`.
- **Variáveis de ambiente (Vercel)**:
  - Frontend (Production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Backend (Production): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, opcional `OPENAI_API_KEY`
  - Após adicionar, forçar um redeploy (Deploy > Redeploy).
- **Assets**: coloque arquivos de áudio em `artifacts/dreamvault/public/assets/sounds/` (MP3/OGG) se quiser ambiências reais.
- **Seeds (opcional)**: após backend deployado, use `artifacts/api-server/scripts/seed-dreams.mjs` com `API_BASE_URL` apontando para o endpoint do servidor para popular demo data.

Comandos úteis (local):

```bash
# Frontend
cd artifacts/dreamvault
pnpm install
pnpm run build

# Backend
cd artifacts/api-server
pnpm install
pnpm run build
DATABASE_URL="postgres://..." SUPABASE_URL="https://..." SUPABASE_SERVICE_ROLE_KEY="..." PORT=3000 pnpm run start

# Seed demo (após backend rodando/implantado)
API_BASE_URL=http://localhost:3000 pnpm run seed:dreams
```

Notas finais:
- Não comprometa chaves sensíveis no repositório. Regenerate service keys após testes.
- Se precisar, eu posso: executar as migrations em Supabase (se você me autorizar a usar as chaves), atualizar as variáveis no Vercel (se fornecer acesso), ou rodar o seed novamente.
