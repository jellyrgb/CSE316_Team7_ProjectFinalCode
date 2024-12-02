import { useEffect, useState } from "react";
import "../css/MyTama.css";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { API_BASE_URL } from '../config.tsx';

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
  const [activePet, setActivePet] = useState(pets.find((pet) => pet.is_active));

  useEffect(() => {
    const fetchInventory = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/user/${user.id}/inventory`);
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

  const pet = activePet;

  if (!pet) {
    return <div>No active pet found</div>;
  }

  const handleItemClick = (item: InventoryItem) => {
    let updatedPet = { ...pet };

    switch (item.type) {
      case 1: // Food
        updatedPet.hunger = Math.min(updatedPet.hunger + item.stat, 100);
        break;
      case 2: // Toy
        updatedPet.fun = Math.min(updatedPet.fun + item.stat, 100);
        break;
      case 3: // Misc
        updatedPet.clean = Math.min(updatedPet.clean + item.stat, 100);
        break;
      case 4: // Medicine
        updatedPet.clean = Math.min(updatedPet.clean + item.stat, 100);
        break;
      default:
        break;
    }

    setActivePet(updatedPet);

    // Update the pet status
    axios.put(`${API_BASE_URL}/api/pet/${pet.id}`, updatedPet)
      .catch(error => console.error("Error updating pet status:", error));

    // Update the inventory
    axios.post(`${API_BASE_URL}/api/user/${user.id}/inventory/use`, { itemId: item.id })
      .catch(error => console.error("Error updating inventory:", error));

    setInventory(prevInventory => {
      const updatedInventory = prevInventory.map(invItem => {
        if (invItem.id === item.id) {
          return { ...invItem, quantity: invItem.quantity - 1 };
        }
        return invItem;
      }).filter(invItem => invItem.quantity > 0);

      return updatedInventory;
    });
  };

  const getEmoji = (type: number) => {
    switch (type) {
      case 1:
        return "🍖";
      case 2:
        return "🚀";
      case 3:
        return "✨";
      case 4:
        return "💊";
      default:
        return "";
    }
  };

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
                <div key={`${item.id}-${index}`} className="inventory-item" onClick={() => handleItemClick(item)}>
                  <img src={item.image_source} />
                  <div className="item-info">
                    <span>{getEmoji(item.type)}{item.type === 4 ? ` ${item.stat}%` : `+${item.stat}`}</span>
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