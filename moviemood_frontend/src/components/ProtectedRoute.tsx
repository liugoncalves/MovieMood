"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login"
}) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 