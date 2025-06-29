"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Calendar, Trash2, Edit, User, X } from "lucide-react"
import type { Filme, Avaliacao, Usuario } from "../types"
import { filmeService, avaliacaoService, usuarioService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { generos } from "../utils/generos"


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
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
  const [editData, setEditData] = useState<Filme | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editErro, setEditErro] = useState("")
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null)
  const [loadingUsuario, setLoadingUsuario] = useState(false)
  const [paginaAvaliacoes, setPaginaAvaliacoes] = useState(0)
  const avaliacoesPorPagina = 4

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
    } catch (error: any) {
      console.error("Erro ao carregar filme:", error)
      setFilme(null)
    }
  }

  const carregarAvaliacoes = async () => {
    try {
      const response = await avaliacaoService.listar()

      const avaliacoesFilme = response.data.filter((a: Avaliacao) => {
        // Verifica se o filme é um objeto ou um ID
        if (typeof a.filme === 'object' && a.filme !== null) {
          return a.filme.id === Number(id)
        } else {
          return a.filme === Number(id)
        }
      })

      // Buscar todos os usuários para fazer o mapeamento
      let usuariosMap: { [key: number]: { nome: string; cpf: string } } = {}
      try {
        const usuariosResponse = await usuarioService.listar()
        usuariosResponse.data.forEach((user: any) => {
          if (user.id) {
            usuariosMap[user.id] = {
              nome: user.nome,
              cpf: user.cpf
            }
          }
        })
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
      }

      // Mapear avaliações com dados do usuário
      const avaliacoesComUsuario = avaliacoesFilme.map((avaliacao: Avaliacao) => {
        // Se já tem nome do usuário, usar
        if (avaliacao.nome_usuario && avaliacao.cpf_usuario) {
          return avaliacao
        }

        // Se não tem, buscar no mapa de usuários
        if (avaliacao.usuario && usuariosMap[avaliacao.usuario]) {
          return {
            ...avaliacao,
            nome_usuario: usuariosMap[avaliacao.usuario].nome,
            cpf_usuario: usuariosMap[avaliacao.usuario].cpf
          }
        }

        return {
          ...avaliacao,
          nome_usuario: "Usuário",
          cpf_usuario: ""
        }
      })

      setAvaliacoes(avaliacoesComUsuario)
    } catch (error: any) {
      console.error("Erro ao carregar avaliações:", error)
      setAvaliacoes([])
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
    } catch (error: any) {
      console.error("Erro ao buscar minha avaliação:", error)
      setAvaliacaoUsuario(null)
      setMensagemIA(null)
    }
  }

  const enviarAvaliacao = async () => {
    if (!novaAvaliacao.trim() || !isAuthenticated || !usuario || avaliacaoUsuario) return

    try {
      const response = await avaliacaoService.avaliar({
        filme: Number(id),
        texto: novaAvaliacao,
      })

      setNovaAvaliacao("")
      setAvaliacaoUsuario(response.data)
      setMensagemIA(
        `🎯 Resultado da IA\n\n🧠 Sentimento detectado: ${response.data.sentimento.toUpperCase()}\n⭐ Nota atribuída pela IA: ${response.data.nota}\n\n📊 Análise detalhada:\n${response.data.sentimento_texto.split("\n")[0]}`
      )

      // Recarrega as avaliações para incluir a nova
      await carregarAvaliacoes()
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error)
      alert(error.response?.data?.erro || "Erro ao enviar avaliação. Tente novamente.")
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
        navigate("/home")           // redireciona depois do toast sumir
      }, 2000) // 2 segundos mostrando o toast

    } catch (error) {
      console.error("Erro ao deletar filme:", error)
      setMensagemToast("Erro ao deletar o filme.")
      fecharModalConfirmacao()
    }
  }

  // Handler para abrir modal de edição
  const abrirModalEdicao = () => {
    if (filme) {
      // Converte o label formatado (ex: "Ação") de volta para o valor (ex: "acao")
      const generoEncontrado = generos.find((g) => g.label === filme.genero)
      const generoValor = generoEncontrado?.valor || ""

      setEditData({ ...filme, genero: generoValor})
      setModalEdicaoAberto(true)
      setEditErro("")
    }
  }
  const fecharModalEdicao = () => setModalEdicaoAberto(false)

  // Handler para atualizar campos do filme
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditData((prev) => prev ? { ...prev, [name]: name === "ano" ? parseInt(value) || new Date().getFullYear() : value } : prev)
  }

  // Handler para salvar edição
  const salvarEdicao = async () => {
    if (!editData) return
    setEditLoading(true)
    setEditErro("")
    try {
      const { poster, ...dadosParaSalvar } = editData
      await filmeService.atualizar(Number(editData.id), dadosParaSalvar)
      setModalEdicaoAberto(false)
      await carregarFilme()
      setMensagemToast("Filme atualizado com sucesso!")
    } catch (error: any) {
      setEditErro(error.response?.data?.erro || "Erro ao atualizar filme. Tente novamente.")
    } finally {
      setEditLoading(false)
    }
  }

  // Handlers para o carrossel de avaliações
  const totalPaginasAvaliacoes = Math.ceil(avaliacoes.length / avaliacoesPorPagina)
  const avaliacoesAtuais = avaliacoes.slice(
    paginaAvaliacoes * avaliacoesPorPagina,
    (paginaAvaliacoes + 1) * avaliacoesPorPagina
  )

  const proximaPaginaAvaliacoes = () => {
    setPaginaAvaliacoes((prev) => (prev + 1) % totalPaginasAvaliacoes)
  }

  const paginaAnteriorAvaliacoes = () => {
    setPaginaAvaliacoes((prev) => (prev - 1 + totalPaginasAvaliacoes) % totalPaginasAvaliacoes)
  }

  // Handler para abrir modal de usuário
  const abrirModalUsuario = async (cpf: string) => {
    if (!cpf || cpf.trim() === '') {
      console.error("CPF do usuário não encontrado")
      return
    }

    setLoadingUsuario(true)
    setModalUsuarioAberto(true)
    setUsuarioSelecionado(null)

    try {
      const response = await usuarioService.consultar(cpf)
      setUsuarioSelecionado(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar dados do usuário:", error)
      setUsuarioSelecionado(null)
    } finally {
      setLoadingUsuario(false)
    }
  }

  const fecharModalUsuario = () => {
    setModalUsuarioAberto(false)
    setUsuarioSelecionado(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!filme) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Filme não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white relative">
      {/* Toast */}
      {mensagemToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-300">
          {mensagemToast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/home" className="hover:text-white">Início</Link>
          <span>›</span>
          <span>{filme.nome}</span>
        </div>
      </div>

      {/* Detalhes do Filme */}
      <div className="container mx-auto px-4 py-8">
        <div className="card-dark flex flex-col lg:flex-row gap-8 items-start lg:items-stretch mb-10">
          {/* Poster */}
          <div className="w-full lg:w-64 h-96 bg-gray-700 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
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
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-gray-400">Sem imagem</div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">{filme.nome}</h1>
              <div className="flex flex-wrap items-center gap-4 text-base text-gray-400 mb-2">
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
              {isAuthenticated && usuario?.cargo === "gerente" && (
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={abrirModalConfirmacao}
                    className="btn-white-sm bg-red-600 text-white hover:bg-red-700"
                    title="Deletar filme"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={abrirModalEdicao} className="btn-white-sm bg-black text-white hover:bg-gray-800">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Segundo nossa IA */}
        {mensagemIA && (
          <div className="card-dark mb-10">
            <h2 className="subtitle mb-4">Segundo nossa IA</h2>
            <p className="text-gray-400 text-sm mb-4">Essa é a análise da sua avaliação sobre este filme.</p>
            <div className="bg-[#18181b] p-4 rounded-lg whitespace-pre-wrap text-gray-200">
              {mensagemIA}
            </div>
          </div>
        )}

        {/* Avaliação do Usuário */}
        {isAuthenticated && (
          <div className="card-dark mb-10">
            <h2 className="subtitle mb-4">Faça sua avaliação sobre o filme</h2>
            {avaliacaoUsuario ? (
              <div className="bg-[#18181b] p-6 rounded-lg mb-4">
                <p className="text-gray-300 leading-relaxed">{avaliacaoUsuario.texto}</p>
              </div>
            ) : (
              <>
                <textarea
                  value={novaAvaliacao}
                  onChange={(e) => setNovaAvaliacao(e.target.value)}
                  placeholder="Escreva sua avaliação aqui..."
                  className="input-dark resize-none h-32 mb-4"
                />
                <button
                  onClick={enviarAvaliacao}
                  className="btn-white"
                >
                  Enviar Avaliação
                </button>
              </>
            )}
          </div>
        )}

        {/* Avaliações dos Usuários - Carrossel */}
        <div className="mb-10">
          <h2 className="section-title">Avaliações dos Usuários</h2>

          {avaliacoes.length > 0 ? (
            <div className="relative">
              {/* Chevrons de navegação */}
              {totalPaginasAvaliacoes > 1 && (
                <>
                  <button
                    onClick={paginaAnteriorAvaliacoes}
                    className="carousel-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                    style={{ transform: 'translateY(-50%) translateX(-72px)' }}
                    title="Anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={proximaPaginaAvaliacoes}
                    className="carousel-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 shadow-lg"
                    style={{ transform: 'translateY(-50%) translateX(72px)' }}
                    title="Próximo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {avaliacoesAtuais.map((a) => (
                  <div key={a.id} className="card-dark cursor-pointer hover:bg-[#23232a] transition-colors" onClick={() => abrirModalUsuario(a.cpf_usuario || '')}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="avatar">
                        {a.nome_usuario?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-semibold">{a.nome_usuario || "Usuário"}</div>
                        <div className="text-xs text-gray-400">Clique para ver perfil</div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-2">{a.texto}</p>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div>⭐ <span className="text-white font-medium">Nota da IA:</span> {a.nota}</div>
                      <div>🧠 <span className="text-white font-medium">Sentimento:</span> {a.sentimento?.toUpperCase() || "Desconhecido"}</div>
                      <div>📅 <span className="text-white font-medium">Data:</span> {new Date(a.criado_em || a.data_avaliacao || "").toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de página */}
              {totalPaginasAvaliacoes > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPaginasAvaliacoes }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPaginaAvaliacoes(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${i === paginaAvaliacoes ? 'bg-white' : 'bg-gray-600'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            !avaliacaoUsuario && (
              <div className="text-center py-12 text-gray-400 text-lg">
                Ainda não foi feita nenhuma avaliação
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#0F0F11] rounded-lg p-6 max-w-sm w-full text-white">
            <h3 className="text-xl font-semibold mb-4">Confirmação</h3>
            <p className="mb-6">Tem certeza que deseja deletar este filme?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={fecharModalConfirmacao}
                className="px-4 py-2 rounded bg-[#FAFAFA] text-gray-900 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDeletarFilme}
                className="px-4 py-2 rounded bg-[#FAFAFA] text-red-600 font-semibold hover:bg-red-100 transition"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {modalEdicaoAberto && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#0F0F11] rounded-lg p-8 max-w-lg w-full text-white">
            <h3 className="text-2xl font-bold mb-6">Editar Filme</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input name="nome" value={editData.nome} onChange={handleEditChange} className="input-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Ano</label>
                  <input name="ano" type="number" value={editData.ano} onChange={handleEditChange} className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Gênero</label>
                  <select
                    name="genero"
                    value={editData.genero}
                    onChange={handleEditChange}
                    className="input-dark"
                  >
                    {generos.map((g) => (
                      <option key={g.valor} value={g.valor}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Diretor</label>
                <input name="diretor" value={editData.diretor} onChange={handleEditChange} className="input-dark" />
              </div>
              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea name="descricao" value={editData.descricao} onChange={handleEditChange} className="input-dark" rows={3} />
              </div>
              {editErro && <div className="text-red-400 text-sm">{editErro}</div>}
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={fecharModalEdicao} className="btn-white">
                Cancelar
              </button>
              <button onClick={salvarEdicao} disabled={editLoading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                {editLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de informações do usuário */}
      {modalUsuarioAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#0F0F11] rounded-lg p-6 max-w-md w-full text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Perfil do Usuário</h3>
              <button
                onClick={fecharModalUsuario}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingUsuario ? (
              <div className="text-center py-8">
                <div className="text-gray-400">Carregando...</div>
              </div>
            ) : usuarioSelecionado ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{usuarioSelecionado.nome}</h4>
                    <p className="text-gray-400">{usuarioSelecionado.cargo === "gerente" ? "Gerente" : "Usuário"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <div className="bg-[#18181b] px-3 py-2 rounded border border-gray-700">
                      {usuarioSelecionado.nome}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="bg-[#18181b] px-3 py-2 rounded border border-gray-700">
                      {usuarioSelecionado.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cargo</label>
                    <div className="bg-[#18181b] px-3 py-2 rounded border border-gray-700">
                      {usuarioSelecionado.cargo === "gerente" ? "Gerente" : "Usuário"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-red-400">Erro ao carregar dados do usuário</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilmeDetalhes
