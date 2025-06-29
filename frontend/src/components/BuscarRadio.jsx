import { use, useState } from 'react';
import axios from 'axios';

function BuscarRadio() {
    const [cedula, setCedula] = useState('');
    const [serial, setSerial] = useState('');
    const [radio, setRadio] = useState(null);
    const [error, setError] = useState('');
    const [persona, setPersona] = useState(null);

    const buscarRadio = async () => {
        if (!serial){
            alert('Por favor, ingrese un serial valido.');
            return;
        }
        try {
            const res = await axios.get(`http://localhost:8000/equipos/${serial}`);
            setRadio(res.data);
            setError('');
            // Si el radio tiene campo asignado, busca la persona asociada
            if (res.data && res.data.asignado) {
                const resPersona = await axios.get(`http://localhost:8000/personas/${res.data.asignado}`);
                setPersona(resPersona.data);
            } else {
                setPersona(null);
            }
            console.log("Radio encontrado: ", res.data);
        } catch (err) {
            setRadio(null);
            setPersona(null);
            setError('Radio no encontrado.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Buscar Radio por Serial</h2>
            
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
                    <p><strong>Asignado a:</strong> {persona ? `${persona.nombres} ${persona.apellidos} (Cédula: ${persona.cedula})` : (radio.asignado || 'No asignado')}</p>
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
