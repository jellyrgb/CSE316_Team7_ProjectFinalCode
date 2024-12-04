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
  const { user, loading, setUser } = useUserContext();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const navigate = useNavigate();
  const [isSellMode, setIsSellMode] = useState(false);
  const [activePet, setActivePet] = useState<Tamagotchi | null | undefined>(
    undefined
  );
  const [level, setLevel] = useState(activePet?.level);
  const [updatedSource, setUpdatedSource] = useState<string>("");

  useEffect(() => {
    // Fetch active Tamagotchi
    const fetchActivePet = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/${user.id}/active-pet`
          );
          setActivePet(response.data || null);
        } catch (error) {
          console.error("Error fetching active pet:", error);
          setActivePet(null);
        }
      } else {
        setActivePet(null);
      }
    };

    // Fetch user inventory
    const fetchInventory = async () => {
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

    // Fetch Tamagotchi's level
    const fetchLevel = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`
        );
        setLevel(data.level);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    if (user) {
      fetchActivePet();
      fetchInventory();
      fetchLevel();
    } else if (!loading) {
      navigate("/signIn");
    }
  }, [user, loading, navigate, level]);

  useEffect(() => {
    // Redirect to adopt page if no active pet
    if (activePet === null) {
      const timer = setTimeout(() => {
        navigate("/adopt");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activePet, navigate]);

  if (loading || activePet === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (activePet === null) {
    return (
      <div>
        No active Tamagotchi found. Please adopt a new one first.
        <br />
        Redirecting to adopt page in 3 seconds...
      </div>
    );
  }

  // Update active status to false
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

      const updateImageSource = (step:number) => {
      const updated = activePet.image_source.replace(/(\d+)/, `${step}`);
      setUpdatedSource(updated);
      return updated;
    };

  // Handle item click
  const handleItemClick = async (item: InventoryItem) => {
    // When in sell mode, sell the item
    if (isSellMode) {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/user/${user.id}/inventory/sell`, {
          itemId: item.id,
        });

        const updatedBalance = response.data.balance;
        setUser((prevUser) => prevUser && { ...prevUser, balance: updatedBalance });
        
        // Update inventory after selling
        setInventory((prevInventory) =>
          prevInventory
            .map((invItem) => {
              if (invItem.id === item.id) {
                return { ...invItem, quantity: invItem.quantity - 1 };
              }
              return invItem;
            })
            .filter((invItem) => invItem.quantity > 0)
        );

        alert(
          `Sold ${item.type === 4 ? "Medicine" : "Item"} for ${
            item.sell_price
          } golds!`
        );
      } catch (error) {
        console.error("Error selling item:", error);
        alert("Failed to sell item.");
      }
      return;
    }

    // When in feed mode, feed the item
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
          // Cure the pet based on the stat (percentage)
          const cureChance = Math.random() * 100;
          if (cureChance <= item.stat) {
            updatedPet.is_sick = false;
            alert("Treatment successful!");
          } else {
            alert("Treatment failed!");
            return;
          }
        } else {
          alert("Your pet is not sick!");
          return;
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
      const newLevel = Math.min(currentLevel + 5);

      let tamaImg = '';
      if(30 <= newLevel && newLevel < 60){
        tamaImg = updateImageSource(2);
        await axios.put(`${API_BASE_URL}/api/tamagotchi/changeImg`, { tamaId: activePet.id, image_source: tamaImg });
      }
      else if(60 <= newLevel){
        tamaImg = updateImageSource(3);
        await axios.put(`${API_BASE_URL}/api/tamagotchi/changeImg`, { tamaId: activePet.id, image_source: tamaImg });
      }
      else if (newLevel >= 100) {
        alert(
          "Congratulations, your Tamagotchi has reached the maximum level!"
        );
        await updateActive();
        return navigate("/");
      }

      await axios.put(
        `${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`,
        { level: newLevel }
      );
      setLevel(newLevel);
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
            <span>Lvl. {(level ?? 0) / 10}</span>
            <div className="status-bar">
              <div className="exp-filled" style={{ width: `${level}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="inventory-section">
        <h2>Inventory</h2>
        <div className="inventory-header-section">
          <button
            className="toggle-mode-button btn btn-outline-primary"
            onClick={() => setIsSellMode((prev) => !prev)}
          >
            {isSellMode ? "Switch to Feed Mode" : "Switch to Sell Mode"}
          </button>
          <span className="my-tama-balance">💰 {user.balance}G</span>
        </div>
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