import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Shop.css";
import { useShopContext } from "../context/ShopContext";
import { useUserContext } from "../context/UserContext";
import { API_BASE_URL } from '../config.tsx';
import { useNavigate } from "react-router-dom";

function Shop() {
  const { items } = useShopContext();
  const { user, loading, setUser } = useUserContext();
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  // Update balance when user data is changed
  useEffect(() => {
    if (!user && !loading) {
      navigate("/signIn");
    }
    if (user) {
      setBalance(user.balance);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const updateBalance = async (newBalance: number) => {
    if (user) {
      try {
        await axios.put(`${API_BASE_URL}/api/user/${user.id}/balance`, { balance: newBalance });
        setUser({ ...user, balance: newBalance });
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  const addItemToInventory = async (itemId: number, quantity: number) => {
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/api/user/${user.id}/inventory`, { itemId, quantity });
      } catch (error) {
        console.error("Error adding item to inventory:", error);
      }
    }
  };

  const handleItemClick = async (itemId: number, price: number) => {
    if (balance >= price) {
      const newBalance = balance - price;
      setBalance(newBalance);
      await updateBalance(newBalance); // Update balance in backend
      await addItemToInventory(itemId, 1); // Add item to inventory in backend
    } else {
      alert("Not enough balance!");
    }
  };

  if (!user) {
    return <div>User data unavailable.</div>;
  }

  const foodItems = items.filter(item => item.type === 1);
  const toyItems = items.filter(item => item.type === 2);
  const miscItems = items.filter(item => item.type === 3 || item.type === 4);

  const getEmoji = (type: number) => {
    switch (type) {
      case 3:
        return "✨";
      case 4:
        return "💊";
      default:
        return "";
    }
  };

  return (
    <div className="shop fullscreen">
      <div id="balance">
        <span>💰 {balance}G</span>
      </div>
      <div>
        {/* Food */}
        <h2>Food</h2>
        <div className="items">
          {foodItems.map(item => (
            <div key={item.id} className="item" onClick={() => handleItemClick(item.id, item.buy_price)}>
              <img src={item.image_source} />
              <div className="item-info">
                <p>🍖+{item.stat}</p>
                <p>Buy: {item.buy_price}G</p>
                <p>Sell: {item.sell_price}G</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toys */}
      <div>
        <h2>Toys</h2>
        <div className="items">
          {toyItems.map(item => (
            <div key={item.id} className="item" onClick={() => handleItemClick(item.id, item.buy_price)}>
              <img src={item.image_source} />
              <div className="item-info">
                <p>🚀+{item.stat}</p>
                <p>Buy: {item.buy_price}G</p>
                <p>Sell: {item.sell_price}G</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Misc */}
      <div>
        <h2>Misc</h2>
        <div className="items">
          {miscItems.map(item => (
            <div key={item.id} className="item" onClick={() => handleItemClick(item.id, item.buy_price)}>
              <img src={item.image_source} />
              <div className="item-info">
                <p>{getEmoji(item.type)}{item.type === 4 ? ` ${item.stat}%` : `+${item.stat}`}</p>
                <p>Buy: {item.buy_price}G</p>
                <p>Sell: {item.sell_price}G</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;