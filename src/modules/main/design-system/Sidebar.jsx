import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    // price value
    const [value, setValue] = useState(0);

    // store checked categories state
    const [checkedKeys, setCheckedKeys] = useState([]);

    const setCheckbox = (e) => {
        // if checked then unchecked checkbox
        if (checkedKeys.includes(e.target.name)) {
            setCheckedKeys(['']);
            // show all products
            navigate('/card');
        }
        // checked then unchecked all checkboxes
        else {
            setCheckedKeys([e.target.name]);
            // filter products
            navigate(`/card/${e.target.name}`);
        }

    }

    // set price value
    const setInputOnSlider = (a) => {
        setValue(a);
    }

    return (
        <>
            <aside>
                <div className="categories-section">
                    <div className="menu-title">Categories</div>
                    <div className="categories-item">
                        <label htmlFor="Shoes">Shoes</label>
                        <input id="Shoes" className="sidebar-checkboxes" type="checkbox" name="Shoes" checked={checkedKeys.includes("Shoes")} onChange={(e) => { setCheckbox(e); }} />
                    </div>

                    <div className="categories-item">
                        <label htmlFor="Electronics" >Electronics</label>
                        <input id="Electronics" className="sidebar-checkboxes" type="checkbox" name="Electronics" checked={checkedKeys.includes("Electronics")} onChange={(e) => { setCheckbox(e); }} />
                    </div>

                    <div className="categories-item">
                        <label htmlFor="Cloth">Cloth</label>
                        <input id="Cloth" className="sidebar-checkboxes" type="checkbox" name="Cloth" checked={checkedKeys.includes("Cloth")} onChange={(e) => { setCheckbox(e); }} />
                    </div>

                    <div className="categories-item">
                        <label htmlFor="Accessories">Accessories</label>
                        <input id="Accessories" className="sidebar-checkboxes" type="checkbox" name="Accessories" checked={checkedKeys.includes("Accessories")} onChange={(e) => { setCheckbox(e); }} />
                    </div>

                </div>

                <div className="price-section">
                    <div className="menu-title">Price</div>
                    <p>{value}</p>
                    <input type="range" min="100" max="500" onInput={(e) => { setInputOnSlider(e.target.value) }} />
                </div>

            </aside>

        </>
    )
}

export default Sidebar;