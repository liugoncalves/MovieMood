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

  // ✅ Verifica se há token e dados salvos no localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("usuario")
    if (token && userData) {
      setUsuario(JSON.parse(userData))
      setIsAuthenticated(true)
    }
  }, [])

  // ✅ Faz login, salva no localStorage e atualiza o estado
  const login = async (email: string, senha: string): Promise<{ success: boolean; needsConfirmation?: boolean; cpf?: string }> => {
    try {
      const response = await api.post("/login/", { email, password: senha })
      if (response.data.access) {
        const userData = {
          id: response.data.id,
          cargo: response.data.cargo,
          nome: response.data.nome,
          cpf: response.data.cpf,
          email: email,
        }
        setUsuario(userData)
        setIsAuthenticated(true)
        localStorage.setItem("token", response.data.access)
        localStorage.setItem("refresh_token", response.data.refresh)
        localStorage.setItem("usuario", JSON.stringify(userData))
        return { success: true }
      }
      return { success: false }
    } catch (error: any) {
      console.error("Erro no login:", error)
      console.log("Status do erro:", error.response?.status)
      console.log("Dados do erro:", error.response?.data)

      // Verifica se o erro indica que o usuário precisa confirmar a conta
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Tenta extrair informações do erro
        const errorData = error.response?.data
        const errorMessage = errorData?.detail || errorData?.erro || errorData?.message || ""

        console.log("Mensagem de erro extraída:", errorMessage)

        // Verifica se a mensagem indica necessidade de confirmação
        if (errorMessage.toLowerCase().includes("confirmar") ||
          errorMessage.toLowerCase().includes("confirmação") ||
          errorMessage.toLowerCase().includes("não confirmado") ||
          errorMessage.toLowerCase().includes("nao confirmado") ||
          errorMessage.toLowerCase().includes("conta não confirmada") ||
          errorMessage.toLowerCase().includes("conta nao confirmada")) {

          console.log("Detectada necessidade de confirmação!")

          // Extrai o CPF da resposta de erro se disponível
          const cpf = errorData?.cpf || ""
          return {
            success: false,
            needsConfirmation: true,
            cpf: cpf
          }
        }
      }

      // Para outros tipos de erro, verifica se há indicação de confirmação necessária
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.erro ||
        error.response?.data?.message ||
        error.message || ""

      console.log("Verificando mensagem de erro geral:", errorMessage)

      if (errorMessage.toLowerCase().includes("confirmar") ||
        errorMessage.toLowerCase().includes("confirmação") ||
        errorMessage.toLowerCase().includes("não confirmado") ||
        errorMessage.toLowerCase().includes("nao confirmado")) {

        console.log("Detectada necessidade de confirmação na verificação geral!")

        const cpf = error.response?.data?.cpf || ""
        return {
          success: false,
          needsConfirmation: true,
          cpf: cpf
        }
      }

      // Se chegou até aqui e é um erro 401, pode ser um usuário não confirmado
      // Vamos assumir que é necessário confirmação e deixar o usuário tentar
      if (error.response?.status === 401) {
        console.log("Erro 401 detectado - assumindo necessidade de confirmação")
        return {
          success: false,
          needsConfirmation: true,
          cpf: ""
        }
      }

      return { success: false }
    }
  }

  // ✅ Faz logout e limpa tudo
  const logout = () => {
    setUsuario(null)
    setIsAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("usuario")
    // Redireciona para a página de login após logout
    window.location.href = "/"
  }

  // ✅ Corrigido: agora lança erro para o componente tratar
  const cadastrar = async (
    dados: Omit<Usuario, "id"> & { confirmar_senha: string }
  ): Promise<void> => {
    const { confirmar_senha, ...dadosUsuario } = dados
    const response = await api.post("/usuarios/cadastrar/", dadosUsuario)

    // Você pode opcionalmente validar status se quiser
    if (!(response.status === 200 || response.status === 201)) {
      throw new Error("Erro ao cadastrar") // só por garantia
    }
  }


  return (
    <AuthContext.Provider value={{ usuario, login, logout, cadastrar, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
