# Squire — Backend

O backend do Squire usa **Supabase** (PostgreSQL + Auth + RLS).

Consulte [`../supabase/README.md`](../supabase/README.md) para setup, migrations e comandos da CLI.

## Frontend

O app React Native consome Supabase via `@supabase/supabase-js`. Configuração em `frontend/src/services/supabase/`.

Sem variáveis de ambiente configuradas, o app usa serviços locais em memória (modo demo).

## Diretório `backend/`

Reservado para scripts e automações futuras (Edge Functions, seeds, CI). A infraestrutura principal vive em `/supabase`.
