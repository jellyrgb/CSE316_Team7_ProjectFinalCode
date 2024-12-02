import { useEffect, useState } from "react";
import "../css/MyTama.css";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

interface InventoryItem {
  id: number;
  type: number;
  image_source: string;
  stat: number;
  buy_price: number;
  sell_price: number;
  quantity: number;
}

function MyTama() {
  const { user, pets } = useUserContext();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/${user.id}/inventory`);
          setInventory(response.data);
        } catch (error) {
          console.error("Error fetching inventory:", error);
        }
      }
    };

    fetchInventory();
  }, [user]);

  if (!user || pets.length === 0) {
    return <div>Loading...</div>;
  }

  const pet = pets.find((pet) => pet.is_active);

  if (!pet) {
    return <div>No active pet found</div>;
  }

  return (
    <div className="my-tama fullscreen">
      <div className="pet-section">
        <img src={pet.image_source} alt={pet.name} className="pet-image" />
        <div className="status-container">
          <div className="status">
            <span>Hunger</span>
            <div className="status-bar">
              <div className="hunger-filled" style={{ width: `${pet.hunger}%` }}></div>
            </div>
          </div>

          <div className="status">
            <span>Happiness</span>
            <div className="status-bar">
              <div className="happiness-filled" style={{ width: `${pet.fun}%` }}></div>
            </div>
          </div>

          <div className="status">
            <span>Cleanliness</span>
            <div className="status-bar">
              <div className="cleanliness-filled" style={{ width: `${pet.clean}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="inventory-section">
        <h2>Inventory</h2>
          <div className="inventory-items">
            {inventory.map((item) =>
              Array.from({ length: item.quantity }).map((_, index) => (
                <div key={`${item.id}-${index}`} className="inventory-item">
                  <img src={item.image_source} />
                  <div className="item-info">
                    <span>Stat: {item.stat}</span>
                  </div>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
}

export default MyTama;