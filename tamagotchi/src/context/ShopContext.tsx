import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.tsx";

interface Item {
  id: number;
  type: number;
  image_source: string;
  stat: number;
  buy_price: number;
  sell_price: number;
}

interface ShopContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const ShopContext = createContext<ShopContextType>({
  items: [],
  loading: true,
  error: null,
});

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the items from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/items`);
        setItems(response.data);
      } catch (err) {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <ShopContext.Provider value={{ items, loading, error }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShopContext = () => React.useContext(ShopContext);
