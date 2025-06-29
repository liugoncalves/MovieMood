"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, User, LogOut, Film, Filter, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { generos as generosPFiltro } from "../utils/generos"

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [generoFiltro, setGeneroFiltro] = useState("")
  const [modalAberto, setModalAberto] = useState(false)
  const [dropdownUsuario, setDropdownUsuario] = useState(false)
  const { usuario, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const generos = [
    { valor: "", label: "Todos os gêneros" },
    ...generosPFiltro
  ]
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const params = new URLSearchParams()
      params.append('q', searchTerm.trim())
      if (generoFiltro) {
        params.append('genero', generoFiltro)
      }
      navigate(`/buscar?${params.toString()}`)
    } else if (generoFiltro) {
      // Se só tem filtro de gênero, navega para busca com filtro
      navigate(`/buscar?genero=${generoFiltro}`)
    }
  }

  const handleGeneroChange = (genero: string) => {
    setGeneroFiltro(genero)
    setModalAberto(false)

    if (genero) {
      // Navega diretamente para busca com filtro de gênero
      navigate(`/buscar?genero=${genero}`)
    } else {
      // Se selecionou "Todos os gêneros", navega para busca sem filtro
      navigate(`/buscar`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const generoSelecionado = generos.find(g => g.valor === generoFiltro)?.label || "Filtrar"
  const isHomePage = location.pathname === "/home"

  // Componente do Modal usando Portal
  const ModalPortal = () => {
    if (!modalAberto) return null

    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-60" style={{ zIndex: 999999999 }} onClick={() => setModalAberto(false)}>
        <div
          className="absolute bg-[#0F0F11] border border-gray-700 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 max-h-[60vh] overflow-hidden flex flex-col"
          style={{
            top: '80px',
            right: '16px',
            transform: 'translateX(0)',
            minWidth: '280px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-white">Filtrar por Gênero</h3>
            <button
              onClick={() => setModalAberto(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {generos.map((genero) => (
              <button
                key={genero.valor}
                type="button"
                onClick={() => handleGeneroChange(genero.valor)}
                className={`w-full text-left px-4 py-3 rounded-lg hover:bg-[#23232a] transition-colors ${genero.valor === generoFiltro ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
              >
                {genero.label}
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // Componente do Dropdown do Usuário usando Portal
  const DropdownUsuarioPortal = () => {
    if (!dropdownUsuario) return null

    // Calcular posição baseada no botão do usuário
    const buttonElement = dropdownRef.current?.querySelector('button')
    const buttonRect = buttonElement?.getBoundingClientRect()

    return createPortal(
      <>
        {/* Overlay transparente para fechar o dropdown */}
        <div
          className="fixed inset-0 z-[999999998]"
          onClick={() => setDropdownUsuario(false)}
        />
        <div
          data-dropdown="user"
          className="fixed bg-[#0F0F11] border border-gray-700 rounded-lg shadow-lg w-48"
          style={{
            top: buttonRect ? buttonRect.bottom + 8 : '80px',
            left: buttonRect ? buttonRect.left : 'auto',
            right: buttonRect ? 'auto' : '16px',
            zIndex: 999999999,
          }}
        >
          <div className="py-1">
            <Link
              to="/perfil"
              onClick={() => setDropdownUsuario(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#23232a] transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Editar Perfil
            </Link>
            <button
              onClick={() => {
                setDropdownUsuario(false)
                handleLogout()
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#23232a] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </>,
      document.body
    )
  }

  return (
    <header className="bg-[#424242]/[.10] text-white p-4 backdrop-blur header-z-index">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/home" className="flex items-center space-x-2">
            <Film className="w-8 h-8" />
            <span className="text-xl font-bold">MovieMood</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              to="/home"
              className={`transition-colors ${location.pathname === '/home'
                ? 'text-white border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-white hover:pb-1'
                }`}
            >
              Início
            </Link>
            <Link
              to="/ranking"
              className={`transition-colors ${location.pathname === '/ranking'
                ? 'text-white border-b-2 border-white pb-1'
                : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-white hover:pb-1'
                }`}
            >
              Ranking de Filmes
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/minhas-avaliacoes"
                  className={`transition-colors ${location.pathname === '/minhas-avaliacoes'
                    ? 'text-white border-b-2 border-white pb-1'
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-white hover:pb-1'
                    }`}
                >
                  Minhas Avaliações
                </Link>
                {usuario?.cargo === "gerente" && (
                  <Link
                    to="/cadastro-filme"
                    className={`transition-colors ${location.pathname === '/cadastro-filme'
                      ? 'text-white border-b-2 border-white pb-1'
                      : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-white hover:pb-1'
                      }`}
                  >
                    Cadastro de Filmes
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Digite um filme"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark pr-10 py-2"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Botão de Filtro por Gênero */}
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className={`px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center justify-center ${generoFiltro
                ? 'bg-gray-600 border-gray-500 text-white hover:bg-gray-700'
                : 'bg-[#18181b] border-gray-700 text-gray-400 hover:border-white hover:text-white'
                }`}
              title={generoFiltro ? `Filtro ativo: ${generoSelecionado}` : "Filtrar por gênero"}
            >
              <Filter className="w-4 h-4" />
            </button>
          </form>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownUsuario(!dropdownUsuario)}
                className="flex items-center space-x-2 hover:bg-[#232323] rounded-lg px-3 py-2 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{usuario?.nome}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownUsuario ? 'rotate-180' : ''}`} />
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

      {/* Modal usando Portal */}
      <ModalPortal />

      {/* Dropdown do Usuário usando Portal */}
      <DropdownUsuarioPortal />
    </header>
  )
}

export default Header
