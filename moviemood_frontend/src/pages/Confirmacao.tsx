"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Film, CheckCircle, XCircle } from "lucide-react"
import { usuarioService } from "../services/api"

const Confirmacao: React.FC = () => {
  const [cpf, setCpf] = useState("")
  const [codigo, setCodigo] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)
  const [mensagem, setMensagem] = useState("")

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Preenche os campos se os parâmetros estiverem na URL
  useEffect(() => {
    const cpfParam = searchParams.get("cpf")
    const codigoParam = searchParams.get("codigo")

    if (cpfParam) {
      setCpf(cpfParam)
      console.log("CPF preenchido automaticamente:", cpfParam)
    }
    if (codigoParam) setCodigo(codigoParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")
    setSucesso(false)
    setMensagem("")

    try {
      const response = await usuarioService.confirmar(cpf, codigo)

      if (response.status === 200) {
        setSucesso(true)
        setMensagem("Conta confirmada com sucesso! Você pode fazer login agora.")
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } else {
        setErro(response.data.erro || "Erro ao confirmar conta")
      }
    } catch (error: any) {
      console.error("Erro na confirmação:", error)
      setErro(error.response?.data?.erro || "Erro ao confirmar conta. Verifique o CPF e código.")
    } finally {
      setLoading(false)
    }
  }

  // Verifica se veio da página de login (sem código)
  const veioDoLogin = searchParams.get("cpf") && !searchParams.get("codigo")

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-white text-2xl font-bold mb-2 text-center">
            {veioDoLogin ? "Confirmar Conta" : "Confirmar Conta"}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {veioDoLogin
              ? "Sua conta precisa ser confirmada antes de fazer login. Digite seu CPF e código de confirmação."
              : "Digite seu CPF e código de confirmação"
            }
          </p>

          {veioDoLogin && (
            <div className="mb-6 p-4 bg-blue-900 border border-blue-600 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-blue-400">ℹ️</div>
                <span className="text-blue-400 text-sm">
                  {searchParams.get("cpf")
                    ? "Se você foi cadastrado diretamente no sistema, entre em contato com o administrador para obter seu código de confirmação."
                    : "Digite seu CPF e o código de confirmação que você recebeu. Se você foi cadastrado diretamente no sistema, entre em contato com o administrador."
                  }
                </span>
              </div>
            </div>
          )}

          {sucesso && (
            <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">{mensagem}</span>
              </div>
            </div>
          )}

          {erro && (
            <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{erro}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-white text-sm font-medium mb-2">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label htmlFor="codigo" className="block text-white text-sm font-medium mb-2">
                Código de Confirmação
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Digite o código recebido"
                className="input-dark"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-white py-3 text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Confirmando..." : "Confirmar Conta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Já tem uma conta confirmada? </span>
            <button
              onClick={() => navigate("/login")}
              className="hover:underline"
              style={{ color: '#FEFEFE' }}
            >
              Faça login aqui
            </button>
          </div>
        </div>
      </div>

      {/* Lado direito - Logo e slogan */}
      <div className="flex-1 bg-[#09090B] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-white rounded-3xl p-6 mb-6 inline-block">
            <Film className="w-16 h-16 text-gray-900" />
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">MovieMood</h2>
          <p className="text-gray-300 text-xl">
            {veioDoLogin ? "Confirme sua conta para começar!" : "Confirme sua conta!"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Confirmacao 