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

No dashboard Supabase, ative **Authentication > Providers > Anonymous Sign-Ins** para o fluxo "Continuar sem conta".

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
