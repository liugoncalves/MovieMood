"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Calendar, Trash2, Edit } from "lucide-react"
import type { Filme, Avaliacao } from "../types"
import { filmeService, avaliacaoService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const FilmeDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [filme, setFilme] = useState<Filme | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [novaAvaliacao, setNovaAvaliacao] = useState("")
  const [mensagemIA, setMensagemIA] = useState<string | null>(null)
  const [avaliacaoUsuario, setAvaliacaoUsuario] = useState<Avaliacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [mensagemToast, setMensagemToast] = useState<string | null>(null)

  const { usuario, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      carregarFilme()
      carregarAvaliacoes()

      if (isAuthenticated && usuario) {
        buscarMinhaAvaliacao()
      } else {
        setAvaliacaoUsuario(null)
        setMensagemIA(null)
      }
    }
  }, [id, isAuthenticated, usuario])

  useEffect(() => {
    if (mensagemToast) {
      const timer = setTimeout(() => setMensagemToast(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [mensagemToast])

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
      const avaliacoesFilme = response.data.filter((a: Avaliacao) => a.filme === Number(id))
      setAvaliacoes(avaliacoesFilme)
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error)
    } finally {
      setLoading(false)
    }
  }

  const buscarMinhaAvaliacao = async () => {
    try {
      const response = await avaliacaoService.consultar(Number(id))
      const minha = response.data
      setAvaliacaoUsuario(minha)
      setMensagemIA(
        `🎯 Resultado da IA\n\n🧠 Sentimento detectado: ${minha.sentimento.toUpperCase()}\n⭐ Nota atribuída pela IA: ${minha.nota}\n\n📊 Análise detalhada:\n${minha.sentimento_texto.split("\n")[0]}`
      )
    } catch {
      setAvaliacaoUsuario(null)
      setMensagemIA(null)
    }
  }

  const enviarAvaliacao = async () => {
    if (!novaAvaliacao.trim() || !isAuthenticated || !usuario || avaliacaoUsuario) return

    try {
      const response = await avaliacaoService.avaliar({
        filme: Number(id),
        usuario: usuario.id,
        texto: novaAvaliacao,
        nota: 5,
      })

      setNovaAvaliacao("")
      setAvaliacaoUsuario(response.data)
      setMensagemIA(
        `🎯 Resultado da IA\n\n🧠 Sentimento detectado: ${response.data.sentimento.toUpperCase()}\n⭐ Nota atribuída pela IA: ${response.data.nota}\n\n📊 Análise detalhada:\n${response.data.sentimento_texto.split("\n")[0]}`
      )
      carregarAvaliacoes()
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
    }
  }

  const abrirModalConfirmacao = () => setModalAberto(true)
  const fecharModalConfirmacao = () => setModalAberto(false)

  const confirmarDeletarFilme = async () => {
    try {
      await filmeService.deletar(Number(id))
      fecharModalConfirmacao()

      setMensagemToast("Filme deletado com sucesso!")  // mostra toast

      setTimeout(() => {
        setMensagemToast(null) // limpa toast
        navigate("/")           // redireciona depois do toast sumir
      }, 2000) // 2 segundos mostrando o toast

    } catch (error) {
      console.error("Erro ao deletar filme:", error)
      setMensagemToast("Erro ao deletar o filme.")
      fecharModalConfirmacao()
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
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Toast */}
      {mensagemToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-300">
          {mensagemToast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/" className="hover:text-white">Início</Link>
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

          {/* Info */}
          <div className="lg:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold">{filme.nome}</h1>
              {isAuthenticated && (
                <div className="flex space-x-2">
                  <button
                    onClick={abrirModalConfirmacao}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                    title="Deletar filme"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <span>Gênero: {filme.genero}</span>
              <span>Diretor: {filme.diretor}</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Ano: {filme.ano}</span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{filme.descricao}</p>

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

        {/* Avaliação do Usuário */}
        {isAuthenticated && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Sua Avaliação</h2>
            {avaliacaoUsuario ? (
              <>
                <div className="bg-gray-800 p-6 rounded-lg mb-4">
                  <p className="text-gray-300 leading-relaxed">{avaliacaoUsuario.texto}</p>
                </div>
                {mensagemIA && (
                  <div className="bg-green-800 p-4 rounded-lg whitespace-pre-wrap">
                    {mensagemIA}
                  </div>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={novaAvaliacao}
                  onChange={(e) => setNovaAvaliacao(e.target.value)}
                  placeholder="Escreva sua avaliação aqui..."
                  className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                />
                <button
                  onClick={enviarAvaliacao}
                  className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Enviar Avaliação →
                </button>
              </>
            )}
          </div>
        )}

        {/* Avaliações */}
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
              avaliacoes.map((a) => (
                <div key={a.id} className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {a.nome_usuario?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{a.nome_usuario || "Usuário"}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{a.texto}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 text-lg">
                Ainda não foi feita nenhuma avaliação
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full text-white">
            <h3 className="text-xl font-semibold mb-4">Confirmação</h3>
            <p className="mb-6">Tem certeza que deseja deletar este filme?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={fecharModalConfirmacao}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDeletarFilme}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilmeDetalhes
