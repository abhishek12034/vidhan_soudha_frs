import { Routes, Route } from "react-router-dom"; // ✅ remove BrowserRouter here
import DownloadButton from "./components/DownloadButton.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2d3748', color: '#e2e8f0' }}>
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={<DownloadButton />} />
        </Routes>
      </div>
    </div>
  );
}
