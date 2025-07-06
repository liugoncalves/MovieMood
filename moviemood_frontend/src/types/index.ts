export interface Usuario {
  id?: number
  nome: string
  email: string
  cpf: string
  senha?: string
  confirmado?: boolean
  cargo?: string
  is_active?: boolean
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
  filme: number | Filme
  nota: number
  texto?: string
  comentario?: string
  criado_em?: string
  data_avaliacao?: string
  nome_usuario?: string
  sentimento?: string
  sentimento_texto?: string
  cpf_usuario?: string
}

export interface AuthContextType {
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<{ success: boolean; needsConfirmation?: boolean; cpf?: string }>
  logout: () => void
  cadastrar: (dados: Omit<Usuario, "id"> & { confirmar_senha: string }) => Promise<void>;
  isAuthenticated: boolean
}
