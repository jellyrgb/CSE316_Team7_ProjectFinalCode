import "../css/Shop.css";
import { useShopContext } from "../context/ShopContext";
import { useUserContext } from "../context/UserContext";

function Shop() {
  const { items, loading, error } = useShopContext();
  const { user } = useUserContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User data unavailable.</div>;
  }

  // TODO: 유저 잔고 업데이트 로직
  // TODO: 유형별로 아이템 나누기
  return (
    <div className="shop fullscreen">
      <div className="balance">
        <p>💰 {user.balance}G</p>
      </div>
      <div>
        {/* Food */}
        <h2>Food</h2>
        <div className="items">
          {items.map(item => (
            <div key={item.id} className="item">
              <img src={item.image_source} />
              <div className="item-info">
                <p>Stat: {item.stat}</p>
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
          {items.map(item => (
            <div key={item.id} className="item">
              <img src={item.image_source} />
              <div className="item-info">
                <p>Stat: {item.stat}</p>
                <p>Buy: {item.buy_price}G</p>
                <p>Sell: {item.sell_price}G</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clean and medicine */}
      <div>
        <h2>Miscellaneous</h2>
        <div className="items">
          {items.map(item => (
            <div key={item.id} className="item">
              <img src={item.image_source} />
              <div className="item-info">
                <p>Stat: {item.stat}</p>
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