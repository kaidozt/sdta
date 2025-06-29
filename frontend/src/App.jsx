import { useState } from 'react';
import Dashboard from './components/Dashboard';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import AñadirPersona from './components/AñadirPersona';

function App() {
  const [vista, setVista] = useState(null);
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
        <h1 style={{ marginBottom: "2rem" }}>Gestión de Radios</h1>

        {!vista && <Dashboard onSeleccion={setVista} />}
        {vista === "buscarPersona" && <BuscarPersona />}
        {vista === "añadirPersona" && <AñadirPersona />}
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