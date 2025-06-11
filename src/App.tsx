import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { JiraProvider } from "./context/JiraContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashBacklog from "./pages/dashbacklog";
import SprintDashboard from "./pages/SprintDashboard";
import Navbar from "./components/layout/Navbar";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"home" | "backlog" | "sprint">(
    "backlog"
  );

  return (
    <Router>
      <ThemeProvider>
        <JiraProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
              currentView={currentView}
              onViewChange={setCurrentView}
              showHomeLink={false}
            />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<DashBacklog />} />
                <Route path="/sprint" element={<SprintDashboard />} />
              </Routes>
            </main>
          </div>
        </JiraProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
