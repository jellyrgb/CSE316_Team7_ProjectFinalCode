import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "../css/Navbar.css";

function Navbar() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('userToken');
    setUser(null);
    navigate('/signIn');
  };

  const profilePicture = user?.profile_image || "/images/user.png";

  return (
    <nav className="navbar-container">
      <img src="/logos/logo.webp" alt="logo" className="navbar-logo" />
      <div className="navbar-title">My Pet Simulator</div>
      <ul className="menu-list">
        <li className="menu-item"><a href="/">Home</a></li>
        <li className="menu-item"><a href="/tamagotchi">My Pet</a></li>
        <li className="menu-item"><a href="/shop">Shop</a></li>
        <li className="menu-item"><a href="/work">Work</a></li>
        <li className="menu-item"><a href="/test">Test Page</a></li>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <li className="menu-item" id="navbar-profile">
          <a href="/profile">
            <img src={profilePicture} className="navbar-profile-picture" />
          </a>
        </li>
        {user ? (
          <li className="menu-item"><a href="#" onClick={handleLogout}>Log Out</a></li>
        ) : (
          <li className="menu-item"><a href="/signIn">Sign In/Up</a></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;