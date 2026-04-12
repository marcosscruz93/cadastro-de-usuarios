# Frontend — Sistema de Cadastro de Usuários e Endereços

Interface web desenvolvida com React 18 e TypeScript.

---

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios

---

## Pré-requisitos

- Node.js 18+
- npm

---

## Configuração

O frontend consome a API em `http://localhost:8080`. Caso o backend esteja em outro endereço, edite o arquivo `src/services/api/axios.ts`:

```typescript
const api = axios.create({
    baseURL: 'http://localhost:8080',
});
```

---

## Como rodar

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`