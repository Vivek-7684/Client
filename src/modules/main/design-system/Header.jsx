import { Link } from "react-router";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import LogOut from "../../../assets/LogOut.png";
import Login from "../../../assets/login.png";
import Signup from "../../../assets/sign_up.png";
import profilePic from "../../../assets/profileUser.png";
import Cart from "../../../assets/Cart.png";
import Heart from "../../../assets/heart.png";
import '../../../styles/global.css';

const Header = (props) => {

    const [LoggedIn, setLoggedIn] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const [username, setUsername] = useState("");

    const Navigate = useNavigate();

    const LoggedOut = () => {
        fetch("http://localhost:3001/logout", {
            method: "POST",
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    setLoggedIn(false);
                }
                return response.json();
            })
            .then((data) => {
                if (data.redirect) {
                    Navigate(data.redirect);
                }
            })
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        fetch("http://localhost:3001/checkLoggedin", {
            method: "POST",
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    setLoggedIn(true);
                    return response.json();
                }
                else { setLoggedIn(false) }
            })
            .then((data) => {
                if (data.username) {
                    setUsername(data.username);
                }
            })
            .catch((err) => console.error(err));
    }, [])
    // console.log(username);
    return (
        <>
            <header>
                <nav className="navbar">

                    <Link to="/" style={{ position: "fixed", left: "10" }}
                    ><img src={logo} id="logo" style={{width:"23px",height:"23px"}} className="icons" alt="logo" />
                     <span><b>DealMart</b></span>
                     </Link>
                    <form className="search-bar-section">
                        <input name="search" placeholder="Search By Products and Brands"
                            onChange={(e) => { setSearchQuery(e.target.value) }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    Navigate(`/?searchItem=${searchQuery}`);
                                }
                            }}
                            className="search-bar" />
                    </form>
                    {LoggedIn && <div className="navbar-icons">
                        <Link to="cart" >
                            <img src={Cart} className="icons" alt="cart" />
                            {/* show total product item in cart*/}
                            <span id="cart-item-count">
                                {(parseInt(props.CART.reduce((totalQuantity, _) => {
                                    return totalQuantity += 1;
                                }, 0)))}
                            </span>
                            <span>Cart</span>

                        </Link>
                        <Link to="" ><img src={Heart} style={{ fontSize: "20px" }} className="icons" alt="policy" />Wishlist</Link>
                        <Link to="" ><img src={profilePic} style={{ fontSize: "20px" }} className="icons" alt="User" />{username}</Link>
                        <Link onClick={LoggedOut}><img src={LogOut} id="logo" className="icons" alt="LogOut" />LogOut</Link>
                    </div>}

                    {!LoggedIn &&
                        <div className="navbar-icons">
                            <Link to="login" ><img src={Login} style={{ fontSize: "20px" }} className="icons" alt="login" />LogIn</Link>
                            <Link to="signup" ><img src={Signup} style={{ fontSize: "20px" }} className="icons" alt="signup" />Signup</Link>
                        </div>
                    }

                </nav>

            </header>
            <Outlet />
            {/* <Footer /> */}
        </>
    );
};

export default Header;
