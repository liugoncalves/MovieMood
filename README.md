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
- Utilizar tecnologias modernas como **Node.js**, **PostgreSQL**, **RabbitMQ**, **FastAPI**, **Docker**, entre outras.

---

## 🧠 Como Funciona

1. O usuário escreve uma avaliação sobre um filme.
2. O texto é enviado a um serviço de IA (via FastAPI) que:
   - Analisa o **sentimento geral** do texto (positivo, neutro, negativo).
   - Estima uma **nota numérica (0 a 10)** com base nos pontos apresentados.
3. A avaliação é salva com a nota estimada e sentimento detectado.
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
- 🔐 Integração com **Twilio** para envio de SMS e Email (em desenvolvimento).
- 📦 Suporte a filas de mensagens com **RabbitMQ + Celery** (ou Bull).
- 🌐 Integração futura com **KrakenD API Gateway**.

---

## ⚙️ Tecnologias Utilizadas

### Backend Principal:
- **Node.js** (v18+) — Plataforma backend
- **Express.js** — Framework para APIs RESTful
- **PostgreSQL** — Banco de dados relacional
- **pg** ou **Sequelize** — Integração com banco
- **RabbitMQ** — Sistema de mensageria
- **Bull** ou **Bee-Queue** — Processamento assíncrono
- **Twilio** — Envio de notificações via SMS/Email

### IA (serviço separado):
- **Python + FastAPI** — Serviço que analisa o texto
- *(A biblioteca de análise de sentimentos será definida — ex: VADER, TextBlob ou modelo treinado)*

### Infraestrutura:
- **Docker** — Containerização dos serviços
- **KrakenD** — Orquestração de APIs
- **GitHub Actions** — CI/CD

### Ferramentas Auxiliares:
- **Postman** — Testes de APIs
- **pgAdmin4** — Interface gráfica para PostgreSQL

---

## 📖 Manual de Uso

🚧 *Em breve será adicionado um passo a passo com Docker e scripts de automação para rodar o sistema localmente.*

---

## 🧠 Inspiração

Filmes nos marcam emocionalmente. Uma simples nota nem sempre reflete o que sentimos.  
O **MovieMood** quer revolucionar a forma de avaliar filmes: **não por estrelas, mas pelo que sentimos após assisti-los**.

---

## 📝 Padrão de Mensagens de Commit

Para manter o repositório organizado, vamos seguir o padrão abaixo nas mensagens de commit:

### Formato:
```text
<tipo>: <descrição curta do que foi feito>

<opcional: descrição mais detalhada se necessário, explicando o porquê ou algum detalhe importante>
```

### Tipos de Commit:
- **feat**: Nova funcionalidade.
- **fix**: Correção de bugs.
- **docs**: Alterações na documentação.
- **style**: Mudanças de estilo sem impacto na lógica (ex: formatação).
- **refactor**: Refatoração de código.
- **test**: Adição ou alteração de testes.
- **chore**: Tarefas de manutenção.
- **build**: Mudanças no processo de build.
- **ci**: Mudanças nas configurações de CI/CD.
- **perf**: Melhoria de performance.
- **deploy**: Alterações relacionadas ao deploy.

### Exemplos:
```text
feat: Implementação da funcionalidade de cadastro de filmes
fix: Correção do bug de validação no campo "nome"
docs: Atualização do README com informações sobre o projeto
```
## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora  
- 💻 Luis Gustavo  
- 📊 Matheus Felipe Godoi  

---
