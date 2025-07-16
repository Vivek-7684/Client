import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaIndianRupeeSign } from "react-icons/fa6";

const Card = () => {

    // get category by dynamic segment
    const { category } = useParams();

    const navigate = useNavigate();

    const location = useLocation(); // get url parts object
    const queryParams = new URLSearchParams(location.search); // get query params from url
    const price = queryParams.get("price"); // get price from url

    const searchItem = queryParams.get("searchItem"); // get search item from url
    console.log(searchItem);
    const [productData, setProductData] = useState([]);// store product data

    const convertRawToURL = (rawData) => {
        const binaryData = new Uint8Array(rawData); // convert rawData to binary 
        const blobData = new Blob([binaryData]); // convert binary  to blob
        const image = URL.createObjectURL(blobData); // temporary url link
        return image;
    }

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
            })
            .catch(() => {
                toast.error("Failed to get Product Data");
            });
    }, []);


    // filter Product if category selected or show all product
    let filteredData = [];
    // price selected then filter product by price
    if (price && !category) {
        filteredData = productData.filter((item) => item.min_price <= Number(price));
        console.log(filteredData);
    }
    // price selected then filter product by category
    else if (category && !price) {
        filteredData = category ? productData.filter((item) => item.categories === category) : productData;
    }
    // price selected then filter product by price and category
    else if (category && price) {
        // filter product by category and price
        filteredData = productData.filter((item) => item.categories === category && item.min_price <= Number(price));
    }
    else if (searchItem) {
        // filter product by search item    
        filteredData = productData.filter((item) => {
            return item.title.toLowerCase().includes(searchItem.toLowerCase()) ||
                item.categories.toLowerCase().includes(searchItem.toLowerCase());
        })
    }
    else {
        filteredData = productData;
    }

    return (
        <>
            <main id="main">
                {filteredData.length > 0 && filteredData.map((product) => {
                    return (
                        <div className="product-card" key={product.id} onClick={() => navigate(`/Product?id=${product.id}`)}>
                            <div className="card-image">
                                <img src={convertRawToURL(product.image.data)} onLoad={(e) => {
                                    URL.revokeObjectURL(e.target.src);
                                }} alt={product.title} />

                            </div>
                            <div className="product-body">

                                <div className="product-title">
                                    <h2>{product.title}</h2>
                                </div>
                                <div className="product-content">
                                    <p>{`${product.content.substring(0, 50)}`}</p>
                                    <span id="readmore">...readmore</span>
                                </div>
                                <div className="product-price">
                                    <span style={{ color: "green" }}>Price Now:-<b id="price"><FaIndianRupeeSign />{`${product.min_price}`}</b></span>{","}<br></br>
                                    <span>Max Price:-<b id="max-price">{`${product.max_price}`}</b></span>
                                </div>

                            </div>
                        </div>)
                })}
            </main>
            <ToastContainer theme="colored" />
        </>
    )
}
export default Card;