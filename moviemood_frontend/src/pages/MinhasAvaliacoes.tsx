"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Star, Film } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { avaliacaoService, filmeService } from "../services/api"
import type { Avaliacao, Filme } from "../types"

interface AvaliacaoComFilme extends Avaliacao {
  filme: Filme
}

const MinhasAvaliacoes: React.FC = () => {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoComFilme[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      carregarMinhasAvaliacoes()
    }
  }, [isAuthenticated])

  const carregarMinhasAvaliacoes = async () => {
    try {
      const response = await avaliacaoService.minhasAvaliacoes()
      const avaliacoesData = response.data

      // Buscar dados dos filmes para cada avaliação
      const avaliacoesComFilmes = await Promise.all(
        avaliacoesData.map(async (avaliacao: Avaliacao) => {
          try {
            // Se o filme já é um objeto, usar diretamente
            if (typeof avaliacao.filme === 'object' && avaliacao.filme !== null) {
              return {
                ...avaliacao,
                filme: avaliacao.filme as Filme
              }
            }

            // Se é apenas o ID, buscar os dados do filme
            const filmeId = typeof avaliacao.filme === 'number' ? avaliacao.filme : Number(avaliacao.filme)
            const filmeResponse = await filmeService.consultar(filmeId)
            return {
              ...avaliacao,
              filme: filmeResponse.data
            }
          } catch (error) {
            console.error(`Erro ao carregar filme ${avaliacao.filme}:`, error)
            // Retornar avaliação com filme vazio em caso de erro
            return {
              ...avaliacao,
              filme: {
                id: typeof avaliacao.filme === 'number' ? avaliacao.filme : Number(avaliacao.filme),
                nome: 'Filme não encontrado',
                descricao: '',
                diretor: '',
                genero: '',
                ano: 0
              }
            }
          }
        })
      )

      setAvaliacoes(avaliacoesComFilmes)
    } catch (error: any) {
      console.error("Erro ao carregar minhas avaliações:", error)
      setAvaliacoes([])
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Você precisa estar logado para ver suas avaliações</div>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition-colors">
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando suas avaliações...</div>
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
          <span>Minhas Avaliações</span>
        </div>
      </div>

      {/* Título */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Minhas Avaliações</h1>

        {/* Lista de Avaliações */}
        <div className="space-y-8">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="card-dark flex flex-col md:flex-row gap-6 items-start md:items-stretch">
              {/* Poster do Filme */}
              <div className="w-full md:w-40 h-60 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                {avaliacao.filme.poster ? (
                  <img
                    src={`http://localhost:8000/imgs/posters/${encodeURIComponent(avaliacao.filme.poster)}`}
                    alt={avaliacao.filme.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${avaliacao.filme.poster ? 'hidden' : ''}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-gray-400 text-sm">{avaliacao.filme.nome}</div>
                  </div>
                </div>
              </div>

              {/* Informações da Avaliação */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{avaliacao.filme.nome}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
                    <span>Gênero: {avaliacao.filme.genero}</span>
                    <span>Diretor: {avaliacao.filme.diretor}</span>
                    <span><Calendar className="w-4 h-4 inline-block mr-1" />{avaliacao.filme.ano}</span>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-white">Seu Comentário</span>
                    <p className="text-gray-300 leading-relaxed line-clamp-3 mt-1">{avaliacao.texto}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <div className="circle-green">
                      <span className="text-lg font-bold">{avaliacao.nota ? Math.round(avaliacao.nota * 10) : 0}%</span>
                    </div>
                    <span className="text-white font-medium">Sua Nota</span>
                  </div>
                  <Link
                    to={`/filme/${avaliacao.filme.id}`}
                    className="btn-white"
                  >
                    Ver Filme
                  </Link>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Avaliado em: {avaliacao.criado_em && new Date(avaliacao.criado_em).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {avaliacoes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">Você ainda não fez nenhuma avaliação</div>
            <Link to="/home" className="btn-white px-6 py-3 text-lg rounded-xl justify-center inline-flex">
              Ver Filmes
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MinhasAvaliacoes 