import { useState } from 'react';
import logo from './assets/telecomAragua.jpg';
import Dashboard from './components/Dashboard';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import AñadirPersona from './components/AñadirPersona';
import AñadirRadio from './components/AñadirRadio';
import EntregarRadios from './components/EntregarRadios';
import EditarDatos from './components/EditarDatos';
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
  );
}

export default App;