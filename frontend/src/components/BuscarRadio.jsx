import { use, useState } from 'react';
import axios from 'axios';

function BuscarRadio() {
    const [cedula, setCedula] = useState('');
    const [serial, setSerial] = useState('');
    const [radio, setRadio] = useState(null);
    const [error, setError] = useState('');
    const [persona, setPersona] = useState(null);
    const [accesorios, setAccesorios] = useState([]);

    const buscarRadio = async () => {
        if (!serial){
            alert('Por favor, ingrese un serial valido.');
            return;
        }
        try {
            const res = await axios.get(`http://localhost:8000/equipos/buscar/${serial}`);
            setRadio(res.data);
            setAccesorios(res.data.accesorios || []);
            setError('');
            // Si el radio tiene campo asignado, busca la persona asociada
            if (res.data && res.data.asignado) {
                try {
                    const resPersona = await axios.get(`http://localhost:8000/personas/${res.data.asignado}`);
                    setPersona(resPersona.data);
                } catch (errPersona) {
                    setPersona(null);
                }
            } else {
                setPersona(null);
            }
            console.log("Radio encontrado: ", res.data);
        } catch (err) {
            setRadio(null);
            setAccesorios([]);
            setPersona(null);
            if (err.response && err.response.status === 404) {
                setError('Radio no encontrado.');
            } else {
                setError('Error al buscar el radio. Intente de nuevo.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            
            <input
                type="text"
                placeholder="Ingrese serial del radio"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                style={inputStyle}
            />

            <button
                onClick={buscarRadio}
                style={buttonStyle}
            >
                Buscar
            </button>

            {radio && (
                <div className="mt-6 bg-gray-100 p-4 rounded shadow-inner">
                    <p><strong>Modelo:</strong> {radio.modelo}</p>
                    <p><strong>Serial:</strong> {radio.serial}</p>
                    <p><strong>Asignado a:</strong> {persona ? `${persona.nombres} ${persona.apellidos}`: (radio.asignado || 'No asignado')}</p>
                    <p><strong>Cedula del asignado:</strong>{persona ? `${persona.cedula}` : (radio.asignado || 'No asignado')}</p>

                    <h4>Accesorios asignados:</h4>
                    {accesorios.length > 0 ? (
                        <ul>{accesorios.map((acc) => (
                            <li key={acc.id_accesorio}>{acc.nombre}</li>
                        ))}
                        </ul>
                    ) :(
                        <p>Sin accesorios asignados</p>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-4 text-red-500 text-center font-semibold">{error}</p>
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

export default BuscarRadio;
