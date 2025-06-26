"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Upload, Trash2, Edit } from "lucide-react"
import { filmeService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const CadastroFilme: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: "",
    ano: new Date().getFullYear(),
    genero: "",
    descricao: "",
    diretor: "",
    poster: null as File | null,
  })
  const [posterName, setPosterName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement

    if (name === "poster" && files && files.length > 0) {
      const file = files[0]
      setFormData((prev) => ({
        ...prev,
        poster: file,
      }))
      setPosterName(file.name)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "ano" ? parseInt(value) || new Date().getFullYear() : value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")

    try {
      const data = new FormData()
      data.append("nome", formData.nome)
      data.append("ano", String(formData.ano))
      data.append("genero", formData.genero)
      data.append("descricao", formData.descricao)
      data.append("diretor", formData.diretor)
      if (formData.poster) {
        data.append("poster", formData.poster)
      }

      const response = await filmeService.cadastrar(data)
      if (response.status === 201 || response.data.success) {
        setSucesso(true)
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        setErro("Erro ao cadastrar filme. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao cadastrar filme:", error)
      setErro("Erro ao cadastrar filme. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-white text-2xl font-bold mb-2">Filme cadastrado com sucesso!</h2>
          <p className="text-gray-400">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link to="/" className="hover:text-white">Início</Link>
          <span>›</span>
          <span>Cadastro de Filmes</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-8">
              <div className="w-1/3">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-500 transition-colors relative">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">188x288</p>
                    {posterName && (
                      <p className="text-xs mt-2 text-gray-300 truncate">{posterName}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="poster"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Cadastro de Filme</h1>
                  <div className="flex space-x-2">
                    <button type="button" className="p-2 bg-red-600 rounded-lg hover:bg-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Insira o título do filme"
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gênero</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Ação">Ação</option>
                      <option value="Aventura">Aventura</option>
                      <option value="Comédia">Comédia</option>
                      <option value="Drama">Drama</option>
                      <option value="Ficção científica">Ficção científica</option>
                      <option value="Horror">Horror</option>
                      <option value="Romance">Romance</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Fantasia">Fantasia</option>
                      <option value="Mistério">Mistério</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Diretor</label>
                    <input
                      type="text"
                      name="diretor"
                      value={formData.diretor}
                      onChange={handleChange}
                      placeholder="Diretor"
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ano de lançamento</label>
                    <input
                      type="number"
                      name="ano"
                      value={formData.ano}
                      onChange={handleChange}
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sinopse</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Escreva a sinopse do filme aqui..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">0%</span>
                  </div>
                  <span>Não há Avaliações</span>
                </div>

                {erro && <div className="text-red-400 text-sm">{erro}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Cadastrando..." : "+ Cadastrar"}
                </button>
              </div>
            </div>
          </form>

          {/* IA e Avaliação estão mantidos sem alterações */}
        </div>
      </div>
    </div>
  )
}

export default CadastroFilme
