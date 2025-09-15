import { useState, useEffect } from "react";
import axios from 'axios';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {
    TableContainer,
    Table, TableHead,
    TableCell, TableRow, TableBody,
    Paper, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import { toast } from "react-toastify";


const PricingPanel = () => {

    const [pricing, setPricing] = useState({
        shipping_charges: "",
        discount_off: ""
    });

    const [showpricing, setShowPricing] = useState({
        shipping_charges: "",
        discount_off: ""
    })

    const [coupon, setCoupon] = useState({
        couponName: "",
        minPrice: "",
        offer: ""
    })

    const [getCoupon, setgetCoupon] = useState([]);

    const [showcoupon, setshowCoupon] = useState({
        couponName: "",
        minPrice: "",
        offer: ""
    })

    const [open, setOpen] = useState(false);

    const [deleteCouponId, setdeleteCouponId] = useState(null);

    const getPricing = () => {
        fetch("http://localhost:3001/pricing/get", {
            credentials: "include"
        })
            .then((response) => { return response.json() })
            .then((data) => {
                if (data?.message === "get pricing data") {
                    setPricing(data.result[0]);
                    setShowPricing(data.result[0]);
                }
                else {
                    throw new Error(data?.message);
                }
            })
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
            .then((response) => response.json())
            .then((data) => {
                if (data?.message === "Pricing Updated" || data?.message === "Pricing Added") {
                    getPricing();
                    toast.success(data?.message);
                } else {
                    throw new Error(data?.message);
                }
            })
            .catch((err) => toast.error(err.message))
    }

    const couponAPI = axios.create({
        baseURL: "http://localhost:3001/coupon",
        withCredentials: true
    })

    const getCoupons = () => {
        couponAPI.get('/getCoupon')
            .then((res) => {
                setgetCoupon(res.data.result || []);
            })
            .catch((err) => {
                if (err.response.data.message
                     && err.response.data.message !== "Data not found.Please Add Coupon") {
                  
                    toast.error(err.response.data.message);
                }
            })
    }

    useEffect(() => {
        getCoupons();
    }, [])

    const deleteCoupon = (id) => {
        couponAPI.delete(`/deleteCoupon/${id}`)
            .then(() => {
                toast.success("Coupon deleted successfully");
                getCoupons();
            })
            .catch((err) => {
                if (err.message) {
                    toast.error(err.message);
                }
            })
    }

    const AddCoupon = () => {
        fetch("http://localhost:3001/coupon/addCoupon", {
            method: "post",
            credentials: "include",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                couponName: coupon.couponName,
                minPrice: coupon.minPrice,
                offer: coupon.offer
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.status === 200) {
                    toast.success(data?.message);
                    getCoupons();
                } else {
                    throw new Error(data?.message);
                }
            })
            .catch((err) => toast.error(err.message))
    }

    return (
        <>
            {/* pricing section */}
            <div className="admin-dashboard"
                style={{
                    position: "absolute",
                    left: "140",
                    top: "50",
                    padding: '1rem',
                    width: "fit-Content"
                }}>

                <div className="order-summary"
                    style={{ border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                    <h3>Pricing</h3>
                    <hr />

                    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
                            <span>Shipping Charges</span>
                            <span>Discount</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <span>₹{showpricing.shipping_charges}</span>
                            <span>{showpricing.discount_off}%</span>
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
                        marginTop: "4.3rem"
                    }}>
                    <h3>Set Pricing </h3>
                    <hr />

                    <form>
                        {/* Shipping Charges */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", marginTop: "13px" }}>
                            <label htmlFor="shipping_charges" style={{ width: "80px", fontWeight: "500" }}>Shipping Charges <span style={{ color: "red" }}>*</span></label>
                            <input id="shipping_charges" type="text" placeholder="Charges"
                                value={pricing.shipping_charges}
                                onChange={(e) => setPricing({ ...pricing, shipping_charges: e.target.value })}
                                style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "190px" }}
                                required />
                        </div>

                        {/* Discount */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
                            <label htmlFor="discount_off" style={{ width: "80px", fontWeight: "500" }}>Discount </label>
                            <input id="discount_off" type="text" placeholder="Discount"
                                value={pricing.discount_off}
                                onChange={(e) => setPricing({ ...pricing, discount_off: e.target.value })}
                                style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "190px" }} />
                        </div>
                    </form>

                    <button className="cart-button" onClick={handleSubmit}
                        style={{ padding: '0.5rem', width: '25%', border: "none" }}
                    >Update</button>
                </div>
            </div>

            {/* coupon section */}
            <div
                style={{
                    position: "absolute",
                    left: "410",
                    top: "20",
                    padding: '0.7rem',
                    width: "fit-Content"
                }}>
                <div
                    style={{
                        background: "white",
                        padding: "15px",
                        borderRadius: "12px",
                        width: "fit-Content",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        marginTop: "1rem"
                    }}>
                    <h3>Set Coupon </h3>
                    <hr />

                    <form>
                        {/* Coupon Name */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", marginTop: "13px" }}>
                            <label htmlFor="couponName" style={{ width: "80px", fontWeight: "500" }}>Name
                                <span style={{ color: "red" }}>*</span></label>
                            <input id="couponName" placeholder="Coupon Name "
                                value={coupon.couponName}
                                onChange={(e) => setCoupon({ ...coupon, couponName: e.target.value })}
                                style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }}
                                required />
                        </div>

                        {/* Min Price */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                            <label htmlFor="minPrice" style={{ width: "80px", fontWeight: "500" }}>Min Price
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="minPrice" placeholder="Minimum Price for Coupon Validity"
                                value={coupon.minPrice}
                                onChange={(e) => setCoupon({ ...coupon, minPrice: e.target.value })}
                                style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                        </div>

                        {/* Offer */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
                            <label htmlFor="offer" style={{ width: "80px", fontWeight: "500" }}>Offer
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input id="offer" placeholder="Offer %"
                                value={coupon.offer}
                                onChange={(e) => setCoupon({ ...coupon, offer: e.target.value })}
                                style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                        </div>
                    </form>

                    <button className="cart-button" onClick={AddCoupon}
                        style={{ padding: '0.4rem', width: '20%', border: "none" }}
                    >Add</button>
                </div>

                {/* coupon list */}
                {getCoupon.length > 0 && <TableContainer
                    component={Paper}
                    sx={{
                        position: "absolute",   // important
                        top: 30,                 // top right
                        left: 430,
                        mt: 2,
                        maxHeight: 400,
                        width: 400,             // fixed width
                        overflow: "auto",
                        borderRadius: 2,
                        boxShadow: 3,

                    }}
                    style={{ overflowY: "scroll" }}
                >
                    <Typography
                        variant="h5"
                        sx={{ p: 1, textAlign: "center" }}
                    >
                        <b>Coupons</b>
                    </Typography>

                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Coupon Name</b></TableCell>
                                <TableCell><b>Min Price</b></TableCell>
                                <TableCell><b>Offer</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {getCoupon?.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell>{coupon.couponName}</TableCell>
                                    <TableCell>{coupon.minPrice}</TableCell>
                                    <TableCell>{coupon.offer}</TableCell>
                                    <TableCell>
                                        <Tooltip title="delete" arrow>
                                            <DeleteOutlineTwoToneIcon
                                                sx={{ cursor: "pointer", color: "red" }}
                                                onClick={() => {
                                                    setdeleteCouponId(coupon.id);
                                                    setOpen(true);
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div >

            {/* delete confirmation dialog */}
            < Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Delete Coupon</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete coupon{" "}
                        <b>{getCoupon?.find(c => c.id === deleteCouponId)?.couponName}</b>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        deleteCoupon(deleteCouponId);
                        setOpen(false);
                    }}
                        variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog >
        </>
    )
}

export default PricingPanel;
