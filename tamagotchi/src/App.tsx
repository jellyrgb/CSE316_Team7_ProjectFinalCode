// npm install react-router-dom
// npm install @types/react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

import Home from "./pages/Home.tsx";
import Shop from "./pages/Shop.tsx";
import Travel from "./pages/Travel.tsx";
import MyTama from "./pages/MyTama.tsx";
import Navbar from "./components/Navbar.tsx";
import Header from "./components/Header.tsx";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>  
        <Route path="/" element={<><Header title="Home page" /><Home /></>} />
        <Route path="/shop" element={<><Header title="Shop" /><Shop /></>} />
        <Route path="/travel" element={<><Header title="Travel" /><Travel /></>} />
        <Route path="/tamagotchi" element={<><Header title="<Name>'s Home" /><MyTama /></>} />
      </Routes>
    </Router>
  );
}

export default App
