import { useState, useEffect } from 'react';
import logo from './assets/telecomAragua.jpg';
import Dashboard from './components/Dashboard';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import AñadirPersona from './components/AñadirPersona';
import AñadirRadio from './components/AñadirRadio';
import EntregarRadios from './components/EntregarRadios';
import EditarDatos from './components/EditarDatos';
import PonerDeVacaciones from './components/PonerDeVacaciones';
import axios from 'axios';

function App() {
  const [vista, setVista] = useState(null);
  const [totalRadios, setTotalRadios] = useState(null);

  useEffect(() => {
    if (!vista) {
      axios.get("http://localhost:8000/equipos/total")
        .then(res => setTotalRadios(res.data.total_radios))
        .catch(() => setTotalRadios(null));
    }
  }, [vista]);
  
  async function handleGuardarPersona(persona){
    try {
      await axios.post("http://localhost:8000/personas/", persona);
      alert("Persona guardada correctamente");
    } catch(error) {
      alert("Error al guardar la persona");
      console.error(error);
    }
  }

  async function handleGuardarRadio(radio){
    try {
      await axios.post("http://localhost:8000/equipos/", radio);
      alert("Radio guardado correctamente");
    } catch(error){
      alert("Error al guardar el radio");
      console.error(error);
    }
  }
  return (
    <div 
      style={{
        width: "100vw",
        minHeight: "95vh",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
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
      <div style={{ display: "flex", flex: 1, width: "100%", minHeight: "80vh" }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          background: "#232323",
          padding: "2rem 0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRight: "1px solid #333",
          minHeight: "80vh"
        }}>
          {!vista && <Dashboard onSeleccion={setVista} />}
        </div>
        {/* Main content */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!vista && (
            <div style={{
              background: '#232323',
              borderRadius: 12,
              padding: '2.5rem 2rem',
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
              marginTop: 40,
              minWidth: 320,
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16
            }}>
              <span>📡 <b>Total de radios registrados:</b></span>
              <span style={{ fontSize: 38, color: '#4caf50', fontWeight: 700 }}>
                {totalRadios !== null ? totalRadios : 'Cargando...'}
              </span>
            </div>
          )}
          {vista === "buscarPersona" && <BuscarPersona/>}
          {vista === "añadirRadio" && <AñadirRadio onGuardar={handleGuardarRadio}/>}
          {vista === "añadirPersona" && <AñadirPersona   onGuardar={handleGuardarPersona}/>}
          {vista === "entregarRadio" && <EntregarRadios />}
          {vista === "editarDatos" && <EditarDatos/>}
          {vista === "buscarRadio" && <BuscarRadio />}
          {vista === "ponerdeVacaciones" && <PonerDeVacaciones/>}

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
    </div>
  );
}

export default App;
