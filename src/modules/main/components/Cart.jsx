import { useNavigate } from "react-router-dom";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import data from "../../../assets/mock.json";
import { BsArrowLeft } from "react-icons/bs";


const Cart = (props) => {

    // storing function
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return parseInt(props.CART.reduce((totalPriceSum, currentItem) => {
            return totalPriceSum += currentItem.quantity * currentItem.price[0];
        }, 0))
    }

    const gst = Math.round((calculateSubtotal() * (18)) / (100));

    return (
        <div className="cart-data">
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
                    {(props.CART.length > 0) && (<>
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
                            <div className="Back_Products" onClick={() => navigate('/home/card')}>
                                <BsArrowLeft style={{ fontSize: '30px' }} />
                                <span>Back</span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                    {(props.CART.map((item) => (
                        <tr key={item.id}>
                            <td className="table-cart-item">
                                <img src={require(`../../../assets/${item.image[0]}`)} id="table-cart-image" /><span>{item.title}</span>
                            </td>

                            <td >
                                <span className="icon_circle"><FaMinus style={{ color: "red", cursor: "pointer" }} onClick={() => {
                                    props.Del(item)
                                }} /></span>
                                <div style={{ fontSize: "20px", width: "100px", display: "inline" }}>{item.quantity}</div>
                                <span className="icon_circle"><FaPlus style={{ color: "blue", cursor: "pointer" }} onClick={() => props.Add(item, 1)} /></span>

                            </td>

                            <td className="cart-item-price" ><span><FaIndianRupeeSign />{item.price[0]}</span></td>

                            <td>{parseFloat(((item.quantity) * (+item.price[0])).toFixed(2))}</td>
                        </tr>
                    )))}
                </tbody>

            </table>
        </div>
    )

}

export default Cart;