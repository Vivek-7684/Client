import Header from "./modules/main/design-system/Header";
import Sidebar from "./modules/main/design-system/Sidebar";
import Register from "./modules/main/components/Register";
import Card from '../src/modules/main/components/Card';
import WishList from '../src/modules/main/components/WishList';
import Cart from '../src/modules/main/components/Cart';
import Login from '../src/modules/main/components/Login';
import Product from "./modules/main/components/Product";
import Profile from "./modules/main/components/Profile";
import Error from '../src/modules/main/components/Error';
import AdminDashboard from "./modules/main/components/AdminDashboard";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "../src/styles/global.css";
import { ToastContainer } from "react-toastify";

function App() {

  const [cartItem, setCartItem] = useState([]); //cart items

  const [WishlistItem, setWishlistItem] = useState([]); // wishlist items

  const [showProfile, setShowProfile] = useState(false);

  // profile image
  const [userProfile, setUserProfile] = useState("");

  // console.log(userProfile);

  return (
    <div className="container">

      <Routes>
        {/* Common Layout Routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/"
          element={
            <Header Cart={cartItem}
              Wishlist={WishlistItem}
              setCart={setCartItem}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
              userProfile={userProfile}
              setUserProfile={setUserProfile} />}
        >

          <Route path=":category?" element={<>
            <Sidebar />
            <Card WishlistItem={WishlistItem} setWishlistItem={setWishlistItem} />
          </>} />
          <Route path="cart" element={<Cart Cart={cartItem} setCart={setCartItem} />} />
          <Route path="wishlist" element={<WishList WishlistItem={WishlistItem} setWishlistItem={setWishlistItem} setCart={setCartItem} />} />
          <Route path="product/?" element={<Product Cart={cartItem} setCart={setCartItem} />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<Profile userProfile={userProfile} setUserProfile={setUserProfile} />} />

          <Route path="Error" element={<Error />}></Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div >
  );
}

export default App;
