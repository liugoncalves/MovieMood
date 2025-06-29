import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem("token", access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("usuario")
          window.location.href = "/"
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Serviços de usuários
export const usuarioService = {
  listar: () => api.get("/usuarios/listar"),
  cadastrar: (dados: any) => api.post("/usuarios/cadastrar/", dados),
  consultar: (cpf: string) => api.get(`/usuarios/consultar/${cpf}`),
  atualizar: (cpf: string, dados: any) => api.put(`/usuarios/atualizar/${cpf}/`, dados),
  deletar: (cpf: string) => api.delete(`/usuarios/deletar/${cpf}/`),
  confirmar: (cpf: string, codigo: string) => api.get(`/usuarios/confirmar/?cpf=${cpf}&codigo=${codigo}`),
}

// Serviços de filmes
export const filmeService = {
  listar: () => api.get("/filmes/listar"),
  cadastrar: (dados: any) => api.post("/filmes/cadastrar/", dados),
  consultar: (id: number) => api.get(`/filmes/consultar/${id}`),
  atualizar: (id: number, dados: any) => api.put(`/filmes/atualizar/${id}`, dados),
  deletar: (id: number) => api.delete(`/filmes/deletar/${id}`),
  ranking: (ordem = "melhores") => api.get(`/filmes/ranking/?ordem=${ordem}`),
  filtrar: (genero?: string, ordem_nota?: string) => {
    let url = "/filmes/filtrar/?"
    if (genero) url += `genero=${genero}&`
    if (ordem_nota) url += `ordem_nota=${ordem_nota}`
    return api.get(url)
  },
}

// Serviços de avaliações
export const avaliacaoService = {
  listar: () => api.get("/avaliacoes/listar"),
  avaliar: (dados: any) => api.post("/avaliacoes/avaliar/", dados),
  consultar: (filmeId: number) => api.get(`/avaliacoes/consultar/${filmeId}/`),
  minhasAvaliacoes: () => api.get("/avaliacoes/minhas-avaliacoes"),
}

// Serviço de login
export const authService = {
  login: (dados: any) => api.post("/login/", dados),
}
