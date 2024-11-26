import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">Name</div>
      <ul className="menu-list">
        <li className="menu-item"><a href="/">Home</a></li>
        <li className="menu-item"><a href="/about">About</a></li>
        <li className="menu-item"><a href="/tamagotchi">Tamagotchi</a></li>
        <li className="menu-item"><a href="/shop">Shop</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;