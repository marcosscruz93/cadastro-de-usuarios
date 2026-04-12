# Backend — Sistema de Cadastro de Usuários e Endereços

API REST desenvolvida com Java 17 e Spring Boot 3.

---

## Tecnologias

- Java 17
- Spring Boot 4.0.5
- Spring Security + JWT
- Spring Data JPA
- OpenFeign
- MySQL 8
- Lombok

---

## Pré-requisitos

- Java 17+
- MySQL 8+
- Maven 3.8+

---

## Configuração

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cadastro_usuarios
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=sua-chave-secreta-minimo-32-caracteres-aqui
jwt.expiration=86400000
```

---

## Como rodar

```bash
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

---

## Primeiro acesso

Ao subir pela primeira vez, o `AdminSeeder` cria automaticamente um administrador caso não exista nenhum no banco.

**Credenciais padrão:**
- CPF: `11144477735`
- Senha: `admin123`

---

## Rotas da API

### Autenticação
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/auth/login` | Público | Login com CPF e senha |
| POST | `/usuarios/registrar` | Público | Cadastro de novo usuário com seus endereços|

### Usuários
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/usuarios` | ADMIN | Lista todos os usuários |
| GET | `/usuarios/:id` | Autenticado | Busca usuário por id |
| POST | `/usuarios` | ADMIN | Cadastra usuário |
| PUT | `/usuarios/:id` | Autenticado | Atualiza dados do usuário |
| DELETE | `/usuarios/:id` | Autenticado | Exclui usuário |

### Endereços
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/enderecos/usuario/:id` | Autenticado | Lista endereços do usuário |
| POST | `/enderecos` | Autenticado | Cadastra novo endereço |
| PUT | `/enderecos/:id` | Autenticado | Atualiza endereço |
| PATCH | `/enderecos/:id/padrao` | Autenticado | Define endereço como principal |
| DELETE | `/enderecos/:id` | Autenticado | Exclui endereço |

### CEP
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/cep/:cep` | Autenticado | Busca dados do CEP |

---

## Regras de negócio

- CPF deve ser válido e único no sistema
- Senhas armazenadas com hash BCrypt
- Cadastro público sempre cria usuário com role USER
- Cada usuário pode ter múltiplos endereços
- Apenas um endereço pode ser o principal por usuário
- Ao definir novo endereço principal, o anterior é atualizado automaticamente
- Ao excluir o endereço principal, outro é promovido automaticamente
- CEPs são salvos em cache no banco para evitar chamadas repetidas à ViaCEP
- Token JWT tem validade de 24 horas
- Todas as regras de acesso são validadas no backend
