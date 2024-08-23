import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <h1 className="logo">Car Catalog</h1>
            <nav>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/car-manage" className="nav-link">Manage Cars</Link>
                <Link to="/login" className="login-button">Login</Link>
            </nav>
        </header>
    );
}