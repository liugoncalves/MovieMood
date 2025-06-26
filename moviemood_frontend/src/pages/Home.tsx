"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import FilmeCard from "../components/FilmeCard"
import type { Filme } from "../types"
import { filmeService } from "../services/api"

const Home: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeDestaque, setFilmeDestaque] = useState<Filme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarFilmes()
  }, [])

  const carregarFilmes = async () => {
    try {
      const response = await filmeService.listar()
      const filmesData = response.data
      setFilmes(filmesData)

      // Selecionar filme em destaque (primeiro da lista ou com maior nota)
      if (filmesData.length > 0) {
        const destaque = filmesData.reduce((prev: Filme, current: Filme) =>
          (current.nota_media || 0) > (prev.nota_media || 0) ? current : prev,
        )
        setFilmeDestaque(destaque)
      }
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filmesPorGenero = (genero: string) => {
    return filmes.filter((filme) => filme.genero.toLowerCase().includes(genero.toLowerCase())).slice(0, 6)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Filme em Destaque */}
      {filmeDestaque && (
        <div className="relative h-96 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase">{filmeDestaque.titulo}</h1>
              <p className="text-lg mb-6 line-clamp-3">{filmeDestaque.sinopse}</p>
              <div className="flex items-center space-x-6 text-sm mb-6">
                <span className="bg-gray-700 px-3 py-1 rounded">{filmeDestaque.classificacao_indicativa}</span>
                <span>Ano de lançamento: {filmeDestaque.ano_lancamento}</span>
                <span>Gênero: {filmeDestaque.genero}</span>
                <span>Duração: {filmeDestaque.duracao}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carrossel de Filmes Recomendados */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Filmes Recomendados</h2>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filmes.slice(0, 6).map((filme) => (
            <FilmeCard key={filme.id} filme={filme} />
          ))}
        </div>
      </section>

      {/* Filmes por Categoria */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Filmes por categoria</h2>

        {/* Comédia */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Comédia</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filmesPorGenero("comédia").map((filme) => (
              <FilmeCard key={filme.id} filme={filme} />
            ))}
          </div>
        </div>

        {/* Ação */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Ação</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filmesPorGenero("ação").map((filme) => (
              <FilmeCard key={filme.id} filme={filme} />
            ))}
          </div>
        </div>

        {/* Horror */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Horror</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filmesPorGenero("horror").map((filme) => (
              <FilmeCard key={filme.id} filme={filme} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
