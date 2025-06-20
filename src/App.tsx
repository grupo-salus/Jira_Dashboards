/**
 * App.tsx
 *
 * Este é o componente raiz da aplicação que:
 * 1. Configura o roteamento com React Router
 * 2. Gerencia a navegação entre as páginas (Projetos, Sprint e TI)
 * 3. Fornece os contextos globais (Theme e Jira)
 * 4. Controla o estado da view atual (projetos/sprint/ti)
 *
 * O componente AppContent é responsável por:
 * - Sincronizar a URL com o estado da view
 * - Gerenciar a navegação programática
 * - Renderizar o layout principal com Navbar e conteúdo
 */

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { JiraProvider } from "./context/JiraContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashProjetos from "./pages/dashprojetos";
import SprintDashboard from "./pages/SprintDashboard";
import TIDashboard from "./pages/TIDashboard";
import Navbar from "./components/layout/Navbar";

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<
    "home" | "projetos" | "sprint" | "ti"
  >("projetos");

  // Atualiza a view baseado na rota atual
  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentView("projetos");
    } else if (location.pathname === "/sprint") {
      setCurrentView("sprint");
    } else if (location.pathname === "/ti") {
      setCurrentView("ti");
    }
  }, [location]);

  // Atualiza a rota quando a view muda
  const handleViewChange = (view: "home" | "projetos" | "sprint" | "ti") => {
    setCurrentView(view);
    if (view === "projetos") {
      navigate("/");
    } else if (view === "sprint") {
      navigate("/sprint");
    } else if (view === "ti") {
      navigate("/ti");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        showHomeLink={false}
      />
      <main className="w-full ">
        <Routes>
          <Route path="/" element={<DashProjetos />} />
          <Route path="/sprint" element={<SprintDashboard />} />
          <Route path="/ti" element={<TIDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <JiraProvider>
          <AppContent />
        </JiraProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
