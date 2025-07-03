// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/features/home/pages/Home";
import { DashProjetos } from "@/features/projetos/pages/DashProjetos";
import { Navbar } from "@/shared/components/Navbar";
import { DataSyncProvider } from "@/shared/context/DataSyncContext";

function App() {
  return (
    <Router>
      <DataSyncProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projetos" element={<DashProjetos />} />
              {/* Futuramente adicionar outras rotas */}
              {/* <Route path="/sprints" element={<SprintDashboard />} /> */}
              {/* <Route path="/ti" element={<TIDashboard />} /> */}
            </Routes>
          </main>
        </div>
      </DataSyncProvider>
    </Router>
  );
}

export default App;
