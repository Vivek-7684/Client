import { BsArrowLeft } from "react-icons/bs";
import { FaIndianRupeeSign } from "react-icons/fa6";
import data from "../../../assets/mock.json";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

const Product = (props) => {

    const [quantity, setQuantity] = useState(1);// product quantity added by user

    const [imageIndex, setImageIndex] = useState(0); // image index

    let { productId } = useParams();// get object with key-value as product-id and number

    const product_id_int = +productId; // convert string to int for compare

    //filter to get selected product
    const product_details = data.filter((item) => item.id === product_id_int);

    // show content line by line
    function sentenceLineBreak(content) {
        return content.split(/\|/g);
    }

    // storing function in navigate
    const navigate = useNavigate();

    // direct to cart with add to cart button
    const navigateToCart = () => {
        navigate("/home/cart");
    }

    return product_details.map((item) =>


        <div className="product-section" key={item.id}>
            {/* Product imgages View */}
            <div className="product-image-section">
                <div className="product-image">
                    <img src={require(`../../../assets/${item.image[imageIndex]}`)} alt="product-image" />
                </div>

                {/* thumbnail for product views  */}
                {/* show when more than one image */}
                {(item.image.length > 1) &&
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
                    </div>)}

            </div>

            <div className="product-details-section">
                <div className="Back_Products" onClick={() => navigate('/home/card')}>
                    <BsArrowLeft style={{ fontSize: '30px' }} />
                    <span>Back</span>
                </div>
                <h2>{item.title}</h2>
                <ol className="product-description">{sentenceLineBreak(item.content).map((item, index) => <li key={index}>{item}</li>)}</ol>
                <b><FaIndianRupeeSign />{item.price[0]}</b>

                <div>
                    <label htmlFor="qty">Qty.</label>
                    <input id="qty" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </div>

                <button id="cart-button" onClick={() => { props.Add(item, quantity); navigateToCart(); }}>
                    Add to Cart
                </button>

            </div>

        </div>
    );

}

export default Product;