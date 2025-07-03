import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/features/home/pages/Home";
import { Navbar } from "@/shared/components/Navbar";
// (Futuramente) importar outras páginas como StatusReport

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/status-report" element={<StatusReport />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
