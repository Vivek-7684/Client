import { useNavigate, Link } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import emptyCart from "../../../assets/emptyCart.png";
import { convertRawImageToURL } from "../../../modules/main/helpers/convertRawImageToURL";
import { BsArrowLeft } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";


const Cart = (props) => {

    // loading cart list
    const [loading, setLoading] = useState(true);

    // pricing
    const [pricing, setPricing] = useState({
        shipping_charges: "",
        discount_off: ""
    })

    // coupon
    const [coupon, setCoupon] = useState([]);

    const [checkedCoupon, setCheckedCoupon] = useState({});

    const [showCoupon, setShowCoupon] = useState(false);

    // storing function
    const navigate = useNavigate();

    // calculate subtotal no. of item * price per item
    const calculateSubtotal = () => {
        return parseInt(props.Cart.reduce((totalPriceSum, currentItem) => {
            return totalPriceSum += currentItem.quantity * currentItem.min_price;
        }, 0))
    }

    // console.log(calculateSubtotal() * Number(pricing.discount_off));

    const calculateDiscount = () => {
        let discount;
        const subtotal = calculateSubtotal();
        if (Number(pricing?.discount_off) > 0) {
            discount = Number(subtotal * Number(pricing?.discount_off)) / 100; // % discount
        }
        return discount ?? 0; // discounted subtotal
    }

    // calculate discounted Subtotal
    const calculateDiscountedSubTotal = () => {
        let discount;
        const subtotal = calculateSubtotal();
        if (Number(pricing?.discount_off) > 0) {
            discount = Number(subtotal * Number(pricing?.discount_off)) / 100; // % discount
        }

        return subtotal - (discount ?? 0); // discounted subtotal
    };


    // 18 % gst on discounted Subtotal + shipping Charges 
    let gst = 0;

    gst = Number(pricing?.shipping_charges) > 0 ?
        Math.round(((calculateDiscountedSubTotal() + Number(pricing?.shipping_charges)) * (18) / (100))) :
        Math.round(((calculateDiscountedSubTotal()) * (18) / (100)));

    // const gst = Math.round((calculateSubtotal() * (18)) / (100));

    // calculate discount if coupon set
    const calculateDiscountCoupon = (price, minPrice, offer) => {

        if (price < minPrice) {
            return;
        }
        return (parseInt(Number(price) * (Number(offer) / 100)));
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
                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    props.setCart(data); // update cart to show latest updated cart items 
                    setLoading(false);// set loading state
                }
            })
            .catch((err) => toast.error(err.message));
    }

    useEffect(() => {
        loadCart();
    }, []);

    const getPricing = () => {
        fetch("http://localhost:3001/pricing/get", {
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => setPricing(data.result[0]))
            .catch((err) => toast.error(err.message))

    }

    useEffect(() => {
        getPricing();
    }, [])

    const getCoupon = () => {

        fetch("http://localhost:3001/coupon/getCoupon")

            .then((response) => response.json())

            .then((data) => {
                setCoupon(data);
            })

            .catch((err) => toast.error(err.message))
    }

    useEffect(() => {
        getCoupon();
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
            <SkeletonTheme >
                <div className="cart-data">
                    {loading ?
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <div>
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                            </div>

                            <div>
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                            </div>

                            <div>
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                                <Skeleton count={5} width={300} height={10} style={{ marginBottom: "10px" }} />
                            </div>
                        </div>
                        :
                        (props.Cart.length > 0) ?
                            <>
                                {/* cart list */}
                                <div >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem",
                                            border: "1px solid grey",
                                            padding: "1rem",
                                            borderRadius: "15px",
                                            boxShadow: "2px 2px 10px grey",
                                            overflowY: "scroll",
                                            height: "600px",
                                        }}
                                    >
                                        <div style={{ display: "flex", gap: "3rem", padding: "1.4rem", backgroundColor: "#dde3e8" }}>
                                            <span style={{ width: "205px", textAlign: "center", fontWeight: "660" }}> Product</span>
                                            <span style={{ width: "100px", textAlign: "center", fontWeight: "650" }}>Quantity</span>
                                            <span style={{ width: "100px", textAlign: "center", fontWeight: "650" }}>Price(per item)</span>
                                            <span style={{ textAlign: "center", fontWeight: "650" }}>Price</span>
                                        </div>

                                        <hr></hr>

                                        {(props.Cart.map((item) => (
                                            <>
                                                <div key={item.id} style={{ display: "flex", gap: "3rem" }}>

                                                    <span onClick={() => navigate(`/Product?id=${item.id}`)} >
                                                        <img src={convertRawImageToURL(item.Image.data)} id="table-cart-image"
                                                            style={{ width: "110px", height: "105px", cursor: "pointer" }} />
                                                    </span>

                                                    <span style={{ width: "100px" }}>{item.title}</span>

                                                    <span style={{ width: "100px", display: "flex", gap: "1.3rem" }}>
                                                        <span className="icon_rectangle"><FaMinus style={{ cursor: "pointer" }} onClick={() => {
                                                            removeFromCart(item.id, 1)
                                                        }} /></span>
                                                        <span
                                                            style={{ fontSize: "20px", width: "140px", borderColor: "black", height: "10px" }}>
                                                            {item.quantity}
                                                        </span>
                                                        <span className="icon_rectangle"><FaPlus style={{ cursor: "pointer" }} onClick={() => {
                                                            addToCart(item.id, 1)
                                                        }} /></span>
                                                    </span>

                                                    <span className="cart-item-price" ><span><FaIndianRupeeSign />{item.min_price}</span></span>

                                                    <span><span><FaIndianRupeeSign />{parseFloat(((item.quantity) * (+item.min_price)).toFixed(2))}</span></span>

                                                </div>
                                                <hr></hr>
                                            </>
                                        )))}
                                    </div>
                                </div>

                                {/* order summary */}
                                <div className="order-summary">
                                    <h3>Order Summary</h3>
                                    <hr></hr>

                                    <div style={{ display: "flex", gap: "5rem", padding: "1rem", width: "350px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
                                            <span>Subtotal</span>
                                            <span>Discount off {pricing?.discount_off}%</span>
                                            <span>Shipping Charges</span>
                                            <span>GST(18%)</span>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
                                            <span>₹{calculateSubtotal()}</span>
                                            <span><b>-</b>{`₹${calculateDiscount()}`}</span>
                                            <span>₹{pricing?.shipping_charges}</span>
                                            <span>₹{gst}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "5rem", padding: "1rem", width: "350px" }}>

                                        {/* show subtotal */}
                                        {
                                            Object.values(checkedCoupon).length > 0 ?
                                                <div style={{ display: "flex", flexDirection: "column", padding: "0.2rem" }}>
                                                    {/* coupon discount off */}

                                                    <div style={{ display: "flex", gap: "11rem" }}>
                                                        <span>Coupon Discount</span>{"   "}
                                                        <span>₹{calculateDiscountCoupon((Math.round(calculateDiscountedSubTotal()) + gst + Number(pricing?.shipping_charges)),
                                                            checkedCoupon.minPrice,
                                                            checkedCoupon.offer)}</span>
                                                    </div>

                                                    <div style={{ display: "flex", gap: "14rem", width: "fit-Content" }}>
                                                        <h4>Total</h4>{"   "}
                                                        <h4>
                                                            ₹ {parseInt(
                                                                Math.round(calculateDiscountedSubTotal()) +
                                                                gst +
                                                                Number(pricing?.shipping_charges) -
                                                                calculateDiscountCoupon(
                                                                    Math.round(calculateDiscountedSubTotal()) + gst + Number(pricing?.shipping_charges),
                                                                    checkedCoupon.minPrice,
                                                                    checkedCoupon.offer
                                                                )
                                                            )}
                                                        </h4>

                                                    </div>

                                                </div> :
                                                <div style={{ display: "flex", gap: "11rem", padding: "1rem" }}>
                                                    <h4>Total</h4>
                                                    <h4>₹{Math.round(calculateDiscountedSubTotal()) + gst + Number(pricing?.shipping_charges)}</h4>
                                                </div>
                                        }

                                    </div>

                                    <hr></hr>

                                    {/* coupon  */}
                                    {/* <div
                                        style={{
                                            marginLeft: "30px",
                                            padding: "1rem",
                                        }}>
                                        <input
                                            style={{ width: "100px", padding: "0.2rem" }}
                                        />
                                        <button
                                            style={{
                                                marginLeft: "15px",
                                                backgroundColor: "black",
                                                color: "#F8F9FA",
                                                padding: "0.2rem",
                                                borderRadius: "5px",
                                                width: "35%",
                                                borderColor: "#F8F9FA",
                                                boxShadow: "3px 3px 5px",
                                                cursor: "pointer"
                                            }}>Apply Coupon</button>
                                    </div> */}

                                    {checkedCoupon.dataId && <><h4 style={{ color: "green" }}>Coupon Applied:</h4><span style={{ color: "green" }}>{checkedCoupon.couponName}</span></>}

                                    <hr></hr>
                                    {/* Coupon List */}

                                    {showCoupon ?
                                        <div style={{ display: "flex", flexDirection: "column", }}>
                                            <h3 style={{ textAlign: "center", textDecoration: "underline", color: "grey" }} onClick={() => setShowCoupon(false)}>Hide Coupon</h3>
                                            {
                                                coupon.result.map((data) => {
                                                    return (
                                                        <div style={{ display: "flex", gap: "6rem", padding: "0.3rem" }}>

                                                            <span key={data.id}>
                                                                <input id={data.couponName} type="checkBox" checked={checkedCoupon.dataId === data.id}
                                                                    onChange={() => {
                                                                        if (checkedCoupon.dataId === data.id) {
                                                                            setCheckedCoupon({});
                                                                        } else {
                                                                            // store coupon
                                                                            setCheckedCoupon({
                                                                                dataId: data.id,
                                                                                couponName: data.couponName,
                                                                                minPrice: data.minPrice,
                                                                                offer: data.offer
                                                                            })
                                                                        }
                                                                    }} />{" "}
                                                                <label htmlFor={data.couponName}>{data.couponName}</label>
                                                            </ span>
                                                            <div >
                                                                <div>{data.minPrice}</div>
                                                            </div>
                                                            <div >
                                                                <div>{data.offer}</div>
                                                            </div>

                                                        </div>

                                                    )
                                                })
                                            }
                                        </div> :
                                        <h4 style={{ textAlign: "center", textDecoration: "underline" }} onClick={() => setShowCoupon(true)}>
                                            Show Coupons
                                        </h4>}

                                </div>

                            </>
                            :
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <img src={emptyCart} alt="empty cart" style={{ width: "250px", height: "250px", marginTop: "7rem" }} />
                                <h2 style={{ textAlign: "center" }}>Your Cart is Empty</h2>
                                <p style={{ textAlign: "center" }}>Please add some products to your cart.</p>
                                <Link to="/"><button style={{ width: "100%", marginTop: "0.5rem" }} className="register-button"><span>Let's go Explore</span></button></Link>
                            </div>}

                </div>
            </SkeletonTheme >

        </>

    )

}

export default Cart;