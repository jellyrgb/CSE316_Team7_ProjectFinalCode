import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "../css/Navbar.css";

function Navbar() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('userToken');
    setUser(null);
    navigate('/signIn');
  };

  const profilePicture = user?.profile_image || "/images/user.png";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const body = document.body;
    const balance = document.getElementById('balance');
    if (isMenuOpen) {
      body.style.marginTop = '380px'; // 메뉴가 열렸을 때 본문을 아래로 밀기
      if (balance) {
        balance.style.marginTop = '380px'; // balance 요소를 아래로 밀기
      }
    } else {
      body.style.marginTop = '0'; // 메뉴가 닫혔을 때 본문을 원래 위치로
      if (balance) {
        balance.style.marginTop = '0'; // balance 요소를 원래 위치로
      }
    }
  }, [isMenuOpen]);

  return (
    <nav className="navbar-container">
      <img src="/logos/logo.webp" alt="logo" className="navbar-logo" />
      <div className="navbar-title">Tamagotchi Online</div>
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`menu-list ${isMenuOpen ? 'open' : ''}`}>
        <li className="menu-item"><a href="/">Home</a></li>
        <li className="menu-item"><a href="/tamagotchi">My Tamagotchi</a></li>
        <li className="menu-item"><a href="/shop">Shop</a></li>
        <li className="menu-item"><a href="/work">Work</a></li>
        <li className="menu-item"><a href="/adopt">Adopt</a></li>
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