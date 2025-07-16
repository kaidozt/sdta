import { useState } from "react";

function AñadirRadio({ onGuardar }) {
    const [modelo, setModelo] = useState('');
    const [serial, setSerial] = useState('');
    const [ident, setIdent] = useState('');
    const [tei, setTei] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tipo, setTipo] = useState('');
    const [nBien, setNBien] = useState('');
    const [estado, setEstado] = useState('');

    const manejarSubmit = (e) => {
        e.preventDefault();

        if (!modelo || !serial || !ident || !tei || !categoria || !tipo || !nBien || !estado ){
            alert("Todos los campos son obligatorios");
            return;
        }
        

        const nuevoRadio = {
            modelo,
            serial,
            ident,
            tei,
            categoria,
            tipo,
            n_bien: nBien,
            estado,
            user: null,
            accesorios: []
        };

        onGuardar(nuevoRadio);
        setModelo('');
        setSerial('');
        setIdent('');
        setTei('');
        setCategoria('');
        setTipo('');
        setNBien('');
        setEstado('');
    };

    return (
        <form onSubmit={manejarSubmit} style={{ display: "flex", flexDirection: "column", gap:"1rem"}}>
            <input type="text"
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Identificador"
            value={ident}
            onChange={(e) => setIdent(e.target.value)}
            style={inputEstilo}
            />
            
            <input type="text"
            placeholder="TEI"
            value={tei}
            onChange={(e) => setTei(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Numero de Bien"
            value={nBien}
            onChange={(e) => setNBien(e.target.value)}
            style={inputEstilo}
            />

            <input type="text"
            placeholder="Estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={inputEstilo}
            />
            <button type="submit" style={botonEstilo}>Guardar Radio</button>
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

export default AñadirRadio;