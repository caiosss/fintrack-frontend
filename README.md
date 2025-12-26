# Fintrack 💰📊

<p>
O Fintrack é um projeto full-stack simples de controle financeiro pessoal, criado inicialmente para ajudar um amigo que precisava de uma planilha no Excel, mas que acabou evoluindo para uma aplicação web com backend e frontend completos.

Além de auxiliar no controle financeiro, o projeto teve como objetivo praticar e aprender novas tecnologias, explorando conceitos reais de aplicações em produção.
</p>

## Funcionalidades 🚀

- Cadastro e autenticação de usuários
- Autenticação segura via cookies HTTP-only
- Criação e gerenciamento de categorias financeiras
- Registro de transações (receitas e despesas)
- Visualização de gráficos por categoria, mostrando quanto foi gasto no total
- Resumo financeiro com base no salário do usuário
- Comparação automática com:
    - mês anterior
    - identificação de economia maior ou menor
- Dados calculados no backend e consumidos via API
- Filtro por mês e ano

## O que aprendi com esse projeto? 🤔
- Estruturação de uma API usando NestJS
- Integração com banco de dados utilizando Prisma + PostgreSQL
- Implementação de autenticação por cookies com JWT
Configuração de Dockerfile e docker-compose
- Deploy do projeto em produção
- Uso de Vercel (frontend) e Railway (backend + banco)
- Configuração de DNS e domínio customizado
- Entendimento de problemas reais como CORS, cookies e compatibilidade com mobile

## Tecnologias utilizadas 🛠️
### Backend
- NestJS
- PrismaORM
- PostgreSQL
- JWT
- Docker

### Frontend
- Next.js
- React
- Axios
- Tailwind CSS

### Infra / Deploy
- Docker
- Railway (API + banco de dados)
- Vercel (frontend)
- Domínio customizado + DNS

## Como funciona a análise financeira 📊
- O backend calcula os totais de gastos por categoria
- É gerado um resumo financeiro com base no salário informado
- A API retorna comparações com o mês anterior:
    - total gasto
    - variação percentual
    - indicação de economia maior ou menor
- O frontend exibe essas informações em gráficos e cards de resumo

## Rodando o projeto localmente ⚙️
Primeiro configure o seu .env tanto para o front como para o back

### Backend
```
docker-compose up
npm run start:dev
```

### Frontend
```
npm install
npm run dev
```

## Objetivo do projeto 🎯
O projeto foi desenvolvido como o foco em aprendizado prático, simulações de ambientes real de produção como forma de evoluir tecnicamente. Até o momento não possuo nenhum foco comercial com o projeto.

## Autor
Desenvolvido por Caio
