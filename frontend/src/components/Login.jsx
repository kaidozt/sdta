import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    email: '',
    role: 'usuario'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        password: formData.password,
        nombre: formData.nombre,
        email: formData.email,
        role: formData.role
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {!isRegister ? (
            <>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ingrese su usuario"
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ingrese su contraseña"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese un nombre de usuario"
                />
              </div>
              
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su email"
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese una contraseña"
                />
              </div>
              
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirme su contraseña"
                />
              </div>
            </>
          )}
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>
        
        <div className="toggle-form">
          <p>
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button 
              type="button" 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="toggle-button"
            >
              {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
