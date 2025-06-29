"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import FilmeCard from "../components/FilmeCard"
import type { Filme } from "../types"
import { filmeService } from "../services/api"
import { generos } from "../utils/generos"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeDestaque, setFilmeDestaque] = useState<Filme | null>(null)
  const [loading, setLoading] = useState(true)
  const [paginaAtual, setPaginaAtual] = useState(0)
  const filmesPorPagina = 6

  useEffect(() => {
    carregarFilmes()
  }, [])

  const carregarFilmes = async () => {
    try {
      const response = await filmeService.listar()
      const filmesData = response.data

      setFilmes(filmesData)
      console.log("Filmes carregados:")
        filmesData.forEach((f: Filme) =>
          console.log(`ID ${f.id} - ${f.nome} | gênero: "${f.genero}"`)
        )


      // Selecionar filme em destaque (sempre o com maior nota média)
      if (filmesData.length > 0) {
        const filmesComAvaliacoes = filmesData.filter((filme: Filme) =>
          (filme.nota_media || 0) > 0 && (filme.numero_avaliacoes || 0) > 0
        )

        if (filmesComAvaliacoes.length > 0) {
          const destaque = filmesComAvaliacoes.reduce((prev: Filme, current: Filme) =>
            (current.nota_media || 0) > (prev.nota_media || 0) ? current : prev
          )
          setFilmeDestaque(destaque)
        } else {
          setFilmeDestaque(filmesData[0])
        }
      }
    } catch (error: any) {
      console.error("Erro ao carregar filmes:", error)
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }

  const filmesEmAlta = filmes
    .filter(f => (f.numero_avaliacoes || 0) > 0)
    .sort((a, b) => (b.numero_avaliacoes || 0) - (a.numero_avaliacoes || 0))
    .slice(0, 18)

  const totalPaginas = Math.ceil(filmesEmAlta.length / filmesPorPagina)
  const filmesAtuais = filmesEmAlta.slice(paginaAtual * filmesPorPagina, (paginaAtual + 1) * filmesPorPagina)

  const proximaPagina = () => {
    setPaginaAtual((prev) => (prev + 1) % totalPaginas)
  }

  const paginaAnterior = () => {
    setPaginaAtual((prev) => (prev - 1 + totalPaginas) % totalPaginas)
  }

  const normalizeGenero = (text: string) => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s]/g, '')    // remove caracteres especiais
      .replace(/\s+/g, ' ')           // remove espaços extras
      .trim()
  }

  const filmesPorGenero = (valorGenero: string) => {
    const generoNormalizado = normalizeGenero(valorGenero)

    return filmes.filter((filme) => {
      return normalizeGenero(filme.genero || '') === generoNormalizado
    }).slice(0, 6)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Filme em Destaque */}
      {filmeDestaque && (
        <Link
          to={`/filme/${filmeDestaque.id}`}
          className="block relative h-[480px] md:h-[540px] overflow-hidden flex items-center group"
        >
          {filmeDestaque.poster ? (
            <img
              src={`http://localhost:8000/imgs/posters/${encodeURIComponent(filmeDestaque.poster)}`}
              alt={filmeDestaque.nome}
              className="absolute inset-0 w-full h-full object-cover z-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-gradient-to-r', 'from-blue-900', 'to-purple-900');
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 z-0" />
          )}

          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, #09090B 100%)' }}
          />

          <div className="absolute inset-0 bg-black bg-opacity-70 z-20" />

          <div className="relative container mx-auto px-4 h-full flex items-center z-30">
            <div className="flex gap-10 items-center w-full">
              <div className="hidden md:block w-56 h-80 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl">
                {filmeDestaque.poster ? (
                  <img
                    src={`http://localhost:8000/imgs/posters/${encodeURIComponent(filmeDestaque.poster)}`}
                    alt={filmeDestaque.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${filmeDestaque.poster ? 'hidden' : ''}`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-gray-400">Sem imagem</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg uppercase tracking-wider">Filme Destaque</h2>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 uppercase text-white drop-shadow-lg leading-tight">{filmeDestaque.nome}</h1>
                <p className="text-lg mb-6 line-clamp-3 text-gray-200 drop-shadow-md font-medium">{filmeDestaque.descricao}</p>
                <div className="flex flex-wrap items-center gap-4 text-base mb-6">
                  <div className="circle-green">
                    <span className="text-lg font-bold">{filmeDestaque.nota_media ? Math.round(filmeDestaque.nota_media * 10) : 0}%</span>
                  </div>
                  <span className="text-gray-200">Ano de lançamento: {filmeDestaque.ano}</span>
                  <span className="text-gray-200">Gênero: {filmeDestaque.genero}</span>
                  <span className="text-gray-200">Diretor: {filmeDestaque.diretor}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Carrossel de Filmes */}
      <section className="container mx-auto px-4 py-10 relative">
        <h2 className="section-title mb-6">Filmes em Alta</h2>
        <div className="relative">
          {totalPaginas > 1 && (
            <>
              <button
                onClick={paginaAnterior}
                className="carousel-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                style={{ transform: 'translateY(-50%) translateX(-72px)' }}
                title="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={proximaPagina}
                className="carousel-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                style={{ transform: 'translateY(-50%) translateX(72px)' }}
                title="Próximo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {filmesAtuais.map((filme) => (
              <FilmeCard key={filme.id} filme={filme} minimal />
            ))}
          </div>
        </div>
      </section>

      {/* Filmes por Categoria Dinâmico */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="section-title">Filmes por categoria</h2>
        {generos.map(({ valor, label }) => {
          const filmesDoGenero = filmesPorGenero(valor)
          if (filmesDoGenero.length === 0) return null

          return (
            <div key={valor} className="mb-10">
              <h3 className="subtitle">{label}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {filmesDoGenero.map((filme) => (
                  <FilmeCard key={filme.id} filme={filme} minimal />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default Home
