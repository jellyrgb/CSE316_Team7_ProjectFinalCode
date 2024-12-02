import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar-container">
      <img src="/logos/logo.webp" alt="logo" className="navbar-logo" />
      <div className="navbar-title">My Pet Simulator</div>
      <ul className="menu-list">
        <li className="menu-item"><a href="/">Home</a></li>
        <li className="menu-item"><a href="/tamagotchi">My Pet</a></li>
        <li className="menu-item"><a href="/shop">Shop</a></li>
        <li className="menu-item"><a href="/work">Work</a></li>
        <li className="menu-item"><a href="/profile">Profile Card</a></li>
        <li className="menu-item"><a href="/signUp">Sign Up</a></li>
        <li className="menu-item"><a href="/test">Test</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;