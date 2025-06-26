"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Usuario, AuthContextType } from "../types"
import { api } from "../services/api"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("usuario")
    if (token && userData) {
      setUsuario(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await api.post("/login/", { email, password: senha });
      if (response.data.access) {
        const userData = {
          cargo: response.data.cargo,
          nome: response.data.nome,
          cpf: response.data.cpf,
          email: email,
        };
        setUsuario(userData);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("usuario", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  }


  const logout = () => {
    setUsuario(null)
    setIsAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
  }

  const cadastrar = async (dados: Omit<Usuario, "id"> & { confirmar_senha: string }): Promise<boolean> => {
    try {
      const { confirmar_senha, ...dadosUsuario } = dados
      const response = await api.post("/usuarios/cadastrar/", dadosUsuario)
      return response.data.success || response.status === 201
    } catch (error) {
      console.error("Erro no cadastro:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cadastrar, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
