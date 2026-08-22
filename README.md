# Minhas Plantas

Aplicativo web (mobile first) para controlar o manejo de plantas domésticas: plantas, grupos, produtos, aplicações e ciclos de adubação recorrentes, com fotos e timeline de evolução. Especificação completa em [`prd.md`](./prd.md).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (tokens definidos em `src/app/globals.css`)
- [Firebase](https://firebase.google.com): Authentication (Google), Firestore (fotos salvas como base64 inline, sem Storage/plano Blaze)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) para formulários
- [date-fns](https://date-fns.org), [lucide-react](https://lucide.dev), `browser-image-compression`
- [Vitest](https://vitest.dev) para testes unitários; `@firebase/rules-unit-testing` para as Security Rules
- Deploy: [Vercel](https://vercel.com)

## Arquitetura

Camadas separadas por responsabilidade:

```
UI (app/, components/, features/*/components)
  ↓
Use Cases (features/*/useCases)
  ↓
Domain (domain/ — funções puras, sem I/O)
  ↓
Infrastructure (services/firebase/*)
```

Regra dura: componentes React nunca importam `firebase/firestore` nem repositórios diretamente — só hooks (`src/hooks`) ou use cases. Toda a lógica de cálculo de ciclo de adubação vive em `src/domain/cycles/`, testada isoladamente e sem depender de Firebase.

```
src/
├── app/                  Rotas (App Router): (auth)/login, (app)/{dashboard,plantas,grupos,produtos,aplicacoes,ciclos,cuidados,mais}
├── components/{ui,feedback,navigation}/   Design system reutilizável
├── features/{plants,groups,products,applications,cycles,photos,care,auth}/
│   ├── components/       Componentes específicos do domínio (PlantCard, ApplicationForm...)
│   └── useCases/         Orquestração: regras de negócio + chamadas a services
├── domain/                Funções puras (cálculo de ciclo, urgência, timeline...)
├── services/firebase/     Client SDK, auth, repositórios Firestore
├── hooks/                 Ponte React ↔ use cases/services (useAsyncData, usePlants...)
├── types/                 Entidades de domínio e view-models
└── lib/                   Utilitários (datas locais, compressão de imagem, cn)
```

### Modelo de dados (Firestore)

Subcoleções por usuário — isolamento estrutural, não apenas por campo filtrado:

```
users/{uid}
users/{uid}/plants/{plantId}
users/{uid}/groups/{groupId}
users/{uid}/products/{productId}
users/{uid}/careCycles/{cycleId}
users/{uid}/applications/{applicationId}
users/{uid}/photos/{photoId}
recommendations/{recommendationId}   (coleção global, somente leitura)
```

Cada documento também guarda `userId` (redundante ao path) para que as Security Rules validem ownership em duas camadas.

Regra de cálculo de ciclo (centralizada em `src/domain/cycles/`, nunca no componente React):

```
nextApplicationDate = lastApplicationDate + cycleFrequency
```

Ao registrar uma aplicação vinculada a um ciclo (`src/features/applications/useCases/registerApplication.ts`), o ciclo é atualizado atomicamente: `lastApplicationDate = applicationDate` e `nextApplicationDate` recalculado.

Uma aplicação em um **grupo** grava `groupId` + um snapshot `affectedPlantIds` no momento do registro, preservando o vínculo mesmo que a composição do grupo mude depois.

### Fotos

Sem Firebase Storage (evita exigir plano Blaze). Cada foto é comprimida no cliente (`browser-image-compression`, alvo ~0.5MB/1280px) e convertida para base64 (`src/lib/imageCompression.ts::fileToBase64`), salva inline no campo `url` do documento `Photo` — cada foto já é um documento próprio na coleção `photos`, então o limite de 1MiB por documento do Firestore nunca é compartilhado entre fotos. As regras rejeitam qualquer `url`/`coverPhotoUrl` acima de ~900KB como defesa contra um cliente que pule a compressão.

### Segurança (Firebase Security Rules)

`firestore.rules` garante que cada usuário só acesse seus próprios dados. Leitura/exclusão dependem só do `uid` no **path** (`request.auth.uid == uid`) — nunca de `resource.data`, porque o Firestore rejeita qualquer `list()` sem `where()` correspondente quando a regra depende de dado do documento (ver comentário no próprio arquivo de regras). Escrita (`create`/`update`) valida `resource.data.userId == uid` normalmente, já que isso não afeta listagem. Aplicações e fotos são imutáveis após criadas (só `create`/`delete`, nunca `update`) para não haver divergência com o histórico de ciclos. `recommendations` é de leitura pública (autenticada) e escrita bloqueada no cliente.

Testes das regras em `tests/security/firestore.rules.test.ts`, cobrindo explicitamente isolamento entre usuários, criação com `userId` forjado, validação de shape (nome vazio, tipo de produto inválido, XOR planta/grupo) e imutabilidade de aplicações.

## Instalação e execução local

```bash
npm install
cp .env.example .env.local   # preencha com as credenciais do seu projeto Firebase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Configurar o Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → ative **Google**.
3. **Firestore Database** → criar em modo produção (as regras deste repositório cobrem o acesso).
4. Em **Configurações do projeto → Seus apps**, crie um app Web e copie as credenciais para `.env.local` (veja `.env.example`).
5. Publique as regras: `npx firebase deploy --only firestore:rules,firestore:indexes` (requer login `npx firebase login` e `.firebaserc` apontando pro seu projeto).

### Variáveis de ambiente

Ver `.env.example` — todas prefixadas com `NEXT_PUBLIC_` porque são a configuração pública do SDK cliente do Firebase (a segurança real está nas Security Rules, não em manter essas chaves em segredo).

## Testes

```bash
npm test            # testes unitários da camada domain (Vitest)
npm run test:watch  # modo watch
npm run test:rules  # Security Rules via Firebase Emulator (requer Java instalado)
```

## Build e qualidade

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deploy (Vercel)

1. Suba o repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as mesmas variáveis de `.env.example` em Project Settings → Environment Variables.
4. Cada Pull Request gera um Preview Deployment; merge em `main` publica em produção.

## Estrutura de commits

O histórico segue commits funcionais por feature (bootstrap → design tokens → Firebase → auth → design system → domain → CRUD de plantas/grupos/produtos → aplicações → ciclos → dashboard → fotos/timeline → segurança...) — cada um buildável isoladamente.

## Fora do escopo do MVP

Por decisão de produto (ver `prd.md`, seção 30): app nativo, notificações push, modo horta, IA para diagnóstico, identificação automática de espécie, previsão climática, sensores IoT, marketplace, rede social, recomendações automáticas complexas. A arquitetura (camada `domain/recommendations`, modelo `Recommendation`) já está preparada para receber uma biblioteca científica real no futuro sem retrabalho estrutural.
