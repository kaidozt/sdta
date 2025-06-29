function Dashboard({ onSeleccion }) {
    const botones =[
        {texto: "Añadir Personas", valor: "añadirPersona"},
        {texto: "Añadir Radios", valor: "añadirRadios"},
        {texto: "Buscar por Cédula", valor: "buscarPersona"},
        {texto: "Buscar por Serial", valor: "buscarRadio"},
        {texto: "Entregar Radio", valor: "entregarRadio"},
        {texto: "Editar Datos", valor: "editar"}
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center"}}>
            {botones.map((btn) =>(
                <button
                key={btn.valor}
                onClick={() => onSeleccion(btn.valor)}
                style={{
                    padding: "12px 24px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #000",
                    backgroundColor: "#333",
                    color: "#fff",
                    cursor: "pointer",
                    minWidth: "240px"
                }}
                >
                {btn.texto}
                </button>
            ))}
        </div>
    );
}

export default Dashboard;