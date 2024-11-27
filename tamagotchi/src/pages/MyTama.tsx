import "../css/MyTama.css";
import React, { useState } from "react";


function MyTama() {

  const [status, setStatus] = useState({
    hunger: 50,
    happiness: 80,
    cleanliness: 60,
  });
    const [inventory, setInventory] = useState([
    { id: 1, name: "Bone", icon: "🦴" },
    { id: 2, name: "Food", icon: "🍖" },
    { id: 3, name: "Toy", icon: "🧸" },

  ]);

  // const [inventory, setInventory] = useState([
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  //   { id: 1, name: "Bone", icon: "🦴" },
  //   { id: 2, name: "Food", icon: "🍖" },
  //   { id: 3, name: "Toy", icon: "🧸" },
  // ]);

  const [user, setuser]=useState({
    gold: 300
  })


  return (
    <div className="my-pet-page">
      <main className="main-content">
        <div className="pet-Inventory">
          {/* Pet Display */}
          <div className="pet-display">
            <span role="img" aria-label="pet">🐶</span>
          </div>

          {/* Inventory */}
          <div className="inventory">
            <h2>Inventory</h2>
            <div className="inventory-items">
              {inventory.map((item) => (
                <div key={item.id} className="inventory-item">
                  <span role="img" aria-label={item.name}>
                    {item.icon}
                  </span>
                </div>
              ))}
            </div>
            <div className="currency">{`${user.gold}`} G</div>
          </div>
        </div>

        {/* Status Bars */}
        <div className="status-container">
          <div className="status">
            <span>Hunger</span>
            <div className="status-bar">
              <div className="filled" style={{ width: `${status.hunger}%` }}></div>
            </div>
          </div>

          <div className="status">
            <span>Happiness</span>
            <div className="status-bar">
              <div className="filled" style={{ width: `${status.happiness}%` }}></div>
            </div>
          </div>

          <div className="status">
            <span>Cleanliness</span>
            <div className="status-bar">
              <div className="filled" style={{ width: `${status.cleanliness}%` }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyTama;