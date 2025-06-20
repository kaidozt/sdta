import { useState } from 'react'
import Dashboard from './components/Dashboard';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import AñadirPersona from './components/AñadirPersona';

function App() {
  const [vista, setVista] = useState(null);

  const [personas, setPersonas] = useState([
    { id: 1, nombre: "Carlos", cedula:"1234567", cargo: "Supervisor"},
    { id: 2, nombre: "Ana", cedula:"78910", cargo:"Tecnico"}
  ]);

  const [radios] = useState([
    { id: 1, serial: "R001", marca: "Motorola", modelo:"XPR3300", asignadoA: "12345678"},
    { id: 2, serial: "R002", marca: "Si", modelo:"XPR9301", asginadoA: null}
  ]);

  return (
    <div 
    style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "2rem" }}>Gestion de Radios</h1>
          {!vista && <Dashboard onSeleccion={setVista} />}
          {vista === "buscarPersona" && <BuscarPersona personas={personas}/>}
          {vista === "añadirPersona" && (
            <AñadirPersona onGuardar={(nuevaPersona) => setPersonas([...personas, nuevaPersona])} />
          )}
          {vista === "buscarRadio" && <BuscarRadio radios={radios} />}
          
          {vista && (
            <div style={{ marginTop: "2rem"}}>
                <button 
                onClick={() => setVista(null)} 
                style={{ 
                  background: "#333",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
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