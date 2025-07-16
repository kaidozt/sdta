import { useEffect, useState } from 'react';
import axios from 'axios';

function EntregarRadios (){
    const [serial, setSerial] = useState('');
    const [cedula, setCedula] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [accesorios, setAccesorios] = useState([]);
    const [seleccionados,setSeleccionados] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/accesorios')
            .then(res => setAccesorios(res.data))
            .catch(() => setMensaje("Error al cargar accesorios"));
    }, []);
    
    const manejarCheckbox = (id) => {
        if (seleccionados.includes(id)){
            setSeleccionados(seleccionados.filter(a => a !== id));
        } else {
            setSeleccionados([...seleccionados, id]);
        }
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        if (!serial || !cedula){
            setMensaje("Debes ingresar el serial y la cedula");
            return;
        }
        try {
            //Se llama al endpoint
            const res = await axios.put(`http://localhost:8000/equipos/entregar/${serial}?cedula=${cedula}`,);
            setMensaje(res.data.mensaje);
        } catch (error){
            if (error.response && error.response.data && error.response.data.detail){
                setMensaje("Error: " + error.response.data.detail);
            } else {
                setMensaje("Error al entregar el radio.");
            }
        }
    };

    return (
        <form onSubmit={manejarSubmit}>
            <input type="text" 
            placeholder='Serial del Radio'
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            style={inputEstilo}
            />
            <input type="text"
            placeholder='Cedula del Usuario'
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            style={inputEstilo}
            />

            <div style={{ color: "white" }}>
                <p>Selecciona los accesorios entregados:</p>
                {accesorios.map(acc => (
                    <label key={acc.id_accesorio} style={{ display: "block"}}>
                        <input
                            type='checkbox'
                            checked={seleccionados.includes(acc.id_accesorio)}
                            onChange={() => manejarCheckbox(acc.id_accesorio)}
                        />
                        {acc.nombre}
                    </label>
                ))}
            </div>

            <button type='submit' style={botonEstilo}>Entregar Radio</button>
            {mensaje && <p>{mensaje}</p>}
        </form>
    );
}

export default EntregarRadios;

const inputEstilo = {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#2c2c2c",
    color: "white"
};

const botonEstilo = {
    backgroundColor: "#4caf50",
    marginTop: "10px",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};