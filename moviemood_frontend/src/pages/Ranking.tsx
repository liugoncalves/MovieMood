"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, ChevronRight } from "lucide-react"
import type { Filme } from "../types"
import { filmeService } from "../services/api"

const Ranking: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarRanking()
  }, [])

  const carregarRanking = async () => {
    try {
      const response = await filmeService.ranking("melhores")
      setFilmes(response.data)
    } catch (error) {
      console.error("Erro ao carregar ranking:", error)
      // Fallback para lista normal se ranking não funcionar
      try {
        const fallbackResponse = await filmeService.listar()
        const filmesOrdenados = fallbackResponse.data.sort(
          (a: Filme, b: Filme) => (b.nota_media || 0) - (a.nota_media || 0),
        )
        setFilmes(filmesOrdenados)
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando ranking...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/" className="hover:text-white">
            Início
          </Link>
          <span>›</span>
          <span>Ranking de Filmes</span>
        </div>
      </div>

      {/* Título */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Ranking de Filmes</h1>

        {/* Lista de Filmes */}
        <div className="space-y-6">
          {filmes.map((filme, index) => (
            <div key={filme.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="flex gap-6">
                {/* Poster */}
                <div className="w-32 h-48 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {filme.poster ? (
                    <img
                      src={`http://localhost:8000/imgs/posters/${filme.poster}`}
                      alt={filme.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl">🎬</div>
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{filme.nome}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                          <span>Gênero: {filme.genero}</span>
                          <div className="flex items-center space-x-1">
                            <span>Diretor: {filme.diretor}</span>
                          </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ano de lançamento: {filme.ano}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/filme/${filme.id}`}
                      className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>Ver avaliações</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Sinopse</h3>
                    <p className="text-gray-300 leading-relaxed line-clamp-3">{filme.descricao}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {filme.nota_media ? Math.round(filme.nota_media * 10) : 0}%
                        </span>
                      </div>
                      <span>Avaliação dos usuários</span>
                    </div>
                  </div>
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
