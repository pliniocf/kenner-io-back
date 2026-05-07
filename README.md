# Kenner IO

## Stacks

As stacks escolhidas foram NodeJS, React, MySQL, Prisma e JWT.

A maior parte delas foi escolhida por maior familiaridade e velocidade no desenvolvimento. O Prisma foi escolhido por parecer mais simples de implementar e atender bem aos requisitos do projeto, principalmente na manipulação de dados relacionais e integração com MySQL.

---

## Rodar o projeto

Backend:

```bash
npm i
npm run dev
```

Primeiramente deverá haver um banco MySQL de pé com as coleções:

agendamentos
profissionais_servicos
servicos
usuarios

Os dados referentes ao banco estão em:
```./prisma/schema.prisma```

## Arquitetura

A escolha por monólito modular aconteceu principalmente por equilibrar simplicidade e organização. Como o projeto possui um escopo relativamente pequeno/médio e precisava ser desenvolvido rapidamente, não faria muito sentido adicionar a complexidade operacional de microserviços.

Além disso, caso o projeto cresça no futuro, a separação modular já ajuda a preparar uma possível migração para serviços independentes sem a necessidade de reestruturar completamente a aplicação.

## O que ficou de fora

Infelizmente algumas coisas ficaram de fora. Não tive acesso ao meu computador até esta segunda feira, então não pude iniciar o projeto antes.

As notificações e importação ficaram de fora. Ajustes nos cadastros para fazer travas de perfil também não foram realizados e as consultas e dashboards também não foram possíveis.

Acredito que com o tempo normal eu teria conseguido deixar pelo menos funcional todos os detalhes sobre o agendamento e cadastro/login de usuário, além da implementação da importação em massa e provavelmente a notificação automática.

Para os dashboards provavelmente precisaria de um pouco mais de tempo.

Obrigado pela oportunidade!