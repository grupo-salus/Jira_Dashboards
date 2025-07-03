// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/features/home/pages/Home";
import { Navbar } from "@/shared/components/Navbar";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Futuramente adicionar outras rotas */}
            {/* <Route path="/projetos" element={<DashProjetos />} /> */}
            {/* <Route path="/sprints" element={<SprintDashboard />} /> */}
            {/* <Route path="/ti" element={<TIDashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
