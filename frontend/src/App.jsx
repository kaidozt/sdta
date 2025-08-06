import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import AñadirPersona from './components/AñadirPersona';
import AñadirRadio from './components/AñadirRadio';
import BuscarPersona from './components/BuscarPersona';
import BuscarRadio from './components/BuscarRadio';
import EntregarRadios from './components/EntregarRadios';
import EditarDatos from './components/EditarDatos';
import PonerDeVacaciones from './components/PonerDeVacaciones';
import './App.css';
import './App-responsive.css';

function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'añadirPersona':
        return <AñadirPersona />;
      case 'añadirRadio':
        return <AñadirRadio />;
      case 'buscarPersona':
        return <BuscarPersona />;
      case 'buscarRadio':
        return <BuscarRadio />;
      case 'entregarRadio':
        return <EntregarRadios />;
      case 'editarDatos':
        return <EditarDatos />;
      case 'ponerdeVacaciones':
        return <PonerDeVacaciones />;
      default:
        return <div className="empty-state">Seleccione una opción del menú</div>;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Header />
                    <div className="app-body">
                      <Dashboard onSeleccion={handleSelection} />
                      <div className="main-content">
                        <div className="content-area">
                          {renderSelectedComponent()}
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
