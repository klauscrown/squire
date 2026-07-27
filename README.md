# Squire

Aplicativo para mestres e jogadores de RPG de mesa. O Squire organiza todo o universo de campanha — arcos, sessões, NPCs, locais, facções, itens, missões e anotações — em um único lugar, de forma hierárquica e intuitiva.

## Estrutura do repositório

```
squire/
├── frontend/    App móvel em React Native + Expo
└── backend/     Funções serverless, regras de segurança e seeds (placeholder)
```

---

## Frontend

App React Native com Expo SDK 56 (mobile + web).

**Stack:** React Native · Expo · TypeScript (strict) · Expo Router · TanStack Query · Zustand · React Hook Form + Zod · NativeWind · Reanimated · Gesture Handler

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 LTS ou superior
- [Android Studio](https://developer.android.com/studio) (para build nativo Android com dev client)
- Navegador moderno (para versão web)

### Instalação

```bash
cd frontend

npm install
npx expo install --fix
```

### Executar

```bash
cd frontend

npm start          # Dev client (mobile) — requer build nativo
npm run android    # Build e instala no emulador/dispositivo Android
npm run ios        # Simulador iOS (macOS)
npm run web        # Versão web no navegador
```

### Scripts

| Script | Descrição |
|--------|-----------|
| `npm start` | Expo Dev Server com dev client (mobile) |
| `npm run android` | Build e abre no Android |
| `npm run ios` | Abre no iOS |
| `npm run web` | Abre no navegador (http://localhost:8081) |
| `npm run prebuild` | Gera pasta `android/` nativa |
| `npm run lint` | Executa ESLint |
| `npm run typecheck` | Verifica tipos TypeScript |

### Versão web (MVP)

O app roda no navegador com layout responsivo:

| Largura | Comportamento |
|---------|---------------|
| &lt; 768px | Layout mobile (bottom tabs) |
| 768–1023px | Conteúdo centralizado, bottom tabs |
| ≥ 1024px | Sidebar lateral + conteúdo centralizado (max 960–1200px) |

```bash
cd frontend
npm run web
```

Use **Continuar sem conta** na tela de login para testar. Com Supabase configurado, os dados persistem na nuvem (sessão anônima). Sem Supabase, os dados ficam em memória (perdidos ao recarregar).

Layouts específicos de plataforma: `(app)/_layout.web.tsx` (sidebar) e `(app)/_layout.tsx` (tabs mobile).

### Arquitetura

```
frontend/src/
├── app/                    Rotas Expo Router
│   ├── (auth)/             Stack de autenticação
│   └── (app)/              Tabs principais
├── components/
│   ├── ui/                 Button, Text, Input, Card, ScreenWrapper, FormSheet
│   ├── layout/             WebSidebar (navegação desktop)
│   └── providers/          AppProviders, ThemeProvider, ThemedStatusBar
├── features/               Módulos de domínio
│   ├── campaign/
│   ├── session/
│   ├── npc/
│   ├── location/
│   ├── faction/
│   ├── inventory/
│   ├── quest/
│   └── notes/
├── services/
│   ├── supabase/           Cliente, auth, types e mappers
│   ├── firebase/           Login Google (OAuth → token para Supabase)
│   └── api/                Placeholder para integrações HTTP
├── hooks/
├── store/                  Zustand (estado global de UI)
├── theme/                  Design tokens (cores, espaçamento, tipografia…)
├── constants/
├── types/
└── utils/
```

---

## Backend

Supabase (PostgreSQL + Auth + RLS). Migrations em [`supabase/`](supabase/).

```
supabase/
├── config.toml
└── migrations/   Schema e políticas de segurança
```

Consulte [`supabase/README.md`](supabase/README.md) para setup local e remoto.

---

## Licença

Projeto privado.
