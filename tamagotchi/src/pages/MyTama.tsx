import "../css/MyTama.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Tamagotchi, useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
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
  const { user, pets, loading } = useUserContext();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activePet, setActivePet] = useState<Tamagotchi | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const activePet = pets.find((pet) => pet.is_active);
    setActivePet(activePet);

    const fetchInventory = async () => {
      if (!user && !loading) {
        navigate("/signIn");
      }
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
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (!pets.length) {
    // Redirect user to adopt page after 3 seconds
    setTimeout(() => {
      navigate("/adopt");
    }, 3000);
    return <div>No Tamagotchi found. Please adopt one first.<br></br>Redirecting to adopt page in 3 seconds...</div>;
  }

  const pet = activePet;

  if (!pet) {
    setTimeout(() => {
      natvigate("/adopt");
    }, 3000);
    return <div>No active Tamagotchi found. Please adopt a new one first.<br></br>Redirecting to adopt page in 3 seconds...</div>;
  }

  const handleItemClick = async (item: InventoryItem) => {
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
        if(pet.is_sick){
          updatedPet.is_sick=false;
          alert("Treat success");
        }
        else{
          updatedPet.clean = Math.min(updatedPet.clean + item.stat, 100);
          updatedPet.is_sick=false;
        }
        break;
      default:
        break;
    }

    setActivePet(updatedPet);   

    // Update the pet status accordingly
    try {
      await axios.put(`${API_BASE_URL}/api/pet/${activePet.id}/status`, {
        hunger: updatedPet.hunger,
        clean: updatedPet.clean,
        fun: updatedPet.fun,
        is_sick: updatedPet.is_sick
      });
    } catch (error) {
      console.error("Error updating pet status:", error);
    }

    // Update the inventory
    try {
      await axios.put(`${API_BASE_URL}/api/user/${user.id}/inventory/use`, { itemId: item.id });
    } catch (error) {
      console.error("Error updating inventory:", error);
    }

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
        {pet.is_sick ? (
          <>
            <img src="/images/germ.png" className="germ-image icon-overlay" />
            <img src="/images/germ2.png" className="germ-image icon-overlay2" />
          </>
        ) : null}

        <img src={pet.image_source} alt={pet.name} className="pet-image main-image" />
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

          <div className="status">
            <span>Lvl. 1</span>
            <div className="status-bar">
              <div className="exp-filled" style={{ width: `${pet.clean}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="inventory-section">
        <h2>Inventory</h2>
          <div className="inventory-items">
            {inventory.map((item) =>
              Array.from({ length: item.quantity }).map((_, index) => (
                <div key={`${item.id}-${index}`} className={`inventory-item ${item.isDisappearing ? 'disappearing' : ''}`} onClick={() => handleItemClick(item)}>
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