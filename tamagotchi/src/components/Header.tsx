import '../css/Header.css';

interface HeaderProps {
  title: string; 
}

function Header({ title }: HeaderProps) {
  return (
    <header className="header-container">
      <h1 className="header-title">{title}</h1>
    </header>
  );
}

export default Header;