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

    const handleSubmit = () => {
        fetch("http://localhost:3001/pricing/add", {
            method: "post",
            credentials: "include",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                charges: pricing.shipping_charges,
                discount: pricing.discount_off
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data?.message === "Pricing Updated" || data?.message === "Pricing Added") {
                    toast.success(data?.message);
                } else {
                    throw new Error(data?.message);
                }
            })
            .catch((err) => toast.error(err.message))
    }

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
                        <span>{pricing.discount_off}%</span>
                    </div>
                </div>

            </div>


            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "fit-Content",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    marginTop: "1rem"
                }}>

                <form>
                    {/* Shipping Charges */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                        <label htmlFor="shipping_charges" style={{ width: "80px", fontWeight: "500" }}>Shipping Charges <span style={{ color: "red" }}>*</span></label>
                        <input id="shipping_charges" type="text" placeholder="Charges" required
                            value={pricing.shipping_charges}
                            onChange={(e) => { setPricing({ ...pricing, shipping_charges: e.target.value }) }}
                            style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                    </div>

                    {/* Category */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                        <label htmlFor="discount_off" style={{ width: "80px", fontWeight: "500" }}>Discount </label>
                        <input id="discount_off" type="text" placeholder="Discount" required
                            value={pricing.discount_off}
                            onChange={(e) => { setPricing({ ...pricing, discount_off: e.target.value }) }}
                            style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                    </div>

                </form>

                <button className="cart-button" onClick={handleSubmit}
                    style={{ padding: '0.3rem', width: '20%', border: "none" }}
                >Update</button>

            </div>

        </div>
    )
}

export default PricingPanel;