import { useState } from "react";

function añadirPersona({ onGuardar }){
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [cargo, setCargo] = useState('');

    const manejarSubmit = (e) => {
        e.preventDefault();

        if (!nombre || !cedula || !cargo){
            alert('Todos los campos son obligatorios');
            return;
        }

        const nuevaPersona = {
            id: Date.now(),
            nombre,
            cedula,
            cargo
        };

        onGuardar(nuevaPersona);

        setNombre('');
        setCedula('');
        setCargo('');
    };

    return(
        <form onSubmit={manejarSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input type="text" 
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={inputEstilo}
            />

            <input type="text" 
            placeholder="Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            style={inputEstilo}
            />

            <input type="text" 
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            style={inputEstilo}
            />
            <button type="submit" style={botonEstilo}>Guardar Persona</button>
        </form>
    );
}

const inputEstilo = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#2c2c2c",
    color: "white"
};

const botonEstilo = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

export default añadirPersona;