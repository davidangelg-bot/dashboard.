// src/componentes/registro/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    fecha_nacimiento: '',
    telefono: '',
  })
  const [mensaje, setMensaje] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegistro = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email: form.correo,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          fecha_nacimiento: form.fecha_nacimiento,
          telefono: form.telefono,
        },
      },
    })
    if (error) setMensaje(error.message)
    else setMensaje('Cuenta creada. Ya puedes iniciar sesión en twttr.')
  }

  return (
    <div className="min-vh-100 bg-info-subtle">
      <nav className="navbar bg-info text-white shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold text-white fs-3">twttr</span>
          <span className="small">Únete a la conversación en 140 caracteres</span>
        </div>
      </nav>

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">Crear cuenta</h2>
                <form onSubmit={handleRegistro} className="d-grid gap-2">
                  <input
                    className="form-control"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control"
                    name="correo"
                    type="email"
                    placeholder="Correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control"
                    name="password"
                    type="password"
                    placeholder="Contraseña (mínimo 6)"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control"
                    name="fecha_nacimiento"
                    type="date"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                  />
                  <input
                    className="form-control"
                    name="telefono"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                  <button className="btn btn-info text-white fw-bold">
                    Registrarme
                  </button>
                </form>
                {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
                <button
                  className="btn btn-link px-0 mt-2 text-decoration-none"
                  onClick={() => navigate('/login')}
                >
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro