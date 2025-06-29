import { useState } from "react";

function AñadirPersona({ onGuardar }){
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [cedula, setCedula] = useState('');
    const [ente, setEnte] = useState('');
    const [contacto, setContacto] = useState('');
    

    const manejarSubmit = (e) => {
        e.preventDefault();

        if (!nombre || !apellidos || !cedula || !ente || !contacto){
            alert('Todos los campos son obligatorios');
            return;
        }

        const nuevaPersona = {
            nombres: nombre,
            apellidos,
            cedula: String(cedula),
            ente: String(ente),
            contacto: String(contacto),
            entrega: null
            
        };

        onGuardar(nuevaPersona);

        setNombre('');
        setApellidos('');
        setCedula('');
        setEnte('');
        setContacto('');
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
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            style={inputEstilo}
            />

            <input type="text" 
            placeholder="Cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            style={inputEstilo}
            />

            <input type="text" 
            placeholder="Ente"
            value={ente}
            onChange={(e) => setEnte(e.target.value)}
            style={inputEstilo}
            />

            <input type="text" 
            placeholder="Contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
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

export default AñadirPersona;