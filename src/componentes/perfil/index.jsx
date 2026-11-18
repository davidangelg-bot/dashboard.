// src/componentes/perfil/index.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [tweets, setTweets] = useState([])
  const [nuevoTweet, setNuevoTweet] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [nuevaUrl, setNuevaUrl] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single()
      setPerfil(data)
      cargarImagenes(user.id)
      cargarTweets()
    }
    cargar()
  }, [])

  const cargarTweets = async () => {
    const { data } = await supabase
      .from('tweets')
      .select('*')
      .order('creado_en', { ascending: false })
    setTweets(data ?? [])
  }

  const publicarTweet = async (e) => {
    e.preventDefault()
    if (!nuevoTweet.trim() || nuevoTweet.length > 140) return
    const { error } = await supabase
      .from('tweets')
      .insert({ contenido: nuevoTweet.trim(), usuario_id: perfil.id })
    if (!error) {
      setNuevoTweet('')
      cargarTweets()
    }
  }

  const borrarTweet = async (id) => {
    const { error } = await supabase.from('tweets').delete().eq('id', id)
    if (!error) setTweets(tweets.filter((t) => t.id !== id))
  }

  const cargarImagenes = async (usuarioId) => {
    const { data } = await supabase
      .from('multimedia')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('creado_en', { ascending: false })
    setImagenes(data ?? [])
  }

  const handleChange = (e) =>
    setPerfil({ ...perfil, [e.target.name]: e.target.value })

  const guardar = async () => {
    const { error } = await supabase
      .from('usuario')
      .update({
        nombre: perfil.nombre,
        fecha_nacimiento: perfil.fecha_nacimiento,
        telefono: perfil.telefono,
      })
      .eq('id', perfil.id)
    alert(error ? 'No se pudo guardar' : 'Datos actualizados')
  }

  const agregarImagen = async () => {
    if (!nuevaUrl.trim()) return
    const { error } = await supabase
      .from('multimedia')
      .insert({ url: nuevaUrl, usuario_id: perfil.id })
    if (!error) {
      setNuevaUrl('')
      cargarImagenes(perfil.id)
    }
  }

  const borrarImagen = async (id) => {
    const { error } = await supabase.from('multimedia').delete().eq('id', id)
    if (!error) setImagenes(imagenes.filter((img) => img.id !== id))
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!perfil) return <p className="p-4">Cargando...</p>

  const restantes = 140 - nuevoTweet.length

  return (
    <div className="min-vh-100 bg-info-subtle pb-5">
      <nav className="navbar bg-info text-white shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold text-white fs-3">twttr</span>
          <div className="d-flex align-items-center gap-2">
            <span className="small me-2">Hola, {perfil.nombre}</span>
            {perfil.rol === 'admin' && (
              <button
                className="btn btn-sm btn-light fw-bold text-info"
                onClick={() => navigate('/dashboard')}
              >
                Ir al dashboard
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-light"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <form onSubmit={publicarTweet}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-bold h5 mb-0">
                      ¿Qué estás haciendo?
                    </label>
                    <span
                      className={`fw-bold fs-5 ${
                        restantes < 20 ? 'text-danger' : 'text-muted'
                      }`}
                    >
                      {restantes}
                    </span>
                  </div>
                  <textarea
                    className="form-control mb-2"
                    rows="2"
                    maxLength={140}
                    placeholder="Escribe tu estado en 140 caracteres o menos..."
                    value={nuevoTweet}
                    onChange={(e) => setNuevoTweet(e.target.value)}
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-info text-white fw-bold px-4"
                      disabled={!nuevoTweet.trim()}
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-bold">
                Timeline público ({tweets.length})
              </div>
              <div className="list-group list-group-flush">
                {tweets.length === 0 && (
                  <div className="list-group-item text-muted">
                    Aún no hay estados publicados.
                  </div>
                )}
                {tweets.map((t) => (
                  <div
                    key={t.id}
                    className="list-group-item d-flex justify-content-between align-items-start gap-3 py-3"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge text-bg-info text-white">
                          @{t.autor_nombre}
                        </span>
                        <small className="text-muted">
                          {new Date(t.creado_en).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0">{t.contenido}</p>
                    </div>
                    {(t.usuario_id === perfil.id || perfil.rol === 'admin') && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => borrarTweet(t.id)}
                        title="Eliminar estado"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-bold">Mi perfil</div>
              <div className="card-body d-grid gap-2">
                <div>
                  <label className="form-label small mb-1">Nombre</label>
                  <input
                    className="form-control form-control-sm"
                    name="nombre"
                    value={perfil.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label small mb-1">Correo</label>
                  <input
                    className="form-control form-control-sm"
                    value={perfil.correo}
                    disabled
                  />
                </div>
                <div>
                  <label className="form-label small mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    className="form-control form-control-sm"
                    type="date"
                    name="fecha_nacimiento"
                    value={perfil.fecha_nacimiento ?? ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label small mb-1">Teléfono</label>
                  <input
                    className="form-control form-control-sm"
                    name="telefono"
                    value={perfil.telefono ?? ''}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="btn btn-sm btn-info text-white fw-bold mt-2"
                  onClick={guardar}
                >
                  Guardar cambios
                </button>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-bold">Mis imágenes</div>
              <div className="card-body">
                <div className="input-group input-group-sm mb-3">
                  <input
                    className="form-control"
                    placeholder="URL de la imagen"
                    value={nuevaUrl}
                    onChange={(e) => setNuevaUrl(e.target.value)}
                  />
                  <button
                    className="btn btn-info text-white fw-bold"
                    onClick={agregarImagen}
                  >
                    Agregar
                  </button>
                </div>

                <div className="row row-cols-2 g-2">
                  {imagenes.map((img) => (
                    <div className="col" key={img.id}>
                      <div className="card h-100">
                        <img src={img.url} className="card-img-top" alt="" />
                        <div className="card-body p-1">
                          <button
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => borrarImagen(img.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil