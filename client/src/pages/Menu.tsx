import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { DiJavascript, DiPython, DiJava, DiHtml5 } from 'react-icons/di';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';
import { Link } from 'react-router-dom';
import "../App.css";
type MenuProps = {
  Toggle: {
    menu: boolean;
  };
};

function Menu({ Toggle }: MenuProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMenu, setIsMenu] = useState<boolean>(true);

    useEffect(() => {
        setIsMenu(true)
    }, [Toggle.menu])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`menu__wrapper ${(isMenu) ? "close__menu" : "" } `} >
            <div className="menu__container">
                <div className="menu__navbar">
                    <span className="menu__logo">Flash Code <br /> Editor</span>
                    <CgClose className="menu__close-btn" onClick={() => setIsMenu(!isMenu)} />
                </div>

                <div className="menu__body">

                    {/* Dropdown Container */}
                    <div className="menu__dropdown-container">
                        <div className="menu__dropdown-trigger" onClick={toggleDropdown}>
                            <span>Languages</span>
                            {isOpen ? <SlArrowUp className="arrow-icon" /> : <SlArrowDown className="arrow-icon" />}
                        </div>

                        {isOpen && (
                            <div className="menu__dropdown-content">
                                <Link to={'/python'} className="menu__dropdown-link">
                                    <DiPython className="lang-icon python" /> Python
                                </Link>
                                <Link to={'/javascript'} className="menu__dropdown-link">
                                    <DiJavascript className="lang-icon js" /> Javascript
                                </Link>
                                <Link to={'/java'} className="menu__dropdown-link">
                                    <DiJava className="lang-icon java" /> Java
                                </Link>
                                <Link to={'/html'} className="menu__dropdown-link">
                                    <DiHtml5 className="lang-icon html" /> HTML
                                </Link>
                            </div>
                        )}
                    </div>

                     <Link to={'/setting'} className="menu__link">Setting</Link>
                </div>
            </div>
        </div>
    );
}

export default Menu;
