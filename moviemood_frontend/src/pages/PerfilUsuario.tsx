"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Edit, Trash2, Save, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { usuarioService } from "../services/api"

const PerfilUsuario: React.FC = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [editando, setEditando] = useState(false)
  const [modalConfirmacao, setModalConfirmacao] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
  })

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
      })
    }
  }, [usuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAtualizar = async () => {
    if (!usuario?.cpf) return

    setLoading(true)
    setErro("")
    setSucesso("")

    try {
      await usuarioService.atualizar(usuario.cpf, formData)
      setSucesso("Dados atualizados com sucesso!")
      setEditando(false)

      // Atualiza o contexto com os novos dados
      // Aqui você precisaria atualizar o contexto de autenticação
      setTimeout(() => {
        setSucesso("")
      }, 3000)
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error)
      setErro(error.response?.data?.erro || "Erro ao atualizar dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletar = async () => {
    if (!usuario?.cpf) return

    setLoading(true)
    setErro("")

    try {
      await usuarioService.deletar(usuario.cpf)
      setModalConfirmacao(false)
      logout() // Faz logout e redireciona
    } catch (error: any) {
      console.error("Erro ao deletar usuário:", error)
      setErro(error.response?.data?.erro || "Erro ao deletar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const cancelarEdicao = () => {
    setFormData({
      nome: usuario?.nome || "",
      email: usuario?.email || "",
      cpf: usuario?.cpf || "",
    })
    setEditando(false)
    setErro("")
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-white text-xl">Usuário não encontrado</div>
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
          <span>Meu Perfil</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <div className="flex space-x-2">
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="btn-white-sm bg-black text-white hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAtualizar}
                    disabled={loading}
                    className="btn-white-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={cancelarEdicao}
                    className="btn-white-sm bg-gray-600 text-white hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mensagens */}
          {sucesso && (
            <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg">
              <span className="text-green-400">{sucesso}</span>
            </div>
          )}

          {erro && (
            <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
              <span className="text-red-400">{erro}</span>
            </div>
          )}

          {/* Card do Perfil */}
          <div className="card-dark">
            <div className="flex items-center space-x-4 mb-6">
              <div className="avatar">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{usuario.nome}</h2>
                <p className="text-gray-400">{usuario.cargo === "gerente" ? "Gerente" : "Usuário"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                {editando ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="input-dark"
                    required
                  />
                ) : (
                  <div className="bg-[#18181b] px-4 py-3 rounded-lg border border-gray-700">
                    {usuario.nome}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                {editando ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-dark"
                    required
                  />
                ) : (
                  <div className="bg-[#18181b] px-4 py-3 rounded-lg border border-gray-700">
                    {usuario.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CPF</label>
                <div className="bg-[#18181b] px-4 py-3 rounded-lg border border-gray-700">
                  {usuario.cpf}
                </div>
                <p className="text-xs text-gray-500 mt-1">O CPF não pode ser alterado</p>
              </div>
            </div>

            {/* Botão de Deletar Conta */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={() => setModalConfirmacao(true)}
                className="btn-white-sm bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Conta
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {modalConfirmacao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#0F0F11] rounded-lg p-6 max-w-sm w-full text-white">
            <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="mb-6 text-gray-300">
              Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalConfirmacao(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletar}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Deletando..." : "Deletar Conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfilUsuario 