// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/features/home/pages/Home";
import { DashProjetos } from "@/features/projetos/pages/DashProjetos";
import { TIDashboard } from "@/features/ti/pages/TIDashboard";
import { SprintDashboard } from "@/features/sprint/pages/SprintDashboard";
import { Navbar } from "@/shared/components/Navbar";
import { DataSyncProvider } from "@/shared/context/DataSyncContext";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

function App() {
  return (
    <Router>
      <DataSyncProvider>
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projetos" element={<DashProjetos />} />
                <Route path="/ti" element={<TIDashboard />} />
                <Route path="/sprints" element={<SprintDashboard />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </DataSyncProvider>
    </Router>
  );
}

export default App;
