"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Calendar, Clock, Trash2, Edit } from "lucide-react"
import type { Filme, Avaliacao } from "../types"
import { filmeService, avaliacaoService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const FilmeDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [filme, setFilme] = useState<Filme | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [novaAvaliacao, setNovaAvaliacao] = useState("")
  const [loading, setLoading] = useState(true)
  const { usuario, isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      carregarFilme()
      carregarAvaliacoes()
    }
  }, [id])

  const carregarFilme = async () => {
    try {
      const response = await filmeService.consultar(Number(id))
      setFilme(response.data)
    } catch (error) {
      console.error("Erro ao carregar filme:", error)
    }
  }

  const carregarAvaliacoes = async () => {
    try {
      const response = await avaliacaoService.listar()
      const avaliacoesFilme = response.data.filter((avaliacao: Avaliacao) => avaliacao.filme === Number(id))
      setAvaliacoes(avaliacoesFilme)
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error)
    } finally {
      setLoading(false)
    }
  }

  const enviarAvaliacao = async () => {
    if (!novaAvaliacao.trim() || !isAuthenticated || !usuario) return

    try {
      await avaliacaoService.avaliar({
        filme: Number(id),
        usuario: usuario.id,
        comentario: novaAvaliacao,
        nota: 5, // Nota padrão, pode ser implementado um sistema de estrelas
      })
      setNovaAvaliacao("")
      carregarAvaliacoes()
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!filme) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Filme não encontrado</div>
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
          <span>{filme.nome}</span>
        </div>
      </div>

      {/* Detalhes do Filme */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="lg:w-1/3">
            <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
              {filme.poster ? (
                <img
                  src={`http://localhost:8000/imgs/posters/${filme.poster}`}
                  alt={filme.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-gray-400">Sem imagem</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="lg:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold">{filme.nome}</h1>
              {isAuthenticated && (
                <div className="flex space-x-2">
                  <button className="p-2 bg-red-600 rounded-lg hover:bg-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <span className="bg-gray-700 px-3 py-1 rounded text-sm">{filme.classificacao_indicativa}</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Ano de lançamento: {filme.ano_lancamento}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Gênero: {filme.genero}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Duração: {filme.duracao}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-300 leading-relaxed">{filme.descricao}</p>
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {filme.nota_media ? Math.round(filme.nota_media * 10) : 0}%
                  </span>
                </div>
                <span className="text-lg">Avaliação dos usuários</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção IA */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Segundo nossa IA</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{filme.nota_media ? Math.round(filme.nota_media * 10) : 0}%</span>
            </div>
            <span className="text-lg">Avaliação dos usuários</span>
          </div>
        </div>

        {/* Fazer Avaliação */}
        {isAuthenticated && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Faça sua avaliação sobre o filme</h2>
            <div className="flex gap-4">
              <textarea
                value={novaAvaliacao}
                onChange={(e) => setNovaAvaliacao(e.target.value)}
                placeholder="Escreva sua avaliação aqui..."
                className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
              />
              <button
                onClick={enviarAvaliacao}
                className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors self-start"
              >
                Enviar Avaliação →
              </button>
            </div>
          </div>
        )}

        {/* Avaliações dos Usuários */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Avaliações dos Usuários</h2>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {avaliacao.nome_usuario?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{avaliacao.nome_usuario || "Usuário"}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{avaliacao.comentario}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg">Ainda não foi feita nenhuma avaliação</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilmeDetalhes
