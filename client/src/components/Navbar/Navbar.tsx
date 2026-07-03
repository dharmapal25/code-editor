import React from 'react'
import './Navbar.css'
function Navbar() {
    return (
        <nav className='nav__container'>

            <div className="logo">
                <h1>Flash Code Editor</h1>
            </div>

            <div className="menu__items">
                <li>Setting</li>
                <button>Login</button>
            </div>




        </nav>
    )
}

export default Navbar