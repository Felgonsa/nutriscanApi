# NutriScan API

Backend serverless para o sistema **NutriScan**, responsável por processar dados de nutrição, imagens e integrações externas.  
Construído com **Node.js**, **TypeScript**, **Serverless Framework** e **Drizzle ORM**.

---

## 📂 Estrutura do Projeto

```
src/
 ├── clients/        # Configuração de clientes externos (ex:S3, SQS)
 ├── controllers/    # Camada de controle (recebe requisições e aciona services)
 ├── db/             # Configuração e modelos do banco de dados (Drizzle ORM)
 ├── functions/      # Handlers serverless (lambdas expostas)
 ├── lib/            # Utilitários internos
 ├── queues/         # Filas (SQS)
 ├── services/       # Regras de negócio
 ├── types/          # Tipagens compartilhadas
 └── utils/          # Funções auxiliares
```

---

## 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Serverless Framework
- AWS Lambda
- AWS S3 e SQS
- Drizzle ORM e Neon Serverless Postgres
- Zod para validação de dados
- bcryptjs para hash de senhas
- jsonwebtoken para autenticação JWT
- OpenAI API para recursos de IA
- date-fns para manipulação de datas

---

## ⚙️ Pré-requisitos

- Node.js **>=18**
- Conta AWS (para deploy e uso de serviços)
- Serverless Framework instalado globalmente:
  ```bash
  npm install -g serverless
  ```
- Arquivo `.env` configurado (baseado no `.env.example`)

---

## 🛠️ Instalação e Uso

Clone o repositório:

```bash
git clone https://github.com/maateusilva/jstack-lab-api.git
cd nutriscan-api
```

Instale as dependências:

```bash
npm install
```

Execute em modo desenvolvimento com **Serverless Offline**:

```bash
npm run dev
```

---

## 📜 Scripts Disponíveis

- `npm run dev` → inicia o servidor local com **serverless-offline**

---

## 📦 Deploy

Para publicar na AWS Lambda:

```bash
sls deploy
```
---
---

## 🌐 API Endpoints

Base URL: `https://415gtrqutk.execute-api.us-east-1.amazonaws.com`

### Autenticação
- **POST** `/signin` → Realiza login e retorna um token JWT.
- **POST** `/signup` → Cria um novo usuário.

### Usuário
- **GET** `/me` → Retorna os dados do usuário autenticado.

### Refeições
- **POST** `/meals` → Cria uma nova refeição.
- **GET** `/meals` → Lista todas as refeições do usuário.
- **GET** `/meals/{mealId}` → Retorna os detalhes de uma refeição específica.

---

## 👤 Autor

Projeto desenvolvido por [Felipe Gonçalves](https://github.com/felgonsa).