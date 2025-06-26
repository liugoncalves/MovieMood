"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, User, LogOut, Film } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { usuario, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8" />
            <span className="text-xl font-bold">MovieMood</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Início
            </Link>
            <Link to="/ranking" className="hover:text-blue-400 transition-colors">
              Ranking de Filmes
            </Link>
            {isAuthenticated && (
              <Link to="/cadastro-filme" className="hover:text-blue-400 transition-colors">
                Cadastro de Filmes
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Digite um filme"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </form>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{usuario?.nome}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="border border-blue-600 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
