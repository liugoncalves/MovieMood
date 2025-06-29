"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, ChevronRight, Trophy } from "lucide-react"
import type { Filme } from "../types"
import { filmeService } from "../services/api"

const Ranking: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [ordem, setOrdem] = useState<'melhores' | 'piores'>('melhores')

  useEffect(() => {
    carregarRanking()
  }, [ordem])

  const carregarRanking = async () => {
    setLoading(true)
    try {
      const response = await filmeService.ranking(ordem)
      setFilmes(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar ranking:", error)
      // Fallback para lista normal se ranking não funcionar
      try {
        const fallbackResponse = await filmeService.listar()
        const filmesOrdenados = fallbackResponse.data.sort(
          (a: Filme, b: Filme) => ordem === 'piores'
            ? (a.nota_media || 0) - (b.nota_media || 0)
            : (b.nota_media || 0) - (a.nota_media || 0)
        )
        setFilmes(filmesOrdenados)
      } catch (fallbackError: any) {
        console.error("Erro no fallback:", fallbackError)
        setFilmes([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-yellow-900"
      case 2:
        return "bg-gray-400 text-gray-900"
      case 3:
        return "bg-amber-600 text-amber-900"
      default:
        return "bg-gray-600 text-white"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando ranking...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">
            Início
          </Link>
          <span>›</span>
          <span>Ranking de Filmes</span>
        </div>
      </div>

      {/* Título e seletor de ordem */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Ranking de Filmes</h1>
          <div className="flex gap-2">
            <button
              className={`btn-white-sm px-4 py-2 rounded-lg font-semibold transition-colors ${ordem === 'melhores' ? 'bg-white text-gray-900' : 'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setOrdem('melhores')}
            >
              Melhores
            </button>
            <button
              className={`btn-white-sm px-4 py-2 rounded-lg font-semibold transition-colors ${ordem === 'piores' ? 'bg-white text-gray-900' : 'bg-[#23232a] text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setOrdem('piores')}
            >
              Piores
            </button>
          </div>
        </div>

        {/* Lista de Filmes */}
        <div className="space-y-8">
          {filmes.map((filme, index) => (
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                    <h2 className="text-2xl font-bold text-white mb-1 md:mb-0">{filme.nome}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getPositionColor(index + 1)}`}>{index + 1}</span>
                      {index < 3 && (
                        <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                      )}
                    </div>
                  </div>
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
                    <span className="text-white font-medium">
                      Avaliações dos usuários <span className="text-gray-400">({filme.numero_avaliacoes ?? 0})</span>
                    </span>
                  </div>
                  <Link
                    to={`/filme/${filme.id}`}
                    className="btn-white"
                  >
                    <span>Ver avaliações</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filmes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Nenhum filme encontrado</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ranking
