import Header from "./modules/main/design-system/Header";
import Sidebar from "./modules/main/design-system/Sidebar";
import Register from "./modules/main/components/Register";
import Card from '../src/modules/main/components/Card';
import Cart from '../src/modules/main/components/Cart';
import Product from "./modules/main/components/Product";
import Error from '../src/modules/main/components/Error';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../src/styles/global.css";

function App() {

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const addToCart = (items, quantity) => {

    // updated item with quantity if not in cart
    const updatedProduct = { ...items, quantity: (+items.quantity) + (+quantity) - 1 };

    // check item is already in cart  
    cart.some((a) => a.id === items.id) ? (
      setCart(cart.map((cartItem) => {
        if (cartItem.id === items.id) {   // +1 add quantity of same item
          cartItem.quantity = (+cartItem.quantity) + (+quantity);
          return cartItem;
        }
        else {
          return cartItem; // return old cart item data 
        }
      }))
    ) :
      setCart([...cart, updatedProduct]);

  }

  const removeFromCart = (items) => {
    // check item quantity > 1
    cart.some((currentItem) => (items.id === currentItem.id) && (currentItem.quantity > 1)) ? (
      setCart(cart.map((cartItem) => {
        if (cartItem.id === items.id) {   // -1 del quantity of same item
          cartItem.quantity = cartItem.quantity - 1;
          return cartItem;
        }
        else {
          return cartItem; // return old cart item data 
        }
      }))
    ) :
      setCart(cart.filter((cartItem) => cartItem.id !== items.id));  // remove complete single item 

    // console.log(cart.length);
  }

  return (
    <div className="container">

      <Routes>
        {/* Common Layout Routes */}
        <Route path="/" element={<Header CART={cart} />}>
          <Route path="card/:category?" element={<>
            <Sidebar />
            <Card CART={cart} Add={addToCart} />
          </>} />
          <Route path="cart" element={<Cart CART={cart} Add={addToCart} Del={removeFromCart} />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:productId" element={<Product Add={addToCart} Del={removeFromCart} />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </div >
  );
}

export default App;
