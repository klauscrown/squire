# Squire — Visão e estado do projeto

> Documento de referência do produto e da base técnica, atualizado em **agosto de 2026**.  
> Setup e comandos do dia a dia: [`README.md`](README.md) · Supabase: [`supabase/README.md`](supabase/README.md).

---

## O que é

**Squire** é um aplicativo para mestres e jogadores de RPG de mesa. Organiza o universo de uma campanha — arcos, sessões, NPCs, locais, facções, itens, missões e anotações — em um só lugar, de forma hierárquica.

Nome do app nas stores/config: **Squire** (`com.squire.app`).  
Esquema de deep link / Expo: `squire`.

Visão de produto (módulos planejados na UI da campanha):

| Ativo no MVP | Planejado (“Em breve”) |
|--------------|------------------------|
| Sessões | Missões, Itens, Facções |
| NPCs | Calendário, Diário, Bestiário |
| Locais | Combates, Linha do tempo |
| Anotações | Inventário compartilhado, Wiki, Biblioteca |

---

## Fase atual

**MVP funcional em andamento** — foco em campanhas, quatro módulos de conteúdo, autenticação e identidade visual “grimório”.

| Commit | Resumo |
|--------|--------|
| `37a01b7` | Bootstrap: app, UI grimório premium, login |
| `6970eee` | Módulo Locais, auth híbrida, estabilização do MVP |
| `5003d11` | Login alinhado ao mockup, mascote na home, visual |
| `36aa31f` | Temas multi-paleta + refatoração home/grimório *(HEAD em `main`)* |

**Versão app:** `1.0.0` (Expo SDK ~56).  
**Estado:** projeto privado; sem release pública documentada.

---

## Estrutura do repositório

```
squire/
├── frontend/                 App principal (React Native + Expo)
├── supabase/                 Schema SQL, RLS, Storage, CLI
├── backend/                  Placeholder (functions / rules / seeds)
├── preview/                  Artefatos de preview (web/android)
├── squire-digital-grimoire/  Protótipo web (Lovable) — referência de UI, não é o app de produção
├── README.md                 Como rodar o projeto
└── PROJETO.md                Este documento
```

---

## Stack técnica

### Frontend (`frontend/`)

| Área | Tecnologia |
|------|------------|
| Runtime | React Native 0.85 · React 19 · Expo ~56 |
| Navegação | Expo Router (file-based, `typedRoutes`) |
| Linguagem | TypeScript (strict) |
| Dados remotos | TanStack Query · `@supabase/supabase-js` |
| Estado de UI | Zustand |
| Formulários | React Hook Form + Zod |
| Estilo | NativeWind / Tailwind · tokens em `src/theme` · componentes grimório |
| Animação | Reanimated · Gesture Handler · Moti |
| Auth Google | Firebase Auth + `@react-native-google-signin/google-signin` → sessão Supabase |
| Plataformas | Android (dev client), iOS, Web (layout responsivo) |
| New Architecture | Habilitada (`newArchEnabled: true`) |

### Backend

| Área | Tecnologia |
|------|------------|
| BaaS | **Supabase** (PostgreSQL + Auth + Storage + RLS) |
| Migrations | `supabase/migrations/*.sql` |
| Edge Functions / seeds | Pasta `backend/` ainda vazia (placeholders) |

### Dual backend de dados

O app escolhe o backend dinamicamente (`shouldUseLocalBackend()`):

1. **Supabase** — quando `EXPO_PUBLIC_SUPABASE_*` está configurado e o usuário **não** está em modo explorador.
2. **Local (memória)** — se Supabase não está configurado **ou** o usuário usa “Continuar sem conta” / modo explorador.

Cada feature de domínio tem trio de serviços: `*.local.ts` · `*.supabase.ts` · facade `*.ts`.

---

## O que já existe (MVP)

### Autenticação

- Login e cadastro com **e-mail/senha** (Supabase Auth).
- **Google Sign-In** (Firebase + Google OAuth ↔ Supabase).
- **Continuar sem conta** — sessão anônima (se habilitada no projeto) ou fallback local.
- Telas: login, registro; layout e tipografia premium (Cinzel, Cormorant, Marcellus, Sora, etc.).

### Navegação e shell do app

- Groups: `(auth)` e `(app)`.
- Tabs principais: **Home**, **Campanhas**, **Perfil**, **Ajustes**.
- Mobile: bottom tabs; Web (≥1024px): **sidebar** (`_layout.web.tsx` + `WebSidebar`).
- Splash animado, status bar temática, providers de auth/tema.

### Home

- Carrossel de campanhas, card de criar campanha, busca.
- Atalhos do mestre / quick actions (grid).
- Rolador de dados (sheet).
- Mascote flutuante Squire (FAB + popup de dicas).

### Campanhas

- Listagem, criação, detalhe/overview com tiles de módulos.
- Status: `active` | `paused` | `completed`.
- Campos: título, descrição, sistema de RPG, capa, nº de jogadores.
- Ações via sheet; stats por módulo habilitado.

### Módulos ativos

#### Sessões
- CRUD (lista + detalhe/sheet).
- Status: `planned` | `completed` | `cancelled`.
- Número da sessão, data de jogo, resumo.

#### NPCs
- CRUD lista + detalhe.
- Disposição: aliado / neutro / inimigo / desconhecido.
- Status vital: vivo / morto / desaparecido.
- Identidade: papel, raça, classe, local (texto).
- **Retrato** (image picker → Storage quando Supabase ativo).

#### Locais
- CRUD lista + detalhe.
- Tipos: assentamento, masmorra, natureza, marco, edificação, outro.
- Região, descrição, **imagem**.

#### Anotações
- CRUD lista + detalhe.
- Título + conteúdo livre.

### Mídia

- Bucket Supabase `media` (retratos, capas).
- Path: `{userId}/{folder}/{entityId}/{timestamp}.{ext}`.
- Leitura pública; escrita restrita ao dono (RLS/Storage policies).

### Design system / temas

- Tokens: cores, spacing, tipografia, radius, elevation, animation, opacity.
- Visual packs grimório (`theme/visual`): surfaces, glass, atmosphere.
- Paletas nomeadas (`theme/palettes.ts`):
  - **Grimório** (`default`) — roxo + ouro antigo.
  - **Tormenta** — vermelho/bronze.
- Switch de tema na UI; light/dark base + overlays grimório.
- Componentes `components/grimoire/*` (headers, cards, empty states, detail screens, inputs, glows).

### Plataforma web (MVP)

| Largura | Layout |
|---------|--------|
| &lt; 768px | Mobile (tabs) |
| 768–1023px | Conteúdo centralizado + tabs |
| ≥ 1024px | Sidebar + conteúdo max ~960–1200px |

---

## Banco de dados (Supabase)

Migrations aplicadas no repositório (ordem cronológica):

| Migration | Conteúdo |
|-----------|----------|
| `20260716140000_initial_schema` | `campaigns`, `sessions`, `npcs`, `notes` + RLS + helper `is_campaign_owner` |
| `20260720180000_npc_status` | Status vital do NPC |
| `20260720183000_npc_identity_fields` | Raça, classe, local |
| `20260720190000_npc_portrait` | URL de retrato |
| `20260721120000_media_storage` | Bucket `media` e policies |
| `20260727120000_locations` | Tabela `locations` + RLS |

Todas as entidades filhas amarram a `campaign_id` com **cascade delete**.  
RLS: usuário só enxerga campanhas (`created_by = auth.uid()`) e filhos das próprias.

---

## Arquitetura do frontend (resumo)

```
frontend/src/
├── app/                 Rotas Expo Router
│   ├── (auth)/          login, register
│   └── (app)/           home, profile, settings, campaigns/**
├── components/
│   ├── grimoire/        Design system temático
│   ├── layout/          Tabs, sidebar, auth layout
│   ├── providers/       Auth, Theme, Splash
│   └── ui/              Button, Input, Card, FormSheet…
├── features/
│   ├── auth/
│   ├── home/
│   ├── campaign/        (habilitado)
│   ├── session/         (habilitado)
│   ├── npc/             (habilitado)
│   ├── location/        (habilitado)
│   ├── notes/           (habilitado)
│   ├── faction/         scaffold
│   ├── inventory/       scaffold
│   └── quest/           scaffold
├── services/
│   ├── supabase/        client, auth, storage, mappers, types
│   ├── firebase/        Google
│   ├── media/           image picker
│   └── dataBackend.ts   troca local ↔ remoto
├── store/               Zustand (UI, tema, explorador)
├── theme/               tokens + palettes + visual packs
├── hooks/
├── constants/
├── types/
└── utils/
```

---

## Variáveis de ambiente (frontend)

Arquivo típico: `frontend/.env`

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Firebase + Google (login Google nativo / web)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

No dashboard Supabase: providers **Email**, **Google** e **Anonymous** conforme o fluxo desejado.

---

## Como rodar (atalho)

```bash
# Frontend
cd frontend
npm install
npm start          # dev client
npm run android    # Android (script PowerShell)
npm run web        # browser

# Supabase local (raiz do monorepo)
supabase start
supabase db reset
```

Detalhes e scripts: [`README.md`](README.md).

---

## O que ainda não está (roadmap implícito)

Derivado do código e dos módulos desabilitados:

1. **Domínio**
   - Facções, missões, itens / inventário compartilhado.
   - Calendário, diário, bestiário, combates, timeline, wiki, biblioteca.
   - Relacionamentos ricos entre entidades (NPC ↔ local ↔ sessão, etc.) além de campos de texto.

2. **Colaboração**
   - Compartilhamento de campanha / multi-usuário / papéis mestre vs jogador.
   - Hoje o modelo é 1 dono (`created_by`).

3. **Backend extra**
   - Edge Functions, seeds oficiais, automações em `backend/`.
   - CI/CD e pipelines de release não documentados no repositório.

4. **Produto**
   - Geradores da home (nomes, itens, encontros) ainda no plano de atalhos / UI.
   - iOS: código/config presentes; fluxo principal de build nativo documentado com foco em Android + web.
   - Protótipo `squire-digital-grimoire` como referência visual paralela (não integrado ao app Expo).

---

## Artefatos auxiliares (não core)

| Pasta / arquivo | Papel |
|-----------------|--------|
| `squire-digital-grimoire/` | Mock/protótipo web (rotas campanhas, home, perfil, ajustes) |
| `preview/` | Saídas de preview Expo static / android |
| `frontend/screen-*.png` | Capturas de UI de desenvolvimento |
| `.tmp-supabase-init/` | Scaffold temporário de CLI — não é fonte de verdade |

---

## Princípios de implementação (observados no código)

- Features isoladas por pasta, com types Zod e services pluggáveis (local/Supabase).
- UI coesa grimório: atmosfera, glass surfaces, dourado/arcano (ou paleta alternativa).
- RLS no banco como barreira real de multi-tenant por usuário.
- Fallback offline/demo sem forçar backend configurado.
- Web e mobile compartilham a mesma árvore de rotas, com layouts específicos de plataforma.

---

## Licença

Projeto **privado**.
