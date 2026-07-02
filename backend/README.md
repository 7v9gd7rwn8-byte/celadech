# Backend Setup

Express.js + TypeScript + PostgreSQL

## Installation

```bash
cd backend
npm install
```

## Configuration

Créer `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/celadech
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```

## Development

```bash
npm run dev
```

Serveur sur `http://localhost:3001`

## Build

```bash
npm run build
npm start
```
