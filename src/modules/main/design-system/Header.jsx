import { Link } from "react-router";
import Footer from "./Footer";
import Account from "../components/Account";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import LogOut from "../../../assets/LogOut.png";
import Login from "../../../assets/login.png";
import Signup from "../../../assets/sign_up.png";
import profilePic from "../../../assets/profileUser.png";
import Cart from "../../../assets/Cart.png";
import Heart from "../../../assets/heart_filled.png";
import '../../../styles/global.css';
import { toast } from "react-toastify";

const Header = (props) => {

    const [LoggedIn, setLoggedIn] = useState(false);

    const [username, setUsername] = useState("");

    const [userProfile, setUserProfile] = useState("");

    const [userData, setUserData] = useState();

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
                    toast.success("You’ve logged out successfully.");
                    setTimeout(() => {
                        Navigate(data.redirect);
                    }, 2000);

                }
            })
            .catch((err) => toast.error(err.message));
    }

    const loadCart = () => {
        fetch(`http://localhost:3001/cart/getProductsInCart`, {
            method: "GET",
            credentials: 'include'
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                props.setCart(data); // Always update cart, even if empty
            })
            .catch((err) => toast.error(err.message));
    }

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/checkLoggedin", {
            method: "GET",
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
                if (data?.username) {
                    setUsername(data.username);
                }
                if (data?.message) { toast.success(data.message) };
            })
            .catch((err) => toast.error(err.message));
    }, [])

    useEffect(() => {
        fetch("http://localhost:3001/profile/user-profile", {
            method: "GET",
            credentials: 'include'
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setUserProfile(data.image);
                setUserData(data);
            })
    }, []);

    return (
        <>

            <header>
                <nav className="navbar">
                    {props.showProfile &&
                        <Account
                            setShowProfile={props.setShowProfile}
                            userProfile={userProfile}
                            userData={userData}
                    />}

                    <Link to="/" style={{ position: "fixed", left: "10" }}
                    ><img src={logo} id="logo" style={{ width: "23px", height: "23px" }} className="icons" alt="logo" />
                        <span><b>DealMart</b></span>
                    </Link>
                    <form className="search-bar-section" onSubmit={e => e.preventDefault()}>
                        <input
                            placeholder="Search By Products and Brands"
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value.trim() === "") {
                                    Navigate("/");
                                } else {
                                    Navigate(`/?searchItem=${encodeURIComponent(value)}`);
                                }
                            }}
                            className="search-bar"
                        />
                    </form>
                    {LoggedIn && <div className="navbar-icons">
                        <Link to="cart" >
                            <img src={Cart} className="icons" alt="cart" />
                            {/* show total product item in cart*/}
                            <span id="cart-item-count">
                                {props.Cart.length}
                            </span>
                            <span>Cart</span>

                        </Link>
                        <Link to="/wishList" ><img src={Heart} style={{ fontSize: "20px" }} className="icons" alt="policy" />Wishlist</Link>
                        <Link to="" onClick={() => { props.setShowProfile(!props.showProfile) }}>
                            <img src={`data:image/png;base64,${userProfile}`} alt="Profile" style={{ fontSize: "20px", cursor: "none", borderRadius: "15px" }} className="icons" />{username}
                        </Link>
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
