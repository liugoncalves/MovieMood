--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: filmes_filme; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.filmes_filme (nome, descricao, diretor, genero, ano, nota_media, numero_avaliacoes, poster) VALUES
('A Origem', 'Dom Cobb é um ladrão com a rara habilidade de roubar segredos do inconsciente, obtidos durante o estado de sono. Impedido de retornar para sua família, ele recebe a oportunidade de se redimir ao realizar uma tarefa aparentemente impossível: plantar uma ideia na mente do herdeiro de um império. Para realizar o crime perfeito, ele conta com a ajuda do parceiro Arthur, o discreto Eames e a arquiteta de sonhos Ariadne. Juntos, eles correm para que o inimigo não antecipe seus passos.', 'Christopher Nolan', 'ficcao cientifica', 2010, 0, 0, 'posters/AOrigemPoster.jpg'),
('Django Livre', 'Django, um escravo liberto, une forças com um caçador de recompensas alemão para resgatar sua esposa das mãos de um cruel fazendeiro do Mississippi.', 'Quentin Tarantino', 'faroeste', 2012, 0, 0, 'posters/django-livre.jpg'),
('Interestelar', 'As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado de Brand, Jenkins e Doyle, ele seguirá em busca de um novo lar.', 'Christopher Nolan', 'ficcao cientifica', 2014, 0, 0, 'posters/interestelar_aEFtCCk.jpg'),
('Sexta-Feira 13', 'O jovem Clay Miller ignora os conselhos dos moradores e da polícia e decide vasculhar a floresta misteriosa ao redor de Crystal Lake em busca de sua irmã desaparecida. As cabanas apodrecidas de um acampamento de verão abandonado não são as únicas coisas que ele encontra por lá. O maníaco homicida Jason Voorhees está à espreita e pronto para atacar Clay e o grupo de estudantes universitários festejando o final de semana em Crystal Lake.', 'Marcus Nispel', 'horror', 2009, 0, 0, 'posters/Fridaythe13th2009.jpg'),
('Mickey 17', 'Um clone descartável embarca em missões perigosas em um planeta de gelo, onde cada morte é apenas o começo de mais uma reencarnação.', 'Bong Joon-ho', 'ficção científica', 2025, 0, 0, 'posters/mickey-17.jpg'),
('Invocação do Mal', 'Os investigadores paranormais Ed e Lorraine Warren ajudam uma família aterrorizada por uma presença demoníaca em sua fazenda.', 'James Wan', 'horror', 2013, 0, 0, 'posters/invocacao-do-mal.jpg'),
('O Lobo de Wall Street', 'Baseado na história real de Jordan Belfort, um corretor da bolsa que mergulha no mundo do crime e do excesso na busca por riqueza ilimitada.', 'Martin Scorsese', 'comedia', 2013, 0, 0, 'posters/o-lobo-de-wall-street.jpg'),
('La La Land: Cantando Estações', 'O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.', 'Damien Chazelle', 'musical', 2017, 0, 0, 'posters/La-la-land.jpg'),
('Homem-Aranha: Sem Volta para Casa', 'Após sua identidade ser revelada, Peter Parker busca ajuda do Doutor Estranho, o que desencadeia perigos multiversais e antigos vilões retornam.', 'Jon Watts', 'acao', 2021, 0, 0, 'posters/homem-aranha-sem-volta-para-casa.jpg'),
('Batman vs Superman: A Origem da Justiça', 'Batman decide enfrentar o Superman após os eventos de Metrópolis, enquanto uma nova ameaça se aproxima e coloca a humanidade em perigo.', 'Zack Snyder', 'acao', 2016, 0, 0, 'posters/batman-vs-superman.jpg'),
('The Flash', 'Os mundos colidem quando Flash viaja no tempo para mudar os eventos do passado. No entanto, quando sua tentativa de salvar sua família altera o futuro, ele fica preso em uma realidade na qual o General Zod voltou, ameaçando a aniquilação.', 'Andy Muschietti', 'ficcao cientifica', 2023, 0, 0, 'posters/the-flash.jpg'),
('Vingadores: Ultimato', 'Após o estalar de dedos de Thanos, os Vingadores restantes unem forças para reverter a destruição e restaurar o equilíbrio do universo.', 'Anthony Russo e Joe Russo', 'acao', 2019, 0, 0, 'posters/vingadores-ultimato.jpg'),
('Barbie', 'Barbie embarca em uma jornada no mundo real em busca do verdadeiro significado da felicidade, enfrentando desafios existenciais e sociais.', 'Greta Gerwig', 'comedia', 2023, 0, 0, 'posters/barbie.jpg'),
('Shrek 2', 'Shrek e Fiona viajam ao reino de Tão Tão Distante para conhecer os pais dela, mas enfrentam problemas quando o sogro trama para desfazer o casamento.', 'Andrew Adamson, Kelly Asbury, Conrad Vernon', 'animacao', 2004, 0, 0, 'posters/shrek-2.jpg'),
('Ilha do Medo', 'Nos anos 1950, a fuga de uma assassina leva o detetive Teddy Daniels e seu parceiro a investigarem o seu desaparecimento de um quarto trancado em um hospital psiquiátrico. Lá, uma rebelião se inicia e o agente terá que enfrentar seus próprios medos.', 'Martin Scorsese', 'suspense', 2010, 0, 0, 'posters/ILHA-DO-MEDO.jpg'),
('The Batman', 'Batman investiga uma onda de assassinatos ligados a uma conspiração sombria em Gotham, enfrentando o Charada e seus próprios demônios internos.', 'Matt Reeves', 'acao', 2022, 0, 0, 'posters/the-batman.jpg'),
('Oppenheimer', 'A história de J. Robert Oppenheimer, o físico teórico que liderou o Projeto Manhattan e criou a primeira bomba atômica.', 'Christopher Nolan', 'cinebiografia', 2023, 0, 0, 'posters/oppenheimer.jpg'),
('A Bruxa', 'Em 1630, uma família puritana vive isolada na floresta, onde forças sobrenaturais ameaçam sua fé e sanidade após o desaparecimento de um bebê.', 'Robert Eggers', 'horror', 2015, 0, 0, 'posters/a-bruxa.jpg'),
('Cinquenta Tons de Cinza', 'Anastasia Steele, uma estudante universitária, conhece o enigmático e bilionário Christian Grey, iniciando um relacionamento intenso, cheio de segredos e desejos proibidos que desafiam seus limites.', 'Sam Taylor-Johnson', 'romance', 2015, 0, 0, 'posters/cinquenta-tons-de-cinza.jpg'),
('Liga da Justiça', 'Quando uma ameaça cósmica coloca a Terra em perigo, heróis como Batman, Superman, Mulher-Maravilha, Flash e outros se unem para formar a Liga da Justiça e proteger a humanidade.', 'Zack Snyder', 'acao', 2017, 0, 0, 'posters/liga-da-justica.jpg'),
('Minecraft', 'Um jovem herói entra em um mundo aberto de blocos, onde constrói, explora e enfrenta perigos inesperados para salvar seus amigos e desvendar os mistérios desse universo pixelado.', 'Rob McElhenney', 'aventura', 2025, 0, 0, 'posters/minecraft.jpg'),
('Homem-Aranha: Através do Aranhaverso', 'Depois de se reunir com Gwen Stacy, Homem-Aranha é jogado no multiverso. Lá, o super-herói aracnídeo encontra uma numerosa equipe encarregada de proteger sua própria existência.', 'Joaquim dos Santos', 'animacao', 2023, 0, 0, 'posters/aranha-verso.jpg'),
('Freddy x Jason', 'Dois ícones do terror, Freddy Krueger e Jason Voorhees, entram em um confronto épico que coloca em risco a vida de jovens em uma cidade aterrorizada por seus passados sombrios.', 'Ronny Yu', 'horror', 2003, 0, 0, 'posters/freddy-x-jason.jpg'),
('Venom', 'Eddie Brock, um jornalista investigativo, torna-se hospedeiro de um simbionte alienígena que lhe concede poderes extraordinários, mas também luta contra sua própria natureza sombria.', 'Ruben Fleischer', 'acao', 2018, 0, 0, 'posters/venom.jpg'),
('Thor Amor e Trovão', 'Thor embarca numa nova aventura ao lado de seus amigos, enfrentando inimigos antigos e novos, enquanto busca seu verdadeiro propósito em meio a batalhas épicas e descobertas pessoais.', 'Taika Waititi', 'acao', 2022, 0, 0, 'posters/thor-amor-e-trovao.jpg'),
('Esquadrão Suicida', 'Reunidos por uma agência governamental secreta, um grupo de vilões perigosos é enviado em missões suicidas para combater ameaças que nem os heróis podem enfrentar.', 'James Gunn', 'acao', 2021, 0, 0, 'posters/esquadrao-suicida.jpg'),
('Duna', 'No árido planeta Arrakis, Paul Atreides luta para proteger sua família e liderar uma revolução que pode mudar o destino do universo, enfrentando traições e desafios místicos em meio à política intergaláctica.', 'Denis Villeneuve', 'ficcao cientifica', 2021, 0, 0, 'posters/duna.jpg'),
('Crepúsculo', 'A estudante Bella Swan conhece Edward Cullen, um belo mas misterioso adolescente. Edward é um vampiro, cuja família não bebe sangue, e Bella, longe de ficar assustada, se envolve em um romance perigoso com sua alma gêmea imortal.', 'Catherine Hardwicke', 'romance', 2008, 0, 0, 'posters/Twilight_Poster.jpg');


--
-- Name: filmes_filme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.filmes_filme_id_seq', 62, true);


--
-- PostgreSQL database dump complete
--

