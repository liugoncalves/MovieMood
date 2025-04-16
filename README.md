
# 🎬 **MovieMood** — Descubra Filmes Pelas Emoções! 🤖❤️  

> Um sistema inteligente onde você avalia filmes e a IA interpreta seu sentimento!  
> Avaliações automáticas como **positiva**, **neutra** ou **negativa**, te ajudam a encontrar os filmes mais bem avaliados por outras pessoas!

---

## 💡 Sobre o Projeto

**MovieMood** é um sistema web que permite que qualquer usuário deixe uma **avaliação textual** sobre um filme que assistiu.  
A grande sacada? O sistema usa **Inteligência Artificial (IA)** para analisar essa avaliação e detectar **o sentimento do usuário** — se ele gostou, ficou neutro ou não gostou do filme.

A IA então armazena essas avaliações organizadas por tipo (positiva, neutra ou negativa). Com isso, qualquer pessoa pode consultar os filmes com **melhor aceitação**, baseando-se nas emoções de outros usuários.

---

## 🎯 Objetivos

- Criar um sistema interativo de **avaliação de filmes**.
- Utilizar IA para **detecção automática de sentimentos** nas avaliações.
- Armazenar essas análises em **categorias separadas** (positivo, neutro, negativo).
- Ajudar os usuários a **descobrirem os filmes mais bem avaliados**.
- Praticar e aplicar tecnologias como **Django**, **PostgreSQL**, **REST APIs** e **análise de texto com IA**.

---

## 🤖 Para Leigos: Como Funciona?

Imagine que você acabou de ver um filme e quer dizer o que achou dele.  
Você entra no site do MovieMood e escreve algo como:

> *"Gostei muito desse filme! O final foi surpreendente."*

O sistema então vai analisar seu texto com uma inteligência artificial que entende emoções e sentimentos nas palavras.  
Ela vai identificar que sua avaliação é **positiva**, e salvar essa informação junto com o filme.

Com o tempo, outros usuários também avaliam o mesmo filme, e o MovieMood vai organizando essas opiniões. Assim, quem estiver buscando um bom filme pra ver, pode ver quais receberam mais avaliações **positivas**, e evitar aqueles com muitas **negativas**.

---

## 🚀 Funcionalidades

- 📝 Cadastro de filmes e avaliações textuais.
- 🤖 Análise automática de sentimento (positivo, neutro, negativo).
- 📊 Visualização de avaliações por tipo de sentimento.
- 🔎 Filtragem de filmes mais bem avaliados.
- 🌐 API RESTful para consumo dos dados (usável com Postman).

---

## ⚙️ Tecnologias Utilizadas

- **Python** + **Django** + **Django REST Framework**  
- **PostgreSQL**  
- **TextBlob** para análise de sentimento  
- **Postman** para testes da API  
- *(Possível integração futura com frontend em React ou HTML/CSS básico)*

---

## 🛠 Como Rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/liugoncalves/MovieMood
   cd seu-repo
   ```

2. **Crie e ative o ambiente virtual:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate   # Windows
   ```

3. **Instale as dependências:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o banco PostgreSQL:**

   Crie um banco de dados PostgreSQL com o nome desejado (ex: `moviemood`) e um usuário com senha.  
   Exemplo usando o terminal PostgreSQL:

   ```sql
   CREATE DATABASE moviemood;
   CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE moviemood TO seu_usuario;
   ```

5. **Configure as variáveis no `settings.py` ou em um `.env`:**

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'moviemood',
           'USER': 'seu_usuario',
           'PASSWORD': 'sua_senha',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

6. **Aplique as migrações para criar as tabelas no banco:**

   ```bash
   python manage.py migrate
   ```

7. **Crie um superusuário (opcional para acessar o admin):**

   ```bash
   python manage.py createsuperuser
   ```

8. **Inicie o servidor:**

   ```bash
   python manage.py runserver
   ```

9. **Acesse o sistema:**

   Vá até [http://localhost:8000](http://localhost:8000) no navegador.

---

## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora  
- 💻 Luis Gustavo  
- 📊 Matheus Felipe Godoi  

---

## 📖 Manual de Uso

*(Em construção... Em breve um guia completo para uso da plataforma!)*

---

## 🧠 Inspiração

A ideia de classificar filmes com base na emoção dos usuários surgiu da observação de como nossas experiências com filmes vão além das estrelas ou notas: o que sentimos **é o que mais importa**.  
Com o MovieMood, queremos criar uma nova forma de ver e escolher filmes: **pela emoção coletiva.**