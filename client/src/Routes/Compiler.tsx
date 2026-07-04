import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    return (

        <select onChange={(e) => navigate(e.target.value)}>

            {/* <option value="/">Home</option> */}

            <option value="/javascript">JavaScript</option>

            <option value="/python">Python</option>

        </select>

    );
}

export default Navbar;