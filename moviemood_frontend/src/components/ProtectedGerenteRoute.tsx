"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedGerenteRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedGerenteRoute: React.FC<ProtectedGerenteRouteProps> = ({
  children,
  redirectTo = "/home"
}) => {
  const { isAuthenticated, usuario } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (usuario?.cargo !== "gerente") {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default ProtectedGerenteRoute 