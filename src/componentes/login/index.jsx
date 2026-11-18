// src/componentes/login/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    })
    if (error) setError('Correo o contraseña no válidos')
    else navigate('/perfil')
  }

  return (
    <div className="min-vh-100 bg-info-subtle">
      <nav className="navbar bg-info text-white shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold text-white fs-3">twttr</span>
          <span className="small">¿Qué estás haciendo? • MVP 2006</span>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row justify-content-center align-items-center g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="h3 fw-bold text-info">Bienvenido a twttr</h1>
                <p className="text-muted mb-3">
                  Comparte con tus amigos lo que estás haciendo en tiempo real en
                  mensajes cortos de <strong>140 caracteres</strong>.
                </p>
                <ul className="list-unstyled small text-secondary mb-0">
                  <li>• Actualizaciones rápidas tipo SMS</li>
                  <li>• Timeline cronológico sin algoritmos</li>
                  <li>• Galería personal y perfil editable</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Iniciar sesión</h2>
                <form onSubmit={handleLogin} className="d-grid gap-2">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button className="btn btn-info text-white fw-bold">
                    Entrar
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                <button
                  className="btn btn-link px-0 mt-2 text-decoration-none"
                  onClick={() => navigate('/registro')}
                >
                  ¿Nuevo en twttr? Regístrate aquí
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login