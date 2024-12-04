import "../css/MyTama.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Tamagotchi, useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.tsx";

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
  const { user, loading } = useUserContext();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activePet, setActivePet] = useState<Tamagotchi | null>();
  const [activePetLoading, setActivePetLoading] = useState(true);
  const navigate = useNavigate();
  const [level, setLevel] = useState(Number);

  useEffect(() => {
    const fetchActivePet = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/${user.id}/active-pet`
          );
          setActivePet(response.data);
        } catch (error) {
          console.error("Error fetching active pet:", error);
        } finally {
          setActivePetLoading(false);
        }
      } else {
        setActivePetLoading(false); 
      }
    };

    const fetchInventory = async () => {
      if (!user && !loading) {
        navigate("/signIn");
      }
      if (user) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/${user.id}/inventory`
          );
          setInventory(response.data);
        } catch (error) {
          console.error("Error fetching inventory:", error);
        }
      }
    };

    fetchActivePet();
    fetchInventory();
  }, [user, loading, navigate]);

  if (loading || activePetLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (!activePet) {
    setTimeout(() => {
      navigate("/adopt");
    }, 3000);
    return (
      <div>
        No active Tamagotchi found. Please adopt a new one first.<br></br>
        Redirecting to adopt page in 3 seconds...
      </div>
    );
  }

  const updateActive = async () => {
    if (activePet) {
      try {
        await axios.put(`${API_BASE_URL}/api/user/${user.id}/activeChange`, {
          is_active: false,
        });
        setActivePet({ ...activePet, is_active: false });
      } catch (error) {
        console.error("Error updating active status:", error);
      }
    }
  };

  const handleItemClick = async (item: InventoryItem) => {
    let updatedPet = { ...activePet };

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
        if (activePet.is_sick) {
          updatedPet.is_sick = false;
          alert("Treat success");
        } else {
          updatedPet.clean = Math.min(updatedPet.clean + item.stat, 100);
          updatedPet.is_sick = false;
        }
        break;
      default:
        break;
    }
    setActivePet(updatedPet);

    try {
      // Fetch current level
      let currentLevelResponse = await axios.get(
        `${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`
      );
      const currentLevel = currentLevelResponse.data.level;
      const newLevel = Math.min(currentLevel + 5, 100); // Increase by 30, cap at 100
      if (newLevel === 100) {
        await updateActive();
        return navigate("/");
      } else {
        await axios.put(
          `${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`,
          { level: newLevel }
        );
        setLevel(newLevel);
      }
    } catch (error) {
      console.error("Error updating or creating level:", error);
    }

    // Update the pet status accordingly
    try {
      await axios.put(`${API_BASE_URL}/api/pet/${activePet.id}/status`, {
        hunger: updatedPet.hunger,
        clean: updatedPet.clean,
        fun: updatedPet.fun,
        is_sick: updatedPet.is_sick,
        is_active: updatedPet.is_active,
      });
    } catch (error) {
      console.error("Error updating pet status:", error);
    }

    // Update the inventory
    try {
      await axios.put(`${API_BASE_URL}/api/user/${user.id}/inventory/use`, {
        itemId: item.id,
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
    }

    setInventory((prevInventory) => {
      const updatedInventory = prevInventory
        .map((invItem) => {
          if (invItem.id === item.id) {
            return { ...invItem, quantity: invItem.quantity - 1 };
          }
          return invItem;
        })
        .filter((invItem) => invItem.quantity > 0);

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
        {activePet.is_sick ? (
          <>
            <img src="/images/germ.png" className="germ-image icon-overlay" />
            <img src="/images/germ2.png" className="germ-image icon-overlay2" />
          </>
        ) : null}

        <img
          src={activePet.image_source}
          alt={activePet.name}
          className="pet-image main-image"
        />
        <div className="status-container">
          <div className="status">
            <span>Hunger</span>
            <div className="status-bar">
              <div
                className="hunger-filled"
                style={{ width: `${activePet.hunger}%` }}
              ></div>
            </div>
          </div>

          <div className="status">
            <span>Happiness</span>
            <div className="status-bar">
              <div
                className="happiness-filled"
                style={{ width: `${activePet.fun}%` }}
              ></div>
            </div>
          </div>

          <div className="status">
            <span>Cleanliness</span>
            <div className="status-bar">
              <div
                className="cleanliness-filled"
                style={{ width: `${activePet.clean}%` }}
              ></div>
            </div>
          </div>

          <div className="status">
            <span>Lvl. 1</span>
            <div className="status-bar">
              <div
                className="level-filled"
                style={{ width: `${level}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="inventory-section">
        <h2>Inventory</h2>
        <div className="inventory-items">
          {inventory.map((item) =>
            Array.from({ length: item.quantity }).map((_, index) => (
              <div
                key={`${item.id}-${index}`}
                className="inventory-item"
                onClick={() => handleItemClick(item)}
              >
                <img src={item.image_source} />
                <div className="item-info">
                  <span>
                    {getEmoji(item.type)}
                    {item.type === 4 ? ` ${item.stat}%` : `+${item.stat}`}
                  </span>
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
