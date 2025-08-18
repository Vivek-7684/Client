import { useNavigate, Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { convertRawImageToURL } from "../helpers/convertRawImageToURL";
import { ToastContainer, toast } from "react-toastify";
import Delete from "../../../assets/Delete.png";
import add_To_Cart from "../../../assets/add_to_cart.png";
import empty_wishlist from "../../../assets/empty_wishlist.png";

import { useEffect } from "react";


const WishList = (props) => {

    const navigate = useNavigate();

    const LoadWishList = () => {

        fetch("http://localhost:3001/wishlist/getProductsInWishList", {
            method: "GET",
            credentials: 'include'
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.redirect) {
                    navigate(data.redirect);
                }
                else if (data.message === "Your wishlist is empty for now. Explore products and add the ones you love.") {
                    props.setWishlistItem([]);
                }
                else {
                    props.setWishlistItem(data);     // update wishlist to show latest updated wishlist items
                }
            })

    }

    useEffect(() => {
        LoadWishList();
    }, []);


    const addProductsInWishList = (productId) => {
        return fetch("http://localhost:3001/wishList/addProductsInWishList", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId
            })
        })
            .then((response) => {
                return response.json();
            })

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
                }
            })
            .catch((err) => toast.error(err.message));
    }

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
                }
                else {
                    loadCart(); // Refresh cart after update
                    toast.success("Product Added in Cart Successfully!");
                    setTimeout(() => {
                        navigate('/cart');
                    }, 2000)
                }

            })
            .catch((err) => toast.error(err.message));

    }

    return (
        <>
            {Array.isArray(props.WishlistItem) && (props.WishlistItem.length > 0) ? (<div className="WishList-List">
                <div className="Back_Products" style={{ marginTop: "2rem" }} onClick={() => navigate('/')}>
                    <BsArrowLeft style={{ fontSize: '30px' }} />
                    <span>Back</span>
                </div>
                <div className="wishlist-heading">
                    {props.WishlistItem?.length > 0 && <span>{`My Wishlist (${(props.WishlistItem || []).length})`}</span>}
                    <hr></hr>
                </div>
                {props.WishlistItem && props.WishlistItem?.map((item) => {
                    return (
                        <div key={item.id}>
                            <div className="wishlist-product-container" >
                                <div className="wishList-product-Image">
                                    <img src={convertRawImageToURL(item.image.data)} alt={item.title} />
                                </div>
                                <div className="product-details">
                                    <h3>{item.title}</h3>
                                    <p style={{ color: "grey" }}>{item.content}</p>
                                    <span style={{ color: "green" }}>Price Now:-<b id="price"><FaIndianRupeeSign />{`${item.min_price}`}</b></span>{","}<br></br>
                                    <div className="wishlist-icons">
                                        <span><img src={Delete} style={{ width: "28px", height: "28px", textSpacing: "2px" }} onClick={() => {
                                            addProductsInWishList(item.id)
                                                .then((data) => {
                                                    if (data.redirect) {
                                                        navigate(data.redirect);
                                                    } else {
                                                        setTimeout(() => {
                                                            // toast.success(`${item.title} has been removed from your wishlist.`, {
                                                            //     toastClassName: "toast_popUp",
                                                            //     progressClassName:"toast_progress"
                                                            // });



                                                            toast.success("Inline Styling", {
                                                                progressStyle: { background: "#22c55e" }
                                                            });


                                                        }, 800);
                                                        LoadWishList(); // Refresh wishlist after update
                                                    }
                                                })
                                                .catch((err) => toast.error(err.message));
                                        }} /></span>{"  "}
                                        {/* <span><img src={add_To_Cart} style={{ width: "22px", height: "22px", textSpacing: "2px",textSpacing:"10px" }} onClick={() => { addToCart(item.id, 1) }} />Add to Cart</span> */}
                                        <button className="cart-button" onClick={() => {
                                            addToCart(item.id, 1);
                                        }} style={{ width: "auto", height: "auto" }}>
                                            Add to Cart
                                        </button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                        </div>
                    )
                })}
            </div>) :
                (
                    <div className="empty_wishlist_container">
                        <div className="empty_wishlist">
                            <img src={empty_wishlist} className="empty_wishlist" />
                            <h3 style={{ textAlign: "center" }} className="wishlist-heading">Your wishlist is empty for now. Explore products and add the ones you love.</h3>
                            <div style={{ textAlign: "center" }}>
                                <Link to="/"><button style={{ width: "auto", height: "auto" }} className="register-button" >Browse our Products</button></Link>
                            </div>
                        </div>
                    </div>
                )}

        </>

    );
}

export default WishList;