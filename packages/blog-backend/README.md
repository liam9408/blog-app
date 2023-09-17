# Blog App Backend

Backend API server for Blog App.

## Table of Content

- [Blog App Backend](#blog-app-backend)
  - [Table of Content](#table-of-content)
  - [Prerequisite](#prerequisite)
  - [Environment Setup](#environment-setup)
    - [Environment Variable](#environment-variable)
    - [Database setup](#database-setup)
  - [Quick Start](#quick-start)
  - [Package Scripts](#package-scripts)
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

### Database setup

1. Create a new database named `blog_app`
2. Create a new user with write access to the `blog_app` database if necessary
3. Install `sequelize-cli`
4. Run migration:

```sh
$ sequelize db:migrate:status # Checking if connection is alright
$ sequelize db:migrate # Migrate database table
$ sequelize db:seed:all  # Applying seed data
```

## Quick Start

Make sure you have completed the environment setup

```sh
$ npm install
$ npm build
$ npm run watch
```

Start app using Docker

```sh
$ npm run build-docker
$ npm run watch-docker
```

## Package Scripts

- Run the Server in development mode : `npm run watch`.
- Build project: `npm run build`.
- Run all unit tests: `npm run test`.
- Check for linting errors: `npm run lint`.

## Code Structure (default)

```bash
│
├── /src
│   ├── /configs
│   │   ├── ioc.config.ts
│   │   └── server.config.ts
│   │
│   ├── /constants
│   │   └── index.ts
│   │
│   ├── /controllers
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── default.controller.ts
│   │   ├── image.controller.ts
│   │   └── post.controller.ts
│   │
│   ├── /db
│   │   ├── /migrations
│   │   ├── /models
│   │   └── /seeders
│   │
│   ├── /dtos
│   │   ├── /auth
│   │   └── /post
│   │
│   ├── /enums
│   │   └── index.ts
│   │
│   ├── /exceptions
│   │   ├── errors.ts
│   │   └── HttpException.ts
│   │
│   ├── /middlewares
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── /routes
│   │   ├── auth.route.ts
│   │   ├── category.route.ts
│   │   ├── default.route.ts
│   │   ├── images.route.ts
│   │   └── post.route.ts
│   │
│   ├── /services
│   │   └── providers
│   │   │   └── unsplash.provider.ts
│   │   ├── auth.service.ts
│   │   ├── categories.service.ts
│   │   ├── default.service.ts
│   │   └── posts.service.ts
│   │
│   ├── /types
│   │
│   ├── /utils
│   │
│   ├── app.ts
│   └── server.ts
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
