import Header from "./modules/main/design-system/Header";
import Sidebar from "./modules/main/design-system/Sidebar";
import Register from "./modules/main/components/Register";
import Card from '../src/modules/main/components/Card';
import Cart from '../src/modules/main/components/Cart';
import Login from '../src/modules/main/components/Login';
import Product from "./modules/main/components/Product";
import Error from '../src/modules/main/components/Error';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../src/styles/global.css";

function App() {

  const [cartItem, setCartItem] = useState([]); //cart items

  return (
    <div className="container">

      <Routes>
        {/* Common Layout Routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Header Cart={cartItem} setCart={setCartItem}/>}>
          <Route path=":category?" element={<>
            <Sidebar />
            <Card />
          </>} />
          <Route path="cart" element={<Cart Cart={cartItem} setCart={setCartItem} />} />
          <Route path="product/?" element={<Product Cart={cartItem} setCart={setCartItem} />} />
        </Route>
        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </div >
  );
}

export default App;
