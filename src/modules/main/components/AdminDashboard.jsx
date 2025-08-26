import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import ProductPanel from "./ProductPanel";
import PricingPanel from "./PricingPanel";

function AdminDashboard() {
    const [activePanel, setActivePanel] = useState("products");

    return (
        <div style={{ overflow: "hidden" }}>
            {/* Sidebar */}
            <SidebarAdmin setActive={setActivePanel} />

            {/* Main Area */}

            {/* product panel */}
            <div style={{ position: "fixed", left: "0" }}>
                {activePanel === "products" && <ProductPanel />}
            </div>

            {/* pricing panel */}
            <div style={{ position: "fixed", left: "0" }}>
                {activePanel === "pricing" && <PricingPanel />}
            </div>


        </div>
    );
}

export default AdminDashboard;
