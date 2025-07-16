import { BsArrowLeft } from "react-icons/bs";
import { FaIndianRupeeSign } from "react-icons/fa6";
// import data from "../../../assets/mock.json";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";

const Product = (props) => {

    const [quantity, setQuantity] = useState(1);// product quantity added by user

    const [imageIndex, setImageIndex] = useState(0); // image index

    const [productDetail, setProductDetail] = useState([]); // filtered product 

    // storing function in navigate
    const navigate = useNavigate();// navigate to other route

    const location = useLocation(); // get url parts object

    const queryParams = new URLSearchParams(location.search);

    const product_id_int = queryParams.get("id");

    // const product_id_int = +productId; // convert string to int for compare

    const convertRawToURL = (rawData) => {
        const binaryData = new Uint8Array(rawData); // convert rawData to binary 
        const blobData = new Blob([binaryData]); // convert binary  to blob
        const image = URL.createObjectURL(blobData); // temporary url link
        return image;
    }

    //filter to get selected product
    
    useEffect(() => {
        fetch(`http://localhost:3001/product/getSingle?id=${product_id_int}`, {
            method: "GET",
            credentials: 'include'
        })
            .then((response) => {
                return response.json();
        
            })
            .then((data) => {
                if (data.redirect) {
                    navigate(data.redirect);
                } else{
                    setProductDetail(data);
                }
            })
            .catch((err) => toast.error(err.message));
    }, []);

    // show content line by line
    function sentenceLineBreak(content) {
        return content.split(/\|/g);
    }

    // direct to cart with add to cart button
    const navigateToCart = () => {
        navigate("/cart");
    }

        return (
            <>
                {productDetail && productDetail.map((item) =>
                    <div className="product-section" key={item.id}>
                        {/* Product images View */}
                        <div className="product-image-section">
                            <div className="product-image">
                                <img src={convertRawToURL(item.image.data)} alt="product-image" />
                            </div>

                            {/* thumbnail for product views  */}
                            {/* show when more than one image */}
                            {/* {(item.image.length > 1) &&
                                (<div>

                                    <div className="slider-button" id="slider1"
                                        onClick={() => setImageIndex((imageIndex - 1 + item.image.length) % item.image.length)}>{"<"}</div>
                                    {item.image.map((img, idx) => (
                                        <img
                                            src={require(`../../../assets/${img}`)}
                                            alt="thumbnail"
                                            onClick={() => setImageIndex(idx)}
                                            key={img}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                cursor: 'pointer',
                                                border: idx === imageIndex ? '2px solid purple' : '1px solid #343A40 ',
                                            }}
                                            className="thumbnail-images"
                                        />
                                    ))}
                                    <div className="slider-button" id="slider2"
                                        onClick={() => setImageIndex((imageIndex + 1) % item.image.length)}>{">"}</div>
                                </div>)} */}

                        </div>

                        <div className="product-details-section">
                            <div className="Back_Products" onClick={() => navigate('/')}>
                                <BsArrowLeft style={{ fontSize: '30px' }} />
                                <span>Back</span>
                            </div>
                            <h2>{item.title}</h2>
                            <ol className="product-description">{sentenceLineBreak(item.content).map((item, index) => <li key={index}>{item}</li>)}</ol>
                            <b><FaIndianRupeeSign />{item.min_price}</b>

                            <div>
                                <label htmlFor="qty">Qty.</label>
                                <input id="qty" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                            </div>

                            <button id="cart-button" onClick={() => { props.Add(item, quantity); navigateToCart(); }}>
                                Add to Cart
                            </button>

                        </div>
                        <ToastContainer theme="colored" />
                    </div>

                )}
            </>
        );
}

export default Product;