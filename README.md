# nestjs-crud

API REST de tarefas (todos) feita com NestJS, Prisma e PostgreSQL.

> **Projeto de estudo.** Serve para praticar NestJS, Prisma, validação com DTOs, guards e testes unitários. Não é feito para produção.

## Stack

- [NestJS](https://nestjs.com/) 12 (TypeScript)
- [Prisma](https://www.prisma.io/) 7 com o adapter `@prisma/adapter-pg`
- PostgreSQL 17 via Docker Compose
- `class-validator` / `class-transformer` para validar o corpo das requisições
- Jest para os testes

## Como rodar

Pré-requisitos: Node.js, npm e Docker.

```bash
# 1. Instalar as dependências
npm install

# 2. Subir o Postgres (porta 5434 na máquina)
docker compose up -d

# 3. Criar o .env a partir do exemplo e trocar o API_KEY
cp .env.example .env

# 4. Aplicar as migrations e gerar o Prisma Client
npx prisma migrate dev

# 5. Subir a API em modo watch (http://localhost:3000)
npm run start:dev
```

Testes:

```bash
npm test
```

## Variáveis de ambiente

| Variável       | Descrição                                                   |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | String de conexão do Postgres                               |
| `API_KEY`      | Chave aceita no header `x-api-key` nas rotas protegidas     |
| `PORT`         | Opcional. Porta da API (padrão `3000`)                      |

## Endpoints

| Método   | Rota         | Protegida por `x-api-key` | Descrição                     |
| -------- | ------------ | :-----------------------: | ----------------------------- |
| `GET`    | `/todos`     |            não            | Lista todas as tarefas        |
| `GET`    | `/todos/:id` |            não            | Busca uma tarefa pelo id      |
| `POST`   | `/todos`     |            sim            | Cria uma tarefa               |
| `PATCH`  | `/todos/:id` |            sim            | Atualiza `title` e/ou `done`  |
| `DELETE` | `/todos/:id` |            sim            | Remove uma tarefa             |

Regras de validação:

- `title`: string obrigatória, até 100 caracteres.
- `done`: booleano, opcional (só no `PATCH`).
- Campos fora do DTO fazem a requisição ser rejeitada com `400`.

Sem o header `x-api-key`, ou com uma chave diferente do `API_KEY` do `.env`, as rotas protegidas respondem `401 Unauthorized`.

### Exemplos

```bash
# Listar
curl http://localhost:3000/todos

# Buscar por id
curl http://localhost:3000/todos/1

# Criar
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "x-api-key: troque-por-uma-chave-sua" \
  -d '{"title": "Estudar guards no NestJS"}'

# Marcar como feita
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: troque-por-uma-chave-sua" \
  -d '{"done": true}'

# Remover
curl -X DELETE http://localhost:3000/todos/1 \
  -H "x-api-key: troque-por-uma-chave-sua"
```

Exemplo de resposta:

```json
{
  "id": 1,
  "title": "Estudar guards no NestJS",
  "done": false,
  "createdAt": "2026-10-20T14:00:00.000Z"
}
```
