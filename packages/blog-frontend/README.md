# Blog App Frontend

Frontend UI for Blog App.

## Table of Content

- [Blog App Frontend](#blog-app-frontend)
  - [Table of Content](#table-of-content)
  - [Prerequisite](#prerequisite)
  - [Environment Setup](#environment-setup)
    - [Environment Variable](#environment-variable)
  - [Quick Start](#quick-start)
  - [Code Structure (default)](#code-structure-default)
  - [Commit Message](#commit-message)

## Prerequisite

- Node ^12
- Postgresql 12+
- Sequelize Cli

## Environment Setup

### Environment Variable

1. Create a `.env` file based on `.env.template`
2. Update the values in the `.env` file

## Quick Start

Make sure you have completed the environment setup

```sh
$ npm install
$ npm build
$ npm run dev
```

## Code Structure (default)

```bash
│
├── /src
│   ├── /api
│   │   ├── auth-api.ts
│   │   ├── categroy-api.ts
│   │   ├── image-api.ts
│   │   └── posts-api.ts
│   │
│   ├── /components
│   │   ├── /atoms
│   │   ├── /molecules
│   │   ├── /organisms
│   │   └── /templates
│   │
│   ├── /configs
│   │   └── index.ts
│   │
│   ├── /contexts
│   │   ├── api.context.tsx
│   │   ├── auth.context.tsx
│   │   └── settings-context.tss
│   │
│   ├── /hooks
│   │   ├── use-api-service.ts
│   │   ├── use-auth.ts
│   │   ├── use-hover.ts
│   │   ├── use-mounted.ts
│   │   ├── use-scroll-position.ts
│   │   └── use-settings.ts
│   │
│   ├── /icons
│   │
│   ├── /layouts
│   │   ├── /dashboard
│   │   └── HttpException.ts
│   │
│   ├── /pages
│   │   ├── /activities
│   │   │   ├── [[...category]].tsx
│   │   │   └── me.tsx
│   │   ├── /post
│   │   │   ├── postId.tsx
│   │   │   ├── new.tsx
│   │   │   └── index.tsx
│   │   ├── _app.tsx
│   │   └── index.tsx
│   │
│   ├── /services
│   │   └── api.service.ts
│   │
│   ├── /theme
│   │
│   ├── /types
│   │
│   ├── /utils
│
├── .env
├── .eslintrc.js
├── .gitignore
├── .sequelizerc
├── .prettierrc
├── sequelize.config.js
├── package.json
└── tsconfig.json

## Commit Message

| When               | Commit Message              |
| :----------------- | :-------------------------- |
| Add function       | feat: ⚡️ Add function      |
| Fix bug            | fix: 🐞 Fix bug             |
| Refactoring        | refactor: 🛠 Refactoring     |
| Add package        | package: 📦 Add package     |
| Fix readme         | docs: 📚 Fix readme         |
| Tool Setup         | chore: 🛠 Tool/Project setup |
| Improvements style | style: 👁 Improvements style |


### Note
```
