# 🎬 **MovieMood** — Descubra Filmes Pelas Emoções! 🤖❤️  

> Um sistema inteligente onde você avalia filmes com texto e a IA interpreta seu sentimento e atribui uma nota!  
> As avaliações ajudam a descobrir os filmes mais bem avaliados emocionalmente pela comunidade.

---

## 💡 Sobre o Projeto

**MovieMood** é uma plataforma web onde qualquer pessoa pode deixar uma **avaliação textual** sobre um filme que assistiu.  
Diferente dos sistemas tradicionais, aqui usamos **Inteligência Artificial (IA)** para interpretar o **sentimento** e até atribuir uma **nota estimada (de 0 a 10)** com base nos argumentos apresentados no texto.

O objetivo é montar um ranking emocional dos filmes: não apenas pela média de notas, mas também pelo **sentimento coletivo** gerado.

---

## 🎯 Objetivos

- Criar uma forma inovadora de **avaliar filmes por emoção e sentimento**.
- Usar IA para **classificar textos como positivos, neutros ou negativos**.
- Atribuir uma **nota estimada (0 a 10)** baseada nos pontos destacados no texto.
- Gerar uma **média geral por filme**, somando as notas atribuídas por todos os usuários.
- Exibir os filmes mais **bem aceitos emocionalmente** pela comunidade.
- Utilizar tecnologias modernas como **Django**, **PostgreSQL**, **Gemini API**, **Docker**, entre outras.

---

## 🧠 Como Funciona

1. O usuário escreve uma avaliação sobre um filme.
2. O texto é enviado para uma **função de IA** integrada com o modelo **Gemini**, que:
   - Analisa o **sentimento geral** do texto (positivo, neutro, negativo).
   - Estima uma **nota numérica (0 a 10)** com base nos pontos apresentados.
   - Gera um **parágrafo explicativo** com o raciocínio da IA.
3. A avaliação é salva com nota, sentimento e explicação da IA.
4. O sistema organiza e exibe os filmes com base na **média das notas** e no **sentimento predominante**.

---

## 🧪 Critérios de Avaliação da IA

A IA analisa os seguintes fatores no texto para estimar o sentimento e nota:

- **Tom geral**: linguagem positiva, negativa ou neutra.
- **Citações específicas**: elogios ou críticas a direção, atuação, trilha, enredo, etc.
- **Nível de detalhamento**: textos mais profundos tendem a gerar notas mais precisas.
- **Uso de adjetivos e intensidade**: palavras como *“excelente”*, *“péssimo”*, *“ok”*, impactam a nota.
- **Contraste interno**: frases ambíguas (ex: "começa mal mas melhora") são interpretadas com pesos diferentes.

> ⚠️ Como as avaliações são feitas por IA, a análise **não precisa ser perfeita ou formal**. O importante é o sentimento geral que o texto transmite.

---

## 🚀 Funcionalidades

- 📝 Cadastro de filmes e envio de avaliações textuais.
- 🤖 Análise automática de sentimento e nota estimada (0 a 10).
- 📊 Visualizar o Ranking Geral dos 10 filmes mais bem avaliados do Site.
- ⭐ Cálculo automático da **média de notas por filme**.
- 🔎 Filtrar busca por ordem de piores/melhores notas, além de gênero/ano.
- ☁️ API RESTful para integração com frontend e apps.
- 🔐 Emails enviados via SMTP Gmail para confirmação do cadastro de Usuário.

---

## ⚙️ Tecnologias Utilizadas

### Backend Principal:
- **Python + Django** — Framework principal da aplicação
- **PostgreSQL** — Banco de dados relacional
- **Django REST Framework** — Criação de APIs RESTful
- **djangorestframework-simplejwt** — Autenticação via JWT (JSON Web Tokens)
- **SMTP Gmail** — Envio de E-mails para confirmação e notificações
- **Gemini (Google AI)** — Análise de sentimento e nota com IA

### Frontend:

### Infraestrutura:
- **Docker & Docker Compose** — Containerização dos serviços (backend, banco)

### Testes:
- **pytest + pytest-django** — Framework para testes unitários simples e eficientes em Django

### Ferramentas Auxiliares:
- **Postman** — Testes de APIs
- **pgAdmin4** — Interface gráfica para gerenciamento do PostgreSQL

---

# 📖 Manual de Instalação

Este guia explica como rodar o backend, banco de dados e frontend do MovieMood usando Docker e Docker Compose.

---

## Passo 1: Criar o arquivo `.env`

Você deve criar dois arquivos `.env` para o backend e frontend:

- No diretório `moviemood_backend`, crie `.env` com suas variáveis, por exemplo:

```env
GEMINI_API_KEY=sua-chave-gemini-aqui

SECRET_KEY="django-insecure-sua-chave"
DEBUG=True

EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app

DB_NAME=moviemood
DB_USER=postgres
DB_PASSWORD=sua-senha-do-banco
DB_HOST=db
DB_PORT=5432
```

- No diretório `moviemood_frontend`, crie `.env` com:

```env
VITE_API_URL=http://localhost:8000/api
VITE_NODE_ENV=development
```

---

## Passo 2: Usar o Docker Compose para subir os serviços

No diretório raiz do projeto, rode:

```bash
docker-compose up --build
```

Esse comando vai construir e subir os containers do backend, banco de dados PostgreSQL e frontend React simultaneamente.

---

## Passo 3: Criar o superusuário do Django

Depois que o backend estiver rodando, abra um terminal novo e execute:

```bash
docker exec -it moviemood-backend-1 python manage.py createsuperuser
```

Siga as instruções para criar o usuário administrador.

---

## Passo 4 (opcional): Importar dados iniciais no banco

Se quiser importar o arquivo `filmes_filme_inserts.sql` para popular o banco, copie-o para dentro do container do banco de dados:

```bash
docker cp filmes_filme_inserts.sql moviemood-db-1:/tmp/filmes_filme_inserts.sql
```

Depois, execute dentro do container:

```bash
docker exec -it moviemood-db-1 psql -U postgres -d moviemood -f /tmp/filmes_filme_inserts.sql
```

---

## Observações

- O nome dos containers (`moviemood-backend-1`, `moviemood-db-1`) pode variar dependendo do seu setup do Docker Compose. Use `docker ps` para verificar.
- Certifique-se de que as variáveis de ambiente nos `.env` estejam corretas para evitar erros de conexão.
- Para parar os containers, use:

```bash
docker-compose down
```

---

Agora você pode acessar:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

---

**Boa sorte com o MovieMood!**

---

## 🧠 Inspiração

Filmes nos marcam emocionalmente. Uma simples nota nem sempre reflete o que sentimos.  
O **MovieMood** quer revolucionar a forma de avaliar filmes: **não por estrelas, mas pelo que sentimos após assisti-los**.

---

## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora  
- 💻 Luis Gustavo  
- 📊 Matheus Felipe Godoi