<img src="https://img.shields.io/badge/Current Status:%20-000.svg"><img src="https://img.shields.io/badge/Move%20fast%20and%20break%20things-red.svg">

We are under heavy development.

## What's included

[Next.js](https://nextjs.org/) - Framework<br>
[Turborepo](https://turbo.build) - Build system<br>
[Biome](https://biomejs.dev) - Linter, formatter<br>
[Sherif](https://github.com/QuiiBz/sherif) - Linter for monorepos<br>
[TailwindCSS](https://tailwindcss.com/) - Styling<br>
[Shadcn](https://ui.shadcn.com/) - UI components<br>
[TypeScript](https://www.typescriptlang.org/) - Type safety<br>
[Supabase](https://supabase.com/) - Authentication, database, storage<br>
[i18n](https://next-international.vercel.app/) - Internationalization<br>
[react-safe-action](https://next-safe-action.dev) - Validated Server Actions<br>
[nuqs](https://nuqs.47ng.com/) - Type-safe search params state manager<br>
[next-themes](https://next-themes-example.vercel.app/) - Theme manager<br>

## Directory Structure

```
.
├── apps                         # Apps workspace
│    ├── api                     # Supabase (API, Auth, Storage, Realtime, Edge Functions)
│    ├── studio                  # tonner dashboard
│    ├── web                     # Marketing site
│    └── ...
├── packages                     # Shared packages between apps
│    ├── logger                  # Logger library
│    ├── supabase                # Supabase - Queries, Mutations, Clients
│    └── ui                      # Shared UI components (Shadcn)
├── tooling                      # are the shared configuration that are used by the apps and packages
│    └── typescript              # Shared TypeScript configuration
├── .cursorrules                 # Cursor rules specific to tonner project
├── biome.json                   # Biome configuration
├── turbo.json                   # Turbo configuration
├── LICENSE
└── README.md
```

## Prerequisites

Bun<br>
Docker<br>
Supabase<br>

## Getting Started

Clone this repo locally with the following command:

```bash
git clone https://github.com/tontile/tonner
```

Install dependecies with the following command:

```bash
bun install
```

Start the development server from either bun or turbo:

```ts
bun dev // starts everything in development mode (web, studio, api, email)
bun dev:web // starts the web app in development mode
bun dev:studio // starts the studio in development mode
bun dev:api // starts the api in development mode

// Database
bun migrate // run migrations
bun seed // run seed
```