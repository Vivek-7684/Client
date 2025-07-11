import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
// import data from '../../../assets/mock.json';

const Card = () => {

    // get category by dynamic segment
    const { category } = useParams();

    const navigate = useNavigate();

    const [productData, setProductData] = useState([]);

    const convertRawToURL = (rawData) => {
        const binaryData = new Uint8Array(rawData); // convert rawData to binary 
        const blobData = new Blob([binaryData]); // convert binary  to blob
        const image = URL.createObjectURL(blobData); // temporary url link
        return image; 
    }

    useEffect(() => {
        fetch("http://localhost:3001/product/getAll")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setProductData(data);
            })
            .catch((err) => console.log(err));
    }, []);


    // filter Product if category selected or show all product
    const filteredData = category ? productData.filter((item) => item.categories === category) : productData;

    return (
        <>
            <main id="main">
                {filteredData.map((product) => {
                    return (
                        <div className="product-card" key={product.id} onClick={() => navigate(`/Product/${product.id}`)}>
                            <div className="card-image">
                                <img src={convertRawToURL(product.image.data)} onLoad={(e)=>{
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
                                    <span style={{ color: "green" }}>Price Now:-<b id="price"><FaIndianRupeeSign />{`${product.max_price}`}</b></span>{","}<br></br>
                                    <span>Max Price:-<b id="max-price">{`${product.min_price}`}</b></span>
                                </div>

                            </div>
                        </div>)
                })}
            </main>
        </>
    )
}
export default Card;