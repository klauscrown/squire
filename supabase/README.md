# Squire — Supabase

Backend principal do Squire: PostgreSQL, Auth, Storage e Row Level Security.

## Estrutura

```
supabase/
├── config.toml              Configuração local (Supabase CLI)
└── migrations/              Migrations SQL versionadas
    └── 20260716140000_initial_schema.sql
```

## Tabelas (MVP)

| Tabela | Descrição |
|--------|-----------|
| `campaigns` | Campanhas do usuário |
| `sessions` | Sessões de jogo |
| `npcs` | Personagens não-jogáveis |
| `notes` | Anotações livres |

## Storage

| Bucket | Uso |
|--------|-----|
| `media` | Retratos de NPCs e capas de campanha (público para leitura; escrita só do dono) |

Path padrão: `{userId}/{folder}/{entityId}/{timestamp}.{ext}`

Todas as tabelas usam **RLS** — cada usuário acessa apenas dados das próprias campanhas.

## Pré-requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para stack local)

## Desenvolvimento local

```bash
# Na raiz do repositório
supabase start
supabase db reset   # aplica migrations
```

Após `supabase start`, copie URL e anon key para `frontend/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key exibida no terminal>
```

## Projeto remoto (produção/staging)

```bash
supabase login
supabase link --project-ref <seu-project-ref>
supabase db push
```

No dashboard Supabase, ative em **Authentication > Providers**:

- **Email** — login e cadastro com e-mail/senha
- **Google** — use o **mesmo OAuth Client ID/Secret** do Firebase/Google Cloud
- **Anonymous Sign-Ins** — fluxo "Continuar sem conta" / modo explorador

No **Firebase Console**, ative **Authentication > Sign-in method > Google** e copie o **Web client ID** para `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` no `frontend/.env`.

Se a confirmação de e-mail estiver habilitada, novos cadastros por e-mail precisam confirmar o endereço antes do primeiro login.

## Gerar types TypeScript (opcional)

```bash
supabase gen types typescript --local > frontend/src/services/supabase/types/database.generated.ts
```

Compare com `database.ts` manual e mescle conforme necessário.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `supabase start` | Sobe Postgres, Auth, Studio local |
| `supabase stop` | Para a stack local |
| `supabase db reset` | Recria banco e aplica migrations |
| `supabase migration new <nome>` | Nova migration |
| `supabase db push` | Aplica migrations no projeto remoto |

Studio local: http://localhost:54323
