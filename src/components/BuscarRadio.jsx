import { useState } from 'react';
import axios from 'axios';

function BuscarRadio() {
    const [serial, setSerial] = useState('');
    const [radio, setRadio] = useState(null);
    const [error, setError] = useState('');

    const buscarRadio = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/equipos/${serial}`);
            setRadio(res.data);
            setError('');
        } catch (err) {
            setRadio(null);
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
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                onClick={buscarRadio}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
                Buscar
            </button>

            {radio && (
                <div className="mt-6 bg-gray-100 p-4 rounded shadow-inner">
                    <p><strong>Modelo:</strong> {radio.modelo}</p>
                    <p><strong>Serial:</strong> {radio.serial}</p>
                    <p><strong>Asignado a:</strong> {radio.user || "No asignado"}</p>
                    <p><strong>{radio.cedula_asignada || "No asignado"}</strong></p>
                </div>
            )}

            {error && (
                <p className="mt-4 text-red-500 text-center font-semibold">{error}</p>
            )}
        </div>
    );
}

export default BuscarRadio;
