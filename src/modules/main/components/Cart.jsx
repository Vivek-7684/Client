import { useNavigate, Link } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import emptyCart from "../../../assets/emptyCart.png";
import { convertRawImageToURL } from "../../../modules/main/helpers/convertRawImageToURL";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from 'react-toastify';
import { useEffect } from "react";


const Cart = (props) => {

    // storing function
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return parseInt(props.Cart.reduce((totalPriceSum, currentItem) => {
            return totalPriceSum += currentItem.quantity * currentItem.min_price;
        }, 0))
    }

    const gst = Math.round((calculateSubtotal() * (18)) / (100));

    const loadCart = () => {
        fetch(`http://localhost:3001/cart/getProductsInCart`, {
            method: "GET",
            credentials: 'include'
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    props.setCart(data); // update cart to show latest updated cart items 
                }
            })
            .catch((err) => toast.error(err.message));
    }

    useEffect(() => {
        loadCart();
    }, []);

    const addToCart = (productId, quantity) => {
        return fetch("http://localhost:3001/cart/addProductToCart", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    loadCart(); // Refresh cart after update
                }

            })
            .catch((err) => toast.error(err.message));

    }

    const removeFromCart = (productId, quantity) => {
        return fetch("http://localhost:3001/cart/removeProductFromCart", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    loadCart(); // Refresh cart after update
                }

            })
            .catch((err) => toast.error(err.message));

    }

    return (
        <>
            <div className="cart-data">
                {(props.Cart.length > 0) ?
                    <table >
                        {<thead>
                            <tr>
                                <th> Product</th>
                                <th>Quantity</th>
                                <th className="cart-item-price">Price(per Item)</th>
                                <th>Price</th>
                            </tr>
                        </thead>}
                        <tfoot>
                            {(props.Cart.length > 0) && (<>
                                <tr><td colSpan={4}><hr /></td></tr>
                                <tr>
                                    <td colSpan={3}>
                                        Subtotal
                                    </td>
                                    <td>
                                        ₹{calculateSubtotal()}
                                    </td>
                                </tr>
                                <tr><td colSpan={4}><hr /></td></tr>
                                <tr><td colSpan={3}>GST (18%)</td><td>₹{gst}</td></tr><tr><td colSpan={4}><hr /></td></tr>
                                <tr><td colSpan={3}>Shipping</td><td>₹{"50"}</td></tr><tr><td colSpan={4}><hr /></td></tr>
                                <tr><td colSpan={3}><strong>Total</strong></td><td><strong>₹{Math.round(calculateSubtotal()) + gst + 50}</strong></td>
                                </tr></>)}
                            <tr>
                                <td rowSpan={3}>
                                    <div className="Back_Products" onClick={() => navigate('/')}>
                                        <BsArrowLeft style={{ fontSize: '30px' }} />
                                        <span>Back</span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                        <tbody>
                            {(props.Cart.map((item) => (
                                <tr key={item.id}>
                                    <td className="table-cart-item">
                                        <img src={convertRawImageToURL(item.Image.data)} id="table-cart-image" /><span>{item.title}</span>
                                    </td>

                                    <td style={{ width: "400px" }} >
                                        <span className="icon_circle"><FaMinus style={{ color: "red", cursor: "pointer" }} onClick={() => {
                                            removeFromCart(item.id, 1)
                                        }} /></span>
                                        <div style={{ fontSize: "20px", width: "100px", display: "inline" }}>{item.quantity}</div>
                                        <span className="icon_circle"><FaPlus style={{ color: "blue", cursor: "pointer" }} onClick={() => {
                                            addToCart(item.id, 1)
                                        }} /></span>

                                    </td>

                                    <td className="cart-item-price" ><span><FaIndianRupeeSign />{item.min_price}</span></td>

                                    <td>{parseFloat(((item.quantity) * (+item.min_price)).toFixed(2))}</td>
                                </tr>
                            )))}
                        </tbody>

                    </table> :
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <img src={emptyCart} alt="empty cart" style={{ width: "250px", height: "250px", marginTop: "7rem" }} />
                        <h2 style={{ textAlign: "center" }}>Your Cart is Empty</h2>
                        <p style={{ textAlign: "center" }}>Please add some products to your cart.</p>
                        <Link to="/"><button style={{width:"100%",marginTop:"0.5rem"}} className="register-button"><span>Let's go Explore</span></button></Link>
                    </div>}

                {/* <ToastContainer theme="colored" /> */}
            </div>
        </>

    )

}

export default Cart;