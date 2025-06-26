export interface Usuario {
  id?: number
  nome: string
  email: string
  cpf: string
  senha?: string
  confirmado?: boolean
}

export interface Filme {
  id?: number
  nome: string
  descricao: string
  diretor: string
  genero: string
  ano: number
  poster?: string
  nota_media?: number
  numero_avaliacoes?: number
}

export interface Avaliacao {
  id?: number
  usuario: number
  filme: number
  nota: number
  comentario: string
  data_avaliacao?: string
  nome_usuario?: string
}

export interface AuthContextType {
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
  cadastrar: (dados: Omit<Usuario, "id"> & { confirmar_senha: string }) => Promise<boolean>
  isAuthenticated: boolean
}
