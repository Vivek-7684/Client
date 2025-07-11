import { Link } from "react-router";
import Footer from "./Footer";
import { Outlet } from "react-router";
import logo from "../../../assets/logo.png";
import LogOut from "../../../assets/LogOut.png";
import Cart from "../../../assets/Cart.png";
import Heart from "../../../assets/heart.png";
import Search from "../../../assets/Search.png";
import '../../../styles/global.css';

const Header = (props) => {
    return (
        <>
            <header>
                <nav className="navbar">

                    <Link><img src={logo} id="logo" className="icons" alt="logo" /> <span>DealMart</span></Link>
                    <form className="search-bar-section">
                        <input name="search" placeholder="Search By Products and Brands" className="search-bar" />
                    </form>
                    <div className="navbar-icons">
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
                        <Link to="about" ><img src={Heart} style={{fontSize:"20px"}} className="icons" alt="policy" />Wishlist</Link>
                        <Link><img src={LogOut} id="logo" className="icons" alt="LogOut" />LogOut</Link>
                    </div>

                </nav>

            </header>
            <Outlet />
            <Footer />
        </>
    );
};

export default Header;
