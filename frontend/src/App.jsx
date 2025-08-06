<<<<<<< HEAD
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
=======
import { useState } from 'react';
import logo from './assets/telecomAragua.jpg';
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import AñadirPersona from './components/AñadirPersona';
import AñadirRadio from './components/AñadirRadio';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import EntregarRadios from './components/EntregarRadios';
import EditarDatos from './components/EditarDatos';
<<<<<<< HEAD
import PonerDeVacaciones from './components/PonerDeVacaciones';
import './App.css';
import './App-responsive.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option);
  };
=======
import axios from 'axios';

function App() {
  const [vista, setVista] = useState(null);
  
  async function handleGuardarPersona(persona){
    try {
      await axios.post("http://localhost:8000/personas/", persona);
      alert("Persona guardada correctamente");
    } catch(error) {
      alert("Error al guardar la persona");
      console.error(error);
    }
  }
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'añadirPersona':
        return <AñadirPersona />;
      case 'añadirRadio':
        return <AñadirRadio />;
      case 'buscarPersona':
        return <BuscarPersona />;
      case 'buscarRadio':
        return <BuscarRadio />;
      case 'entregarRadio':
        return <EntregarRadios />;
      case 'editarDatos':
        return <EditarDatos />;
      case 'ponerdeVacaciones':
        return <PonerDeVacaciones />;
      default:
        return <div className="empty-state">Seleccione una opción del menú</div>;
    }
  };

  return (
<<<<<<< HEAD
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Header />
                    <div className="app-body">
                      <Dashboard onSeleccion={handleSelection} />
                      <div className="main-content">
                        <div className="content-area">
                          {renderSelectedComponent()}
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
=======
    <div 
      style={{
        width: "100vw",
        minHeight: "95vh",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <header style={{
        width: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        background: "#1e1e1e",
        zIndex: 100,
        textAlign: "center",
        padding: "1.5rem 0 1rem 0",
        borderBottom: "1px solid #333"
      }}>
        <img src={logo} alt="Logo"
        style={ {
          position: "absolute",
          left: 24,
          top: "50%",
          transform: "translateY(-60%)",
          borderRadius: "50%",
          border: "2px solid #fff",
          height: 75,
        }}
        />
        <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: 1 }}>Gestión de Radios</h1>
      </header>
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        
        {!vista && <Dashboard onSeleccion={setVista} />}
        {vista === "buscarPersona" && <BuscarPersona/>}
        {vista === "añadirRadio" && <AñadirRadio onGuardar={handleGuardarRadio}/>}
        {vista === "añadirPersona" && <AñadirPersona   onGuardar={handleGuardarPersona}/>}
        {vista === "entregarRadio" && <EntregarRadios />}
        {vista === "editarDatos" && <EditarDatos/>}
        {vista === "buscarRadio" && <BuscarRadio />}

        {vista && (
          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => setVista(null)}
              style={{
                background: "#333",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Volver al dashboard
            </button>
          </div>
        )}
      </div>
    </div>
>>>>>>> cf513bb29e08aba1b17ad15ac051c63975ea3a94
  );
}

export default App;