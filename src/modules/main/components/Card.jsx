import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { convertRawImageToURL } from "../../../modules/main/helpers/convertRawImageToURL";
import { toast } from "react-toastify";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import noProductFound from "../../../assets/noProductFound.png";
import heartFilled from "../../../assets/heart_filled.png";
import heart from "../../../assets/heart.png";
import "react-toastify/dist/ReactToastify.css";


const Card = (props) => {

    // get category by dynamic segment
    const { category } = useParams();

    const navigate = useNavigate();

    const location = useLocation(); // get url parts object

    const queryParams = new URLSearchParams(location.search); // get query params from url

    const price = queryParams.get("price"); // get price from url

    const searchItem = queryParams.get("searchItem"); // get search item from url

    const [productData, setProductData] = useState([]);// store product data

    const [visible, setVisible] = useState(5);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/product/getAll", {
            method: "GET",
            credentials: 'include' // set with request to include cookies
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setProductData(data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to get Product Data");
            });
    }, []);

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
                    return;
                }
                else if (data.message === "User not found") {
                    throw new Error(data.message);
                }
                else if (data.message === "Your wishlist is empty for now. Explore products and add the ones you love.") {
                    props.setWishlistItem([]);
                }
                else {
                    props.setWishlistItem(data); // update wishlist to get latest updated wishlist items
                }
            })
            .catch((err) => toast.error(err.message ? err.message : "Failed to load wishlist"));

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

    let filteredData = productData.filter((item) => {
        const selectedPrice = price ? item.min_price <= Number(price) : true; // set condition for price filter if selected else show all
        const selectedCatgory = category ? item.categories === category : true; // set condition for category filter if selected
        const selectedSearchItem = searchItem ? item.title.toLowerCase().includes(searchItem.toLowerCase()) : true;

        return selectedPrice && selectedCatgory && selectedSearchItem // filter by price, category and search item or return all
    })

    return (
        <>
            {/* <SkeletonTheme > */}
            <main id="main">
                {loading ?
                    <>
                        <div style={{ width: 200, height: 200 }}>
                            <CircularProgressbar
                                minValue={0}
                                strokeWidth={5}
                                maxValue={100}
                                value={66}
                                text={"loading..."}
                                styles={buildStyles({
                                    textColor: "#aea2a2ff",
                                    pathColor: "#959b98ff",   // progress color
                                })}
                            />

                            <style>
                                {`
                                    /* Animate only the path */
                                    .CircularProgressbar-path {
                                        animation: spin 2s linear infinite;
                                        transform-origin: center;
                                    }

                                    @keyframes spin {
                                        100% { transform: rotate(360deg); }
                                    }
                                    `}
                            </style>
                        </div>

                    </>
                    : (filteredData.length > 0) ?
                        filteredData.slice(0, visible).map((product) => {
                            return (
                                <div className="product-card" key={product.id} >

                                    {<div className="wishlist-icon"
                                        onClick={
                                            () => {
                                                addProductsInWishList(product.id)
                                                    .then((data) => {
                                                        if (data.redirect) {
                                                            navigate(data.redirect);
                                                        } else {
                                                            LoadWishList(); // Refresh wishlist after update
                                                            setTimeout(() => {
                                                                toast.success(`${product.title} is added in your wishlist for later.`);
                                                            }, 400);

                                                        }
                                                    })
                                                    .catch((err) => toast.error(err.message));
                                            }}>
                                        <img
                                            src={(props.WishlistItem || []).some(item => item.id === product.id) ? heartFilled : heart}
                                            alt="wishlist-icon"
                                        />

                                    </div>}

                                    <div className="card-image" onClick={() => navigate(`/Product?id=${product.id}`)}>
                                        <img src={convertRawImageToURL(product.image.data)} onLoad={(e) => {
                                            URL.revokeObjectURL(e.target.src);
                                        }} alt={product.title} />

                                    </div>
                                    <div className="product-body" onClick={() => navigate(`/Product?id=${product.id}`)}>

                                        <div className="product-title">
                                            <h2>{product.title}</h2>
                                        </div>
                                        <div className="product-content">
                                            <p>{`${product.content.substring(0, 50)}`}</p>
                                            <span id="readmore">...readmore</span>
                                        </div>
                                        <div className="product-price">
                                            <span style={{ color: "green" }}>Price Now:-<b className="price"><FaIndianRupeeSign />{`${product.min_price}`}</b></span>{","}<br></br>
                                            <span>Max Price:-<b id="max-price">{`${product.max_price}`}</b></span>
                                        </div>

                                    </div>
                                </div>)
                        }) :
                        (<div className="no-product-found">
                            <img src={noProductFound} alt="noProductFound" style={{ width: "250px", height: "250px", marginTop: "7rem" }} />
                            <h2>No Products Found</h2>
                            <p>Try changing the filters or search term.</p>
                        </div>)}

                {!loading && filteredData.length > 0 && <button className="lodermore_button"

                    onClick={() => { setVisible((prev) => prev + 5); }}
                >Loadmore...</button>}
            </main>
            {/* </SkeletonTheme> */}
        </>
    )
}
export default Card;