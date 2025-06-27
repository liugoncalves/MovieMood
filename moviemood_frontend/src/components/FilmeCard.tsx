import type React from "react"
import { Link } from "react-router-dom"
import { Star, Calendar } from "lucide-react"
import type { Filme } from "../types"

interface FilmeCardProps {
  filme: Filme
  showActions?: boolean
  onEdit?: (filme: Filme) => void
  onDelete?: (id: number) => void
}

const FilmeCard: React.FC<FilmeCardProps> = ({ filme, showActions = false, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
      <Link to={`/filme/${filme.id}`}>
        <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
          {filme.poster ? (
            <img src={`http://localhost:8000/imgs/posters/${filme.poster}`} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">{filme.nome}</div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{filme.nome}</h3>

        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{filme.ano}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white font-semibold">
              {filme.nota_media ? `${filme.nota_media.toFixed(1)}` : "N/A"}
            </span>
            <span className="text-gray-400 text-sm">({filme.numero_avaliacoes || 0})</span>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-blue-400 text-sm">{filme.genero}</span>
        </div>
      </div>
    </div>
  )
}

export default FilmeCard
