# 🎬 **MovieMood** — Descubra Filmes Pelas Emoções! 🤖❤️  

> Um sistema inteligente onde você avalia filmes e a IA interpreta seu sentimento!  
> Avaliações automáticas como **positiva**, **neutra** ou **negativa**, te ajudam a encontrar os filmes mais bem avaliados por outras pessoas.

---

## 💡 Sobre o Projeto

**MovieMood** é um sistema web que permite que qualquer usuário deixe uma **avaliação textual** sobre um filme que assistiu.  
O diferencial? O sistema usa **Inteligência Artificial (IA)** para analisar o texto e detectar **o sentimento do usuário** — se ele gostou, ficou neutro ou não curtiu o filme.

A IA organiza essas avaliações por tipo (positiva, neutra ou negativa), ajudando outras pessoas a consultarem os filmes com **melhor aceitação emocional** de forma prática.

---

## 🎯 Objetivos

- Criar uma plataforma interativa para **avaliação de filmes por sentimento**.
- Usar IA para **classificação automática de avaliações textuais**.
- Separar os filmes em **categorias emocionais** (positivo, neutro, negativo).
- Permitir ao usuário descobrir os **filmes mais bem avaliados pela emoção coletiva**.
- Utilizar tecnologias modernas como **Java 21 + Spring Boot**, **PostgreSQL**, **REST APIs**, **Docker**, **RabbitMQ**, e **FastAPI** para a IA.

---

## 🧠 Como Funciona

1. O usuário escreve uma avaliação sobre um filme.
2. O texto é enviado para um **serviço de IA** (em FastAPI + Python), que interpreta o sentimento.
3. A classificação retornada é armazenada com o filme.
4. O sistema organiza os dados para exibição e análise por outros usuários.

---

## 🚀 Funcionalidades

- 📝 Cadastro de filmes e avaliações textuais.
- 🤖 Análise automática de sentimento (positivo, neutro, negativo).
- 📊 Visualização de avaliações por tipo de sentimento.
- 🔎 Filtro para encontrar os filmes mais bem avaliados.
- ☁️ API RESTful para integração com frontend e apps.
- 🔐 Integração com Twilio para **confirmação de cadastro via SMS e Email** (em desenvolvimento).
- 📦 Integração futura com **KrakenD Gateway**.
- 🐇 Suporte a **filas de mensagens (RabbitMQ + Celery)** para processamentos assíncronos.

---

## ⚙️ Tecnologias Utilizadas

### Backend principal:
- **Java 21** + **Spring Boot**
- **Maven** (gestão de dependências)
- **PostgreSQL** (banco de dados relacional)
- **RabbitMQ** (fila de mensagens)
- **Twilio** (envio de SMS e Emails)

### IA (serviço separado):
- **Python** + **FastAPI**
- *(Biblioteca de análise de sentimentos ainda será definida)*

### Infraestrutura:
- **Docker** (containers para serviços)
- **GitHub Actions** (CI/CD automatizado)
- **KrakenD API Gateway** (entrada unificada de requisições - futuro)

---

## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora  
- 💻 Luis Gustavo  
- 📊 Matheus Felipe Godoi  

---

## 📖 Manual de Uso

🚧 *Em construção... Em breve, um guia passo a passo com Docker e scripts automatizados.*

---

## 🧠 Inspiração

A ideia surgiu da percepção de que nossas opiniões sobre filmes vão além de notas ou estrelas: **é sobre o que sentimos**.  
Com o **MovieMood**, queremos propor uma nova maneira de avaliar e descobrir filmes — **pela emoção coletiva**.

---