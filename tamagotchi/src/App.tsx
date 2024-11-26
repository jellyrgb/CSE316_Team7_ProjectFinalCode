// npm install react-router-dom
// npm install @types/react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

import Home from "./pages/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import Header from "./components/Header.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <Routes>  
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App
