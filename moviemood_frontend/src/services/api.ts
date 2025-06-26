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
}

// Serviço de login
export const authService = {
  login: (dados: any) => api.post("/login/", dados),
}
