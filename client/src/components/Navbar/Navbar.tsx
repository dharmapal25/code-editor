import { Link } from 'react-router-dom'
import './Navbar.css'
import { useContext } from 'react'
import { authUserInfo } from '../../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/auth/Firebase'
function Navbar() {

    let contextUser = useContext(authUserInfo)

    console.log(contextUser[1])

    async function logoutHandle() {
       await signOut(auth)
        contextUser[1] = null
    // console.log("first")

    }

    return (
        <nav className='nav__container'>

            <div className="logo">
                <h1>Flash Code Editor</h1>
            </div>

            <div className="menu__items">
                <li>Setting</li>
                {/* <Link to={"/login"} > */}

                    {
                        (contextUser) ?
                            <button onClick={logoutHandle}>Logout</button>
                            :
                            <button>Login</button>
                    }

                {/* </Link> */}
            </div>


        </nav>
    )
}

export default Navbar