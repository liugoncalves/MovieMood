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

# Guia de Instalação e Configuração do Backend
## Passo 1: Clonar o repositório

```bash
git clone https://github.com/seu-usuario/moviemood.git
cd moviemood
```

---

## Passo 2: Criar e ativar o ambiente virtual

Linux/macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

Windows (PowerShell):
```powershell
python -m venv venv
.\venv\Scripts\activate
```

---

## Passo 3: Instalar dependências

```bash
pip install -r requirements.txt
```

---

## Passo 4: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com este conteúdo (exemplo):

```env
# Chave da API Gemini (Google AI)
GEMINI_API_KEY=sua-chave-aqui

# Configurações Django
SECRET_KEY=sua-secret-key-aqui
DEBUG=True

# Email SMTP Gmail
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app-aqui

# Banco de Dados PostgreSQL
DB_NAME=moviemood
DB_USER=postgres
DB_PASSWORD=sua-senha-do-banco
DB_HOST=localhost
DB_PORT=5432
```

---

## Passo 5: Criar banco de dados no PostgreSQL

Abra o terminal do PostgreSQL (`psql`) e execute:

```sql
CREATE DATABASE moviemood;
CREATE USER postgres WITH PASSWORD 'sua-senha-do-banco';
GRANT ALL PRIVILEGES ON DATABASE moviemood TO postgres;
```

Ajuste o nome do usuário e senha conforme sua configuração local.

---

## Passo 6: Rodar migrações para criar tabelas

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Passo 7: Criar usuário administrador (opcional)

```bash
python manage.py createsuperuser
```

---

## Passo 8: Rodar o servidor localmente

```bash
python manage.py runserver
```

---

## Dicas Extras

- Use o Postman para testar as APIs RESTful.
- Configure o SMTP Gmail para envio de e-mails (confirme as configurações de segurança da conta).
- Para produção, ajuste o `DEBUG=False` e configure variáveis de ambiente com segurança.
- Utilize Docker para facilitar o deploy e isolamento de ambiente.

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

---

## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora  
- 💻 Luis Gustavo  
- 📊 Matheus Felipe Godoi