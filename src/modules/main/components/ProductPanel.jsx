import { useEffect, useState } from "react";
import { convertRawImageToURL } from "../helpers/convertRawImageToURL";
import Delete from "../../../assets/Delete.png";
import Pen from "../../../assets/pen.png";
import backtick from "../../../assets/back-left.png";
import { toast } from "react-toastify";

const ProductPanel = () => {

    const [products, setProducts] = useState([]); // get product data

    const [showAddProduct, setShowAddProduct] = useState(false); // show add product

    const [editingProduct, setEditingProduct] = useState(null); // For editing product 

    const [mainImage, setMainImage] = useState(null); // preview show

    const [mainImageBase64, setMainImageBase64] = useState(null); // upload ke liye

    const [previewImages, setPreviewImages] = useState([]);

    const [previewBase64, setPreviewBase64] = useState([]);


    const getProductWithImages = async () => {
        const res = await fetch("http://localhost:3001/product/getAll", { method: "GET", credentials: "include" })
        
        const products = res.json();

        
    }


    // get Product Images
    const getProductImages = (id) => {
        fetch(`http://localhost:3001/product/getProductImages?id=${id}`, { method: "GET", credentials: "include" })
            .then((res) => res.json())
            .then((data) => { return data; })
            .catch(() => toast.error("Failed to load preview images"));
    }

    // get Product Data
    const getProduct = () => {
        

    };

    
    // load product data 
    useEffect(() => { getProduct(); getProductImages(); }, []);

    const openAddProduct = () => {
        setEditingProduct(null);
        setMainImage(null);
        setMainImageBase64(null);
        setPreviewImages([]);
        setPreviewBase64([]);
        setShowAddProduct(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);

        // main page
        setMainImage(convertRawImageToURL(product.image.data));
        setMainImageBase64(null); // New upload will replace

        // preview images
        const previews = (product.previewImages || []).map(img =>
            img.data
        );
        console.log(previews);
        setPreviewImages(previews);
        setPreviewBase64([]); // user new upload karega toh update hoga

        setShowAddProduct(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        const payload = {
            title: form.title.value,
            category: form.category.value,
            description: form.description.value,
            min_price: form.minPrice.value,
            max_price: form.maxPrice.value,
            image: mainImageBase64 || editingProduct?.image?.data || null,
            previewImages:
                previewBase64.length > 0
                    ? previewBase64 // agar naya upload hua toh use
                    : editingProduct?.previewImages || [], // warna purane use karo
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
                if (!res.ok) {
                    res.json().then((err) => {
                        throw new Error(err.error || "Something Went Wrong");
                    })
                }
            })
            .then(() => {
                toast.success(editingProduct ? `${payload.title} updated!` : `${payload.title} added!`);

                setShowAddProduct(false);  // hide pop view

                getProduct();  // load data after add product 
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
                            <input id="mainImage" type="file" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setMainImage(URL.createObjectURL(file));
                                    const reader = new FileReader();
                                    reader.onloadend = () => setMainImageBase64(reader.result);
                                    reader.readAsDataURL(file);
                                }
                            }} />

                            {mainImage && <div style={{ marginLeft: "120px", marginBottom: "15px" }}>
                                <img src={mainImage} alt="Main Preview" style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "6px" }} />
                            </div>}

                            {/* Preview Images */}
                            <input id="previewImages" type="file" multiple onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setPreviewImages(files.map(f => URL.createObjectURL(f)));
                                Promise.all(files.map(f => new Promise(res => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => res(reader.result);
                                    reader.readAsDataURL(f);
                                }))).then(arr => setPreviewBase64(arr));
                            }} />

                            {previewImages.length > 0 && <div style={{ marginLeft: "120px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {previewImages.map((src, idx) => <img key={idx} src={src} alt="Preview" style={{ width: "75px", height: "75px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "6px" }} />)}
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
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.title}</td>
                            <td><img src={convertRawImageToURL(product.image.data)} style={{ width: "75px", height: "75px" }} /></td>
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
