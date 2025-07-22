import { useState, useEffect } from 'react';
import axios from 'axios';

function PonerDeVacaciones() {
    const [serial, setSerial] = useState('');
    const [persona, setPersona] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (serial.length > 0) {
            axios.get(`http://localhost:8000/equipos/buscar/${serial}`)
                .then(res => {
                    if (res.data.asignado) {
                        setPersona(res.data.asignado);
                    } else {
                        setPersona(null);
                    }
                })
                .catch(() => setPersona(null));
        } else {
            setPersona(null);
        }
    }, [serial]);

    const handleClick = async () => {
        setMensaje('');
        if (!serial) {
            setMensaje("Por favor ingrese el serial del radio.");
            return;
        }
        try {
            const res = await axios.put(`http://localhost:8000/equipos/poner_de_vacaciones/${serial}`);
            setMensaje(res.data.mensaje);
            setPersona(null);
            setSerial('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                setMensaje("Error: " + error.response.data.detail);
            } else {
                setMensaje("Error al poner de vacaciones.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#2c2c2c', color: 'white', borderRadius: '8px', maxWidth: '400px' }}>
            <input
                type="text"
                placeholder="Serial del Radio"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                style={inputStyle}
            />
            {persona && <p>Asignado a: {persona}</p>}
            <button onClick={handleClick} style={buttonStyle}>Poner de Vacaciones</button>
            {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #555',
    backgroundColor: '#2c2c2c',
    color: 'white',
    fontSize: '16px'
};

const buttonStyle = {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
};

export default PonerDeVacaciones;
