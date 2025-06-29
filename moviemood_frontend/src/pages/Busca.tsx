"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Search, Calendar } from "lucide-react"
import FilmeCard from "../components/FilmeCard"
import type { Filme } from "../types"
import { filmeService } from "../services/api"
import { generos } from "../utils/generos"

const Busca: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const query = searchParams.get("q") || ""
  const genero = searchParams.get("genero") || ""

  useEffect(() => {
    if (query || genero) {
      buscarFilmes()
    } else {
      // Se não há query nem gênero, mostra todos os filmes
      carregarTodosFilmes()
    }
  }, [query, genero])

  const carregarTodosFilmes = async () => {
    try {
      setLoading(true)
      setErro("")
      const response = await filmeService.listar()
      setFilmes(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar filmes:", error)
      setErro("Erro ao carregar filmes. Tente novamente.")
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }

  // Função para retornar o label correto com acento
  const obterLabelGenero = (valorGenero: string) => {
    const generoNormalizado = valorGenero.toLowerCase()
    const generoEncontrado = generos.find(
      (g) => g.valor.toLowerCase() === generoNormalizado
    )
    return generoEncontrado ? generoEncontrado.label : valorGenero
  }

  const buscarFilmes = async () => {
    try {
      setLoading(true)
      setErro("")

      // Se tem filtro de gênero, usa a rota de filtro do backend
      if (genero) {
        const response = await filmeService.filtrar(genero, "desc")
        let filmesFiltrados = response.data

        // Se também tem query de texto, filtra localmente os resultados do gênero
        if (query) {
          filmesFiltrados = filmesFiltrados.filter((filme: Filme) => {
            const searchTerm = query.toLowerCase()
            return (
              filme.nome.toLowerCase().includes(searchTerm) ||
              filme.diretor.toLowerCase().includes(searchTerm) ||
              filme.descricao.toLowerCase().includes(searchTerm)
            )
          })
        }

        setFilmes(filmesFiltrados)
      } else {
        // Busca apenas por texto (comportamento original)
        const response = await filmeService.listar()
        const todosFilmes = response.data

        const filmesFiltrados = todosFilmes.filter((filme: Filme) => {
          const searchTerm = query.toLowerCase()
          return (
            filme.nome.toLowerCase().includes(searchTerm) ||
            filme.diretor.toLowerCase().includes(searchTerm) ||
            filme.descricao.toLowerCase().includes(searchTerm) ||
            filme.genero.toLowerCase().includes(searchTerm)
          )
        })

        setFilmes(filmesFiltrados)
      }
    } catch (error: any) {
      console.error("Erro na busca:", error)
      setErro("Erro ao buscar filmes. Tente novamente.")
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }

  const getTituloBusca = () => {
    if (genero && query) {
      return `Resultados para "${query}" em ${obterLabelGenero(genero)}`
    } else if (genero) {
      return `Filmes de ${obterLabelGenero(genero)}`
    } else if (query) {
      return `Resultados para "${query}"`
    }
    return "Todos os Filmes"
  }

  const getSubtituloBusca = () => {
    if (genero && query) {
      return `Filtrados por gênero e ordenados por nota`
    } else if (genero) {
      return `Ordenados por nota decrescente`
    } else if (query) {
      return `Busca por texto`
    }
    return `Todos os filmes cadastrados`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Buscando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">Início</Link>
          <span>›</span>
          <span>Busca</span>
        </div>
      </div>

      {/* Resultados da Busca */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{getTituloBusca()}</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <Search className="w-5 h-5" />
            {query && <span>"{query}"</span>}
            {genero && query && <span>•</span>}
            {genero && <span>Gênero: {obterLabelGenero(genero)}</span>}
            <span>•</span>
            <span>{filmes.length} {filmes.length === 1 ? 'filme encontrado' : 'filmes encontrados'}</span>
            {getSubtituloBusca() && (
              <>
                <span>•</span>
                <span>{getSubtituloBusca()}</span>
              </>
            )}
          </div>
        </div>

        {erro && (
          <div className="bg-red-900 border border-red-600 p-4 rounded-lg mb-6">
            <span className="text-red-400">{erro}</span>
          </div>
        )}

        {filmes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {filmes.map((filme) => (
              <div key={filme.id} className="card-dark flex flex-col md:flex-row gap-6 items-start md:items-stretch">
                {/* Poster */}
                <div className="w-full md:w-40 h-60 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {filme.poster ? (
                    <img
                      src={`http://localhost:8000/imgs/posters/${encodeURIComponent(filme.poster)}`}
                      alt={filme.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${filme.poster ? 'hidden' : ''}`}>
                    <div className="text-4xl">🎬</div>
                  </div>
                </div>

                {/* Informações */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{filme.nome}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                      <span><span className="font-semibold">Ano de lançamento:</span> {filme.ano}</span>
                      <span><span className="font-semibold">Gênero:</span> {filme.genero}</span>
                      <span><span className="font-semibold">Diretor:</span> {filme.diretor}</span>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Sinopse</span>
                      <p className="text-gray-300 leading-relaxed line-clamp-3 mt-1">{filme.descricao}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="circle-green">
                        <span className="text-lg font-bold">{filme.nota_media ? Math.round(filme.nota_media * 10) : 0}%</span>
                      </div>
                      <span className="text-white font-medium">Avaliação dos usuários</span>
                    </div>
                    <Link
                      to={`/filme/${filme.id}`}
                      className="btn-white"
                    >
                      <span>Ver avaliações</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {genero && query
                ? `Nenhum filme encontrado para "${query}" no gênero ${genero}`
                : genero
                  ? `Nenhum filme encontrado no gênero ${genero}`
                  : `Nenhum filme encontrado para "${query}"`
              }
            </div>
            <div className="text-gray-500 text-sm">
              Tente buscar por outro termo ou verifique a ortografia
            </div>
            <Link
              to="/home"
              className="inline-block mt-6 btn-white text-base"
            >
              Voltar ao Início
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Busca 