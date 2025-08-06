import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ onSeleccion }) {
    const { logout, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Define functions available for each role
    const adminFunctions = [
        {texto: "Añadir Personas", valor: "añadirPersona"},
        {texto: "Añadir Radios", valor: "añadirRadio"},
        {texto: "Buscar por Cédula", valor: "buscarPersona"},
        {texto: "Buscar por Serial", valor: "buscarRadio"},
        {texto: "Entregar Radio", valor: "entregarRadio"},
        {texto: "Editar Datos", valor: "editarDatos"},
        {texto: "Vacaciones", valor: "ponerdeVacaciones"}
    ];

    const userFunctions = [
        {texto: "Buscar por Cédula", valor: "buscarPersona"},
        {texto: "Buscar por Serial", valor: "buscarRadio"}
    ];

    // Get appropriate functions based on user role
    const botones = user?.role === 'admin' ? adminFunctions : userFunctions;

    const handleLogout = () => {
        logout();
    };

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleOptionClick = (option) => {
        onSeleccion(option);
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <button 
                className="mobile-menu-toggle"
                onClick={handleMenuToggle}
                aria-label="Toggle menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <div className={`dashboard-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={handleMenuToggle} />
            
            <div className={`dashboard-container ${isMobileMenuOpen ? 'open' : ''}`}>
                <h2 className="dashboard-title">Menú</h2>
                
                <div className="dashboard-menu">
                    {botones.map((btn) => (
                        <button
                            key={btn.valor}
                            className="dashboard-button"
                            onClick={() => handleOptionClick(btn.valor)}
                        >
                            {btn.texto}
                        </button>
                    ))}
                    
                    <button
                        className="dashboard-button logout"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
