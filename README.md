# Sistema de Cadastro de Usuários e Endereços

Aplicação web fullstack para cadastro e gerenciamento de usuários e seus endereços, com consulta automática de CEP via API ViaCEP.

---

## Tecnologias utilizadas

**Backend**
- Java 17
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- OpenFeign
- MySQL 8
- Lombok

**Frontend**
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios

---

## Funcionalidades

- Cadastro público de usuários
- Autenticação via JWT com CPF e senha
- Dois tipos de usuário: ADMIN e USER
- CRUD completo de usuários
- CRUD completo de endereços
- Busca automática de endereço por CEP via ViaCEP
- Cache de CEP no banco para evitar consultas repetidas à API externa
- Definição de endereço principal
- Promoção automática de endereço principal ao excluir o atual
- Controle de acesso garantido pelo backend em todas as operações

---

## Pré-requisitos

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

---

## Como rodar o projeto

Consulte os READMEs individuais de cada parte:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

---

## Primeiro acesso

Ao subir o backend pela primeira vez, o sistema cria automaticamente um usuário administrador caso ele ainda não exista no banco.

**Credenciais padrão:**
- CPF: `11144477735`
- Senha: `admin123`

Recomendo alterar a senha após o primeiro login.

---

## Controle de acesso

**ADMIN**
- Visualiza todos os usuários cadastrados
- Cadastra, edita e exclui qualquer usuário
- Visualiza e gerencia endereços de qualquer usuário
- Pode promover outros usuários a administrador

**USER**
- Visualiza apenas os próprios dados
- Edita e exclui apenas a própria conta
- Visualiza, cadastra, edita e exclui apenas os próprios endereços
- Define qual endereço é o principal

Todas as regras de acesso são validadas no backend independente do frontend.
