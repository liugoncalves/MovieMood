"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Film } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmar_senha: "",
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")

    if (formData.senha !== formData.confirmar_senha) {
      setErro("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const sucesso = await cadastrar(formData)
      if (sucesso) {
        setSucesso(true)
        setTimeout(() => {
          navigate("/confirmacao")
        }, 2000)
      } else {
        setErro("Erro ao cadastrar usuário. Verifique os dados e tente novamente.")
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error)
      setErro(error.response?.data?.erro || "Erro ao cadastrar usuário. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-white text-2xl font-bold mb-2">Cadastro realizado com sucesso!</h2>
          <p className="text-gray-400">Verifique seu email e confirme sua conta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {/* Lado esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-white text-2xl font-bold mb-2 text-center">Cadastre sua conta</h1>
          <p className="text-gray-400 text-center mb-8">Digite seu e-mail e senha abaixo para criar sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-white text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Insira seu nome completo"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Insira seu email"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-white text-sm font-medium mb-2">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-white text-sm font-medium mb-2">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Insira sua senha"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmar_senha" className="block text-white text-sm font-medium mb-2">
                Confirme sua senha
              </label>
              <input
                id="confirmar_senha"
                name="confirmar_senha"
                type="password"
                value={formData.confirmar_senha}
                onChange={handleChange}
                placeholder="Insira sua senha"
                className="input-dark"
                required
              />
            </div>

            {erro && <div className="text-red-400 text-sm text-center">{erro}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-white py-3 text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Já possui uma conta? </span>
            <Link to="/login" className="hover:underline" style={{ color: '#FEFEFE' }}>
              Entrar
            </Link>
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
          <p className="text-gray-300 text-xl">Seu site de Avaliações preferido!</p>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
