import { useParams, useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import data from '../../../assets/mock.json';
const Card = () => {

    // get category by dynamic segment
    const { category } = useParams();

    const navigate = useNavigate();

    // filter Product if category or show all product
    const filteredData = category ? data.filter((item) => item.categories === category) : data;
   
    return (
        <>
            <main id="main">
                {filteredData.map((product) => {
                    return (
                        <div className="product-card" key={product.id} onClick={() => navigate(`/Product/${product.id}`)}>
                            <div className="card-image">
                                <img src={require(`../../../assets/${product.image[0]}`)} alt={product.title} />
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
                                    <span style={{color:"green"}}>Price Now:-<b id="price"><FaIndianRupeeSign/>{`${product.price[0]}`}</b></span>{","}<br></br>
                                    <span>Max Price:-<b id="max-price">{`${product.price[1]}`}</b></span>
                                </div>

                            </div>
                        </div>)
                })}
            </main>
        </>
    )
}
export default Card;