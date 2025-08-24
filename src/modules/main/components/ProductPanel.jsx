import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertRawImageToURL } from "../helpers/convertRawImageToURL";
import Delete from "../../../assets/Delete.png";
import Pen from "../../../assets/pen.png";
import backtick from "../../../assets/back-left.png";
import { toast } from "react-toastify";

const ProductPanel = () => {
    const [products, setProducts] = useState([]); // products detail

    const [showAddProduct, setShowAddProduct] = useState(false); // set product form

    const [editingProduct, setEditingProduct] = useState(null); // For edit

    const [mainImageBase64, setMainImageBase64] = useState(null); // image for upload

    const [previewBase64, setPreviewBase64] = useState([]); // preview images for upload

    // navigate to link
    const navigate = useNavigate();

    // load product data
    const getProduct = () => {
        fetch("http://localhost:3001/product/getAll",
            { method: "GET", credentials: "include" })
            .then((res) => res.json())
            .then((data) => setProducts(data)) // set products data
            .catch(() => toast.error("Failed to load products"));
    };

    // set product with page refresh
    useEffect(() => { getProduct(); }, []);

    const loadPreviewImages = async (id) => {
        return fetch(`http://localhost:3001/product/getProductImages/?id=${id}`,
            { method: "GET", credentials: "include" })
            .then((res) => res.json())

    }

    const openAddProduct = () => {
        setEditingProduct(null); // clear edited data
        setMainImageBase64(null); // clear main image for upload 
        setPreviewBase64([]); // clear preview image
        setShowAddProduct(true); // open form
    };

    const openEditProduct = (product) => {

        setEditingProduct(product);  // store edited product data
        setMainImageBase64(convertRawImageToURL(product.image.data)); // New upload will replace

        loadPreviewImages(product.id).then((data) => {
            setPreviewBase64(data.map((img) => convertRawImageToURL(img?.image?.data))); // preview image set
        })
        
        setShowAddProduct(true);    // add prdouct view
    };

    const handleImageChange = (e, type) => {

        const files = [...e.target.files];

        if (type === "main") {

            const file = files[0]; //  single file get

            // clear temp link for browser
            if (mainImageBase64) {
                URL.revokeObjectURL(file);
            }

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setMainImageBase64(reader.result); // base64 image for upload
                reader.readAsDataURL(file);
            }
        } else if (type === "preview") {

            Promise.all(files?.map(f => new Promise(res => {             // base 64 image for upload
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result);
                reader.readAsDataURL(f);
            }))).then(arr => setPreviewBase64(arr));

        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;

        const payload = {
            title: form.title.value,
            category: form.category.value,
            description: form.description.value,
            min_price: form.minPrice.value,
            max_price: form.maxPrice.value,
            image: mainImageBase64,
            previewImages: previewBase64,
        };

        const url = editingProduct
            ? `http://localhost:3001/product/products/${editingProduct.id}`
            : "http://localhost:3001/product/addProduct";

        const method = editingProduct ? "PUT" : "POST";

        fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Something Went Wrong");
                return res.json();
            })

            .then(() => {
                toast.success(editingProduct ? `${payload.title} updated!` : `${payload.title} added!`);

                setShowAddProduct(false); // hide form
                getProduct();// get updated data
            })

            .catch((err) => toast.error(err.message));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:3001/products/${id}`, { method: "DELETE", credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Delete failed");
                toast.success("Product deleted!");
                getProduct();
            })
            .catch((err) => toast.error(err.message));
    };

    return (
        <div className="admin-dashboard" style={{ position: "absolute", left: "140", overflowX: "scroll", overflowY: "scroll" }}>
            {/* Add/Edit Product Modal */}
            {showAddProduct && (
                <div style={{
                    position: "fixed",
                    top: 10, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 1000,
                    marginTop: "1rem"
                }}>

                    <span style={{ border: "none", cursor: "pointer", position: "relative", top: "-234", left: "90", padding: "5px" }}
                        onClick={() => setShowAddProduct(false)}>
                        <img src={backtick} style={{ width: "15px", height: "15px" }} />
                        <span style={{
                            paddingLeft: "15px", color: "#111111",
                            fontFamily: "Arial, sans-serif", fontSize: "17px", marginBottom: "32px", fontWeight: "500"
                        }}>Back</span>
                    </span>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        width: "600px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}>
                        <h3 style={{ padding: "0.4rem" }}>{editingProduct ? "Edit Product" : "Add Product"}</h3>
                        <hr style={{ marginBottom: "15px" }} />
                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                <label htmlFor="title" style={{ width: "120px", fontWeight: "500" }}>Title <span style={{ color: "red" }}>*</span></label>
                                <input id="title" type="text" placeholder="Title" required defaultValue={editingProduct?.title || ""} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                            </div>

                            {/* Category */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                <label htmlFor="category" style={{ width: "120px", fontWeight: "500" }}>Category <span style={{ color: "red" }}>*</span></label>
                                <input id="category" type="text" placeholder="Category" required defaultValue={editingProduct?.categories || ""} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                            </div>

                            {/* Description */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                <label htmlFor="description" style={{ width: "120px", fontWeight: "500" }}>Description <span style={{ color: "red" }}>*</span></label>
                                <textarea id="description" placeholder="Description" required defaultValue={editingProduct?.content || ""} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "80px", width: "290px" }} />
                            </div>

                            {/* Max Price */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                <label htmlFor="maxPrice" style={{ width: "120px", fontWeight: "500" }}>Max Price <span style={{ color: "red" }}>*</span></label>
                                <input id="maxPrice" type="number" placeholder="Max Price" required defaultValue={editingProduct?.max_price || ""} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                            </div>

                            {/* Min Price */}
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                <label htmlFor="minPrice" style={{ width: "120px", fontWeight: "500" }}>Min Price <span style={{ color: "red" }}>*</span></label>
                                <input id="minPrice" type="number" placeholder="Min Price" required defaultValue={editingProduct?.min_price || ""} style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "290px" }} />
                            </div>

                            {/* Main Image */}
                            <input id="mainImage" type="file" onChange={(e) => handleImageChange(e, "main")} />

                            {mainImageBase64 && <div style={{ marginLeft: "120px", marginBottom: "15px" }}>
                                <img src={mainImageBase64} alt="Main Preview" style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "6px" }} />
                            </div>}

                            {/* Preview Images */}
                            <input id="previewImages" type="file" multiple onChange={(e) => handleImageChange(e, "preview")} />

                            {previewBase64.length > 0 && <div style={{ marginLeft: "120px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {previewBase64.map((src, idx) => <img key={idx} src={src} alt="Preview" style={{ width: "75px", height: "75px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "6px" }} />)}
                            </div>}

                            {/* Buttons */}
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                                <button type="button" onClick={() => setShowAddProduct(false)} style={{ marginRight: "10px", padding: "5px 10px" }}>Cancel</button>
                                <button style={{ background: "#e7e6e6ff", color: "black", padding: "5px 10px", border: "none", borderRadius: "5px" }}>{editingProduct ? "Update" : "Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <h4>
                <div className="product-heading" style={{ marginTop: "4rem" }}>
                    {products?.length > 0 && <span>{`My Products (${(products || []).length})`}</span>}
                    <button onClick={openAddProduct} style={{
                        color: "", padding: "0.5rem", borderRadius: "10px",
                        marginBottom: "5px", border: "1px solid black", marginLeft: "30px", cursor: "pointer"
                    }}>Add Product</button>
                    <hr style={{ marginLeft: "10px", width: "1040px" }}></hr>
                </div>
            </h4>

            {/* Product Table */}
            <table>
                <thead>
                    <tr>
                        <th>Item No.</th>
                        <th>Product Name</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Max Price</th>
                        <th>Price Now</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody style={{ overflowY: "hidden" }}>
                    {products.map((product, index) => (
                        <tr key={product.id} >
                            <td>{index + 1}</td>
                            <td>{product.title}</td>
                            <td><img src={convertRawImageToURL(product?.image?.data)}
                                style={{ width: "75px", height: "75px", cursor: "pointer" }}
                                onLoad={(e) => { URL.revokeObjectURL(e.target.src) }}
                                onClick={() => navigate(`/Product?id=${product.id}`)} /></td>
                            <td>{product.categories}</td>
                            <td>{product.content}</td>
                            <td>{product.max_price}</td>
                            <td>{product.min_price}</td>
                            <td>
                                <img src={Delete} onClick={() => handleDelete(product.id)} style={{ width: "25px", height: "25px", cursor: "pointer" }} />
                                <img src={Pen} onClick={() => openEditProduct(product)} style={{ width: "25px", height: "25px", marginLeft: "5px", cursor: "pointer" }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductPanel;
