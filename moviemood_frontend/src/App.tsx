import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import FilmeDetalhes from "./pages/FilmeDetalhes"
import Ranking from "./pages/Ranking"
import CadastroFilme from "./pages/CadastroFilme"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/filme/:id" element={<FilmeDetalhes />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/cadastro-filme" element={<CadastroFilme />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
