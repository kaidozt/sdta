import { useState } from 'react';
import axios from "axios";
export default function BuscarPersona() {
    const [cedula, setCedula] = useState('');
    const [persona, setPersona] = useState(null);
    const [error, setError] = useState("");
    const [radios, setRadios] = useState([]);
    const [showRadios, setShowRadios] = useState(false);

    const buscar = async () => {
        if (!cedula) {
            alert("Ingrese una cédula");
            return;
        }
        try {
            const res = await axios.get(`http://localhost:8000/personas/${cedula}`);
            setPersona(res.data);
            setError("");
            // Intentar obtener la lista de radios asignados
            try {
                const resRadios = await axios.get(`http://localhost:8000/personas/${cedula}/radios`);
                setRadios(resRadios.data);
            } catch (errRadios) {
                // Si no tiene radios asignados (404), simplemente dejar radios vacío
                setRadios([]);
            }
            setShowRadios(false);
        } catch (err) {
            setPersona(null);
            setRadios([]);
            setError("Persona no encontrada");
        }
    };

    // Permitir volver a buscar limpiando el estado
    const limpiarBusqueda = () => {
        setPersona(null);
        setRadios([]);
        setShowRadios(false);
        setError("");
        setCedula("");
    };


    // Tree view handler
    const toggleRadios = () => setShowRadios(v => !v);

    return (
        <div>
            <input
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                style={inputStyle}
            />
            <button onClick={buscar} style={buttonStyle}>Buscar Persona</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {persona && (
                <div style={{ marginTop: "1rem", textAlign: "left", maxWidth: 500, marginInline: "auto" }}>
                    <p><b>Nombres:</b> {persona.nombres}</p>
                    <p><b>Apellidos:</b> {persona.apellidos}</p>
                    <p><b>Cédula:</b> {persona.cedula}</p>
                    
                    <p><b>Ente:</b> {persona.ente}</p>
                    <p><b>Contacto:</b> {persona.contacto}</p>
                    <p><b>Entrega:</b> {persona.entrega}</p>
                    {radios.length > 0 && (
                        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                            <button type="button" onClick={toggleRadios} style={{ ...buttonStyle, marginBottom: 10 }}>
                                {showRadios ? "Ocultar radios asignados" : `Mostrar radios asignados (${radios.length})`}
                            </button>
                            {showRadios && (
                                <div style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    background: 'rgba(0,0,0,0.5)',
                                    zIndex: 1000,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <div style={{
                                        background: '#111',
                                        borderRadius: 10,
                                        border: '1px solid #ccc',
                                        padding: 24,
                                        maxWidth: 1000,
                                        width: '90vw',
                                        maxHeight: '90vh',
                                        overflowY: 'auto',
                                    }}>
                                        <button type="button" onClick={toggleRadios} style={{ float: 'right', ...buttonStyle, backgroundColor: '#d32f2f', marginBottom: 16 }}>Cerrar</button>
                                        <h3 style={{ color: '#fff', marginTop: 0 }}>Radios asignados ({radios.length})</h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: radios.length === 1 ? '1fr' : radios.length === 2 ? 'repeat(2, 1fr)' : radios.length === 3 ? 'repeat(3, 1fr)' : radios.length === 4 ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)',
                                            gap: '12px',
                                            justifyItems: 'center',
                                            alignItems: 'stretch',
                                        }}>
                                            {radios.map((radio, idx) => (
                                                <div key={radio.serial || idx} style={{
                                                    padding: '10px 12px',
                                                    background: '#222',
                                                    width: '100%',
                                                    borderRadius: 6,
                                                    border: '1px solid #333',
                                                    color: '#fff',
                                                    minWidth: 0,
                                                    boxSizing: 'border-box',
                                                }}>
                                                    <div><b>Serial:</b> {radio.serial || radio}</div>
                                                    <div><b>Modelo:</b> {radio.modelo || "-"}</div>
                                                    <div><b>Estado:</b> {radio.estado || "-"}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#2c2c2c",
    color: "white",
    marginRight: "1rem",
};

const buttonStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};