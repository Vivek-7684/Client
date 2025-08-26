import { useState, useEffect } from "react";
import Delete from "../../../assets/Delete.png";
import Pen from "../../../assets/pen.png";
import { toast } from "react-toastify";


const PricingPanel = () => {

    const [pricing, setPricing] = useState({
        shipping_charges: "",
        discount_off: ""
    });

    const getPricing = () => {
        fetch("http://localhost:3001/pricing/get", {
            credentials: "include"
        })
            .then((response) => response.json())
            .then((data) => setPricing(data[0]))
            .catch((err) => toast.error(err.message))
    }

    useEffect(() => {
        getPricing();
    }, [])

    console.log(pricing);

    return (
        
        <div className="admin-dashboard"
            style={
                {
                    position: "absolute",
                    left: "140",
                    top: "50",
                    padding: '1rem',
                    width: "fit-Content"
                }}>
            
            {/* order summary */}
            <div className="order-summary" >
                <h3>Pricing  Set</h3>
                <hr></hr>

                <div style={{ display: "flex", gap: "10rem", padding: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span>Shipping Charges</span>
                        <span>Discount</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <span>₹{pricing.shipping_charges}</span>
                        <span>₹{pricing.discount_off}</span>
                    </div>
                </div>

                {/* <div style={{ display: "flex", gap: "12rem", padding: "1rem" }}>
                    <span>Total</span>
                    <span>₹{Math.round(calculateSubtotal()) + gst + 50}</span>
                </div> */}
            </div>

            {/* < table >
                <thead>
                    <tr>
                       
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody style={{ overflowY: "hidden" }}>
                    <tr>
                       
                        <td>
                            <img src={Pen}
                                style={{ width: "25px", height: "25px", marginLeft: "5px", cursor: "pointer" }} />
                            <span>Edit</span>
                        </td>
                    </tr>
                </tbody>
            </table > */}
        </div>
    )
}

export default PricingPanel;