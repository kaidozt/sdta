import { use, useState } from "react";
import axios from 'axios';

export default function EditarDatos({persona, onActualizar}){
    const [busqueda, setBusqueda] = useState('');
    const [tipo, setTipo] = useState('persona');
    const [datos, setDatos] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    // Busca la persona o el equipo
    const buscar = async () => {
        setCargando(true);
        setMensaje("");
        setDatos(null);
        try {
            if (tipo === 'persona') {
                const res = await axios.get(`http://localhost:8000/personas/${busqueda}`);
                setDatos(res.data);
            }else {
                const res = await axios.get(`http://localhost:8000/equipos/buscar/${busqueda}`);
                setDatos(res.data);
            }
        }catch (error) {
            setMensaje("No encontrado");
        }
        setCargando(false);
    };

    const guardar = async (e) => {
        e.preventDefault();
        setMensaje("");
        if (tipo === 'persona' && !datos.nombres){
            setMensaje("El campo 'Nombres' es obligatorio");
            return;
        }   
        try {
            if (tipo === 'persona') {
                await axios.put(`http://localhost:8000/personas/${busqueda}`, datos);
                setMensaje("Persona actualizada con éxito");
                setTimeout(() => setMensaje(""), 3000);
            } else {
                await axios.put(`http://localhost:8000/equipos/buscar/${busqueda}`, datos);
                setMensaje("Equipo actualizado correctamente");
                setTimeout(() => setMensaje(""), 3000);
            }
        } catch (error) {
            setMensaje("Error al actualizar");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value});
    };

    const eliminar = async () => {
        setMensaje("");
        if (!window.confirm("SEGURO QUE DESEAS ELIMINAR ESTE REGISTRO?")) return;
        try {
            if (tipo === 'persona'){
                await axios.delete(`http://localhost:8000/personas/${busqueda}`)
                setMensaje("Persona eliminada con éxito");
                setTimeout(() => setMensaje(""), 3000);
            }else {
                await axios.delete(`http://localhost:8000/equipos/${busqueda}`);
                setMensaje("Equipo eliminado con éxito");
                setTimeout(() => setMensaje(""), 3000);
            }
            setDatos(null);
        }catch (error) {
            setMensaje("Error al eliminar");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    return (
        <div>
            <> {cargando && <p style={{color: "#ffa726"}}>Cargando...</p>} </>
            <h2>Editar Datos</h2>
            <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="persona">Persona (por cédula)</option>
                <option value="equipo">Equipo (por serial)</option>
            </select>
            <input type="text" 
            placeholder={tipo === 'persona' ? "Cédula" : "Serial"}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={inputStyle}
            />
            <button style={buttonStyle} onClick={buscar} disabled={cargando}>{cargando ? "Buscando..." : "Buscar"}</button>
            {mensaje && <p>{mensaje}</p>}

            {datos && (
                <form onSubmit={guardar} style={{ marginTop: 20}}>
                    {tipo === 'persona' ? (
                        <>
                            
                            <input style={inputStyle} name="nombres" value={datos.nombres} onChange={handleChange}  placeholder="Nombres"/>
                            <input style={inputStyle} name="apellidos" value={datos.apellidos} onChange={handleChange} placeholder="Apellidos" />
                            <input style={inputStyle} name="ente" value={datos.ente || ""} onChange={handleChange} placeholder="Ente" />
                            <input style={inputStyle} name="contacto" value={datos.contacto || ""} onChange={handleChange} placeholder="Contacto" />
                        </>
                    ) :(
                        <>
                            <input style={inputStyle} name="modelo" value={datos.modelo} onChange={handleChange} placeholder="Modelo" />
                            <input style={inputStyle} name="estado" value={datos.estado} onChange={handleChange} placeholder="Estado" />
                            <input style={inputStyle} name="ident" value={datos.ident} onChange={handleChange} placeholder="Identificador" />
                            <input style={inputStyle} name="tei" value={datos.tei} onChange={handleChange} placeholder="TEI" />
                            <input style={inputStyle} name="tipo" value={datos.tipo} onChange={handleChange} placeholder="Tipo" />
                            <input style={inputStyle} name="n_bien" value={datos.n_bien} onChange={handleChange} placeholder="Número de Bien" />
                        </>
                    )}
                    <button style={buttonStyle} type="submit">Guardar Cambios</button>
                    <button style={{ ...buttonStyle, backgroundColor: "#e53935", marginLeft: "10px"}} type="button" onClick={eliminar}>Eliminar</button>
                </form>
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
    marginRight: "10px",
};

const buttonStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
};