function Dashboard({ onSeleccion }) {
    const botones =[
        {texto: "Añadir Personas", valor: "añadirPersona"},
        {texto: "Añadir Radios", valor: "añadirRadio"},
        {texto: "Buscar por Cédula", valor: "buscarPersona"},
        {texto: "Buscar por Serial", valor: "buscarRadio"},
        {texto: "Entregar Radio", valor: "entregarRadio"},
        {texto: "Editar Datos", valor: "editarDatos"}
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start", width: "100%" }}>
            {botones.map((btn) =>(
                <button
                key={btn.valor}
                onClick={() => onSeleccion(btn.valor)}
                style={{
                    padding: "12px 18px",
                    fontSize: "1rem",
                    borderRadius: "8px 0 0 8px",
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    cursor: "pointer",
                    minWidth: "180px",
                    textAlign: "left",
                    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                    boxShadow: "none",
                    marginLeft: 0,
                    position: "relative"
                }}
                onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#4caf50';
                    e.currentTarget.style.transform = 'translateX(10px) scale(1.08)';
                    e.currentTarget.style.boxShadow = '2px 4px 16px 0 rgba(0,0,0,0.15)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#333';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                >
                {btn.texto}
                </button>
            ))}
        </div>
    );
}

export default Dashboard;