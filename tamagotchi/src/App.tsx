import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

import Home from "./pages/Home.tsx";
import Shop from "./pages/Shop.tsx";
import Work from "./pages/Work.tsx";
import MyPage from "./pages/MyPage.tsx"
import MyTama from "./pages/MyTama.tsx";
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import AdoptPage from "./pages/AdoptPage.tsx";

import Navbar from "./components/Navbar.tsx";
import Header from "./components/Header.tsx";

import { UserProvider } from "./context/UserContext.tsx";
import { ShopProvider } from "./context/ShopContext.tsx";
import { JobProvider } from "./context/JobContext.tsx";

function App() {

  return (
    <UserProvider>
      <ShopProvider>
        <JobProvider>
        <Router>
          <Navbar />

          <Routes>  
            <Route path="/" element={<><Header title="Home Page" /><Home /></>} />
            <Route path="/shop" element={<><Header title="Shop" /><Shop /></>} />
            <Route path="/work" element={<><Header title="Work" /><Work /></>} />
            <Route path="/tamagotchi" element={<><Header title="My Tamagotchi" /><MyTama /></>} />
            <Route path="/profile" element={<><Header title="My Profile Card" /><MyPage /></>} />
            <Route path="/signUp" element={<><Header title="Sign Up" /><SignUp /></>} />
            <Route path="/signIn" element={<><Header title="Sign In" /><SignIn /></>} />
            <Route path="/adopt" element={<><Header title="Adopt a new Tamagotchi" /><AdoptPage /></>} />
          </Routes>
        </Router>
        </JobProvider>
      </ShopProvider>
    </UserProvider>
  );
}

export default App
