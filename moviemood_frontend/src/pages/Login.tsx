"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Film } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")

    try {
      const sucesso = await login(email, senha)
      if (sucesso) {
        navigate("/")
      } else {
        setErro("Email ou senha incorretos")
      }
    } catch (error) {
      setErro("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-white text-2xl font-bold mb-2 text-center">Entre na sua conta</h1>
          <p className="text-gray-400 text-center mb-8">Digite seu e-mail abaixo para entrar na sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Insira seu email"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-white text-sm font-medium mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Insira sua senha"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {erro && <div className="text-red-400 text-sm text-center">{erro}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Não possui uma conta? </span>
            <Link to="/cadastro" className="text-blue-400 hover:text-blue-300">
              Cadastre-se aqui
            </Link>
          </div>
        </div>
      </div>

      {/* Lado direito - Logo e slogan */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-white rounded-3xl p-6 mb-6 inline-block">
            <Film className="w-16 h-16 text-gray-900" />
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">MovieMood</h2>
          <p className="text-gray-300 text-xl">Seu site de Avaliações preferido!</p>
        </div>
      </div>
    </div>
  )
}

export default Login
