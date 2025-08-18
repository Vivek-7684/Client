import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import ProductPanel from "./ProductPanel";

function AdminDashboard() {
    const [activePanel, setActivePanel] = useState("");

    return (
        <div style={{ overflow: "hidden" }}>
            {/* Sidebar */}
            <SidebarAdmin setActive={setActivePanel} />

            {/* Main Area */}
            <div style={{ position: "fixed", left: "0" }}>
                {activePanel === "products" && <ProductPanel />}
            </div>
        </div>
    );
}

export default AdminDashboard;
