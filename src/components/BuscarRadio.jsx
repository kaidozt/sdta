import { useState } from 'react';

function BuscarRadio({ radios }) {
    const [serial, setSerial] = useState('');
    const [resultado, setResultado] = useState(null);

    const buscar = () => {
        const encontrada = radios.find(r => r.serial === serial);
        setResultado(encontrada || null);
    };

    return (
        <div>
            <input 
            type="text" 
            placeholder="Ingrese serial" 
            value={serial}
            onChange={(e) => setSerial(e.target.value)} 
            />
            <button onClick={buscar}>Buscar</button>

            {resultado ? (
                <div>
                    
                    <p><strong>Marca:</strong> {resultado.marca}</p>
                    <p><strong>Modelo:</strong> {resultado.modelo}</p>
                    <p><strong>Asignado a:</strong> {resultado.AsignadoA || "No asignado"}</p>
                </div>
            ) : serial && (
                <p>Radio no encontrado.</p>
            )}
        </div>
    );
}

export default BuscarRadio;