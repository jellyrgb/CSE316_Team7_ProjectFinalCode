import React, { useState } from "react";
import "../css/Shop.css";
import appleImage from "../Images/apple.png";

function Shop() {
    // tbale을 toys, food, clean따로 만드는게 편할지도? 
    // 아니면 type value하나 만들어서 toy,food,clean저장. type=food. type=toys. type=clean
  const categories = [
    { id: 1, name: "Toys" },
    { id: 2, name: "Food" },
    { id: 3, name: "Clean" },
  ];

  const items = [
    { id: 1, name: "Apple", image: appleImage, price: 10 },
    { id: 1, name: "Apple", image: appleImage, price: 10 },
    { id: 1, name: "Apple", image: appleImage, price: 10 },
    { id: 1, name: "Apple", image: appleImage, price: 10 }
  ]; // 임시. 

  const [gold, setGold] = useState(320); // 임시. 

  const handlePurchase = (price: number, itemName: any) => {
    if (gold >= price) {
      setGold(gold - price); // Deduct the item's price from the user's gold balance
      alert(`You purchased ${itemName} for ${price} gold!
             Current gold: ${gold-price}`);
    } else {
      alert("You don't have enough gold to buy this item!");
    }
  };

  return (
    <div className="shop-page">

      <main className="Shop-content">
        {categories.map((category) => (
          <section key={category.id} className="shop-category">
            <div className="category-header">
              <h3>{category.name}</h3>
            </div>

            <div className="category-items">
              {items.map((item) => (
                <div key={item.id} className="item" onClick={() => handlePurchase(item.price, item.name)}>
                    <img src={item.image} alt={item.name} className="item-image" />
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price} G</p>
                </div>
                ))}
            </div>

          </section>
        ))}
      </main>
    </div>
  );
}

export default Shop;
