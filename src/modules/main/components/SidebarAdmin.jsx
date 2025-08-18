const SidebarAdmin = ({ setActive }) => {
    return (
        <div
            style={{
                width: "140px",
                height: "100vh",
                background: "#f5f5f5",
                padding: "20px",
                top: "0",
                left: "0rem",
                height: "100vh",
                position: "fixed"

            }}>
            <div style={{ padding: "20px",marginTop:"50px" }}>
                <h3>Admin Panel</h3>
                <ul style={{ listStyle: "none", padding: 10 }}>
                    <li><button onClick={() => setActive("products")}>📦 Products</button></li>
                </ul>
            </div>

        </div>
    );
}
export default SidebarAdmin;
