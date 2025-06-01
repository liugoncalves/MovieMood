# avaliacoes/utils.py

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Configurar a API
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_ANALISE = """🎯 Prompt Avançado para Análise de Avaliação no MovieMood:
Você é um sistema de Inteligência Artificial responsável por interpretar avaliações textuais de usuários sobre filmes no projeto MovieMood. Sua tarefa é analisar emocionalmente o texto e estimar uma nota de 0 a 10, com base nos argumentos apresentados.

Leia atentamente o texto de avaliação fornecido. Em seguida, forneça uma resposta em um único parágrafo, explicando como você chegou à sua interpretação. Sua resposta deve ser clara, objetiva e bem justificada, levando em consideração os fatores abaixo. Ao final da explicação, escreva na última linha apenas o seguinte formato:

sentimento: positivo/neutro/negativo e nota: 0 a 10

✅ Fatores Técnicos e Pessoais que Devem Ser Avaliados:
Tom geral do texto:
Verifique se a linguagem utilizada é predominantemente positiva, neutra ou negativa.
Ex: uso de palavras como amei, excelente, horrível, decepcionante, razoável, etc.

Citações específicas de aspectos técnicos do filme:

Roteiro / Enredo: Há elogios ou críticas sobre a narrativa?

Direção: O texto menciona o trabalho do(a) diretor(a)?

Atuação: Há comentários sobre os(as) atores/atrizes?

Trilha Sonora: A música foi mencionada como tocante ou inadequada?

Fotografia / Efeitos visuais: Há destaque visual, artístico ou negativo?

Nível de detalhamento da avaliação:
Quanto mais específica e elaborada a avaliação, mais confiável será a nota.
Textos superficiais geram notas medianas.

Adjetivos e intensidade emocional:
Avalie palavras de forte carga emocional: "maravilhoso", "chato", "sublime", "medíocre", etc.
A presença e a intensidade dos adjetivos influenciam diretamente o resultado.

Contraste interno:
Identifique se há conflitos de opinião dentro do texto (ex: “o começo é lento, mas o final é incrível”).
Tais contrastes devem ser ponderados para balancear a nota final.

Fatores pessoais e emocionais do autor:

O autor expressa identificação com personagens ou enredo?

Houve impacto emocional evidente (ex: "chorei no final", "fiquei refletindo por dias")?

A avaliação demonstra empatia, nostalgia, frustração, surpresa?

Contexto temporal ou social (se citado):
Se o texto menciona o impacto do filme em um contexto social, cultural ou histórico, isso pode influenciar positivamente a nota, mesmo que tecnicamente o filme tenha falhas.

📌 Formato da Resposta da IA (obrigatório):
Apenas 1 parágrafo explicativo, incluindo os fatores utilizados na análise.

A última linha da resposta deve conter somente:
sentimento: positivo/neutro/negativo. nota: X # 🎬 MovieMood
"""

def analisar_sentimento(texto):
    prompt_completo = PROMPT_ANALISE + f'\n\n🧠 Entrada:\n"{texto}"'
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt_completo
    )
    output = response.text.strip()

    # Extrair a última linha da resposta
    ultima_linha = output.strip().splitlines()[-1].lower()

    sentimento = "neutro"
    nota = 5.0

    if "sentimento:" in ultima_linha and "nota:" in ultima_linha:
        try:
            sentimento = ultima_linha.split("sentimento:")[1].split("nota:")[0].strip().lower()
            sentimento = sentimento.split()[0]  # Pega só a primeira palavra: "positivo", "negativo", "neutro"
            if sentimento not in ['positivo', 'neutro', 'negativo']:
                sentimento = "neutro"  # fallback seguro
            nota_str = ultima_linha.split("nota:")[1].split("#")[0].strip()
            nota = float(nota_str.replace(',', '.'))
        except Exception:
            pass

    return sentimento, nota, output