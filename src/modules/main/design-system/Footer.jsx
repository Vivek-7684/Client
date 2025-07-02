import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <footer id="footer">
                <div className="social-icons">
                    <Link to="/instagram" >
                        <FaInstagram style={{fontSize:"20px"}}/>
                    </Link>

                    <Link to="/instagram" >
                        <FaXTwitter style={{fontSize:"20px"}}/>
                    </Link>
                </div>
                <p className="company-right">@CopyRight, Right Reserved</p>

                <address className="company-right">
                    Noida 61,U.P.
                </address>
            </footer>
        </>
    )
}
export default Footer;