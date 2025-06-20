import { useState } from 'react';

function BuscarPersona({ personas}) {
    const [cedula, setCedula] = useState('');
    const [resultado, setResultado] = useState(null);

    const buscar = () => {
        const encontrada = personas.find(p => p.cedula === cedula);
        setResultado(encontrada || null);
    };

    return (
        <div>
            <input type="text"
             placeholder='Ingrese cédula' 
             value={cedula}
             onChange={(e) => setCedula(e.target.value)} 
             />
             <button onClick={buscar}>Buscar</button>

             {resultado ? (
                <div>
                    <p><strong>Nombre:</strong> {resultado.nombre}</p>
                    <p><strong>Cargo:</strong> {resultado.cargo}</p>
                </div>
             ) : cedula && (
                <p>Persona no encontrada.</p>
             )}
        </div>
    );
}

export default BuscarPersona;