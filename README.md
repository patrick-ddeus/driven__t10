# Drivent-backend
Esse é o backend para o projeto Drivent um gerenciador de eventos com cadastro de ingresso, registro de eventos, hospedagem de hotéis e emissão de certificado.

## Banco de Dados
O DrivenPass utiliza o banco de dados relacional PostgreSQL para armazenar com segurança as informações dos usuários. O esquema do banco de dados é projetado para garantir a integridade e a segurança dos dados. Em conjunto com o prisma para fazer as queries com segurança e de fácil manutenção com abstrações das entidades do banco

## Tecnologias
As seguintes ferramentas e tecnologias foram utilizadas para desenvolver este projeto


![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)


## Como Executar

1. Clone este repositório.

2. Instale as dependências:

    ```bash
    npm i
    ```
3. Configure as variáves de ambiente
   - Utilize o `.env.example` para preencher corretamente as credenciais de conexão com o banco

4. Execute com o comando:

    ```bash
    npm run dev
    ```

5. Opcionalmente, você pode construir o projeto com o comando:

    ```bash
    npm run build
