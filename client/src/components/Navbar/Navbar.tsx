import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className='nav__container'>
            <div className="logo">
                <h1>Flash Code Editor</h1>
            </div>

            <div className="menu__items">
                <Link to={'/settings'} >
                <li>Setting</li>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
