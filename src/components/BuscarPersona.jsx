import { useState } from 'react';
import axios from "axios";

export default function BuscarPersona() {
    const [cedula, setCedula] = useState('');
    const [persona, setPersona] = useState(null);
    const [error, setError] = useState("");

    const buscar = async () => {
        if (!cedula){
            alert("Ingrese una cédula");
            return;
        }
        try{
            const res = await axios.get(`http://localhost:8000/personas/${cedula}`);
            setPersona(res.data);
            setError("");
        }catch (err){
            setPersona(null);
            setError("Persona no encontrada");
        }
    };

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
    <div style={{ marginTop: "1rem", textAlign: "left" }}>
        <p><b>Nombres:</b> {persona.nombres}</p>
        <p><b>Apellidos:</b> {persona.apellidos}</p>
        <p><b>Cédula:</b> {persona.cedula}</p>
        <p><b>Ente:</b> {persona.ente}</p>
        <p><b>Contacto:</b> {persona.contacto}</p>
        <p><b>Entrega:</b> {persona.entrega}</p>
        <p><b>ID Equipo:</b> {persona.id_equipos}</p>
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