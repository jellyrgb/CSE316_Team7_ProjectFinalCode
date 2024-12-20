import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config.tsx";

interface User {
  id: number;
  username: string;
  profile_image: string;
  balance: number;
  creation_date: string;
}

export interface Tamagotchi {
  id: number;
  name: string;
  image_source: string;
  hunger: number;
  clean: number;
  fun: number;
  is_sick: boolean;
  adoption_date: string;
  is_active: boolean;
  user_id: number;
  level?: number; // Level 추가
}

interface UserContextType {
  user: User | null;
  pets: Tamagotchi[];
  loading: boolean;
  error: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setPets: (pets: Tamagotchi[]) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  pets: [],
  loading: true,
  error: null,
  setUser: () => {},
  setPets: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Tamagotchi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Check if the user is logged in
      const userToken = Cookies.get("userToken");
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const response = await axios.get(
          `${API_BASE_URL}/api/user/${userToken}`
        );
        setUser(response.data);

        // Fetch pets data
        const petsResponse = await axios.get(
          `${API_BASE_URL}/api/user/${userToken}/tamagotchis`
        );
        const petsWithLevels = await Promise.all(
          petsResponse.data.map(async (pet: Tamagotchi) => {
            try {
              const levelResponse = await axios.get(
                `${API_BASE_URL}/api/tamagotchi/${pet.id}/level`
              );
              return { ...pet, level: levelResponse.data.level }; // Add level to each pet
            } catch (error) {
              console.error(
                `Error fetching level for Tamagotchi ${pet.id}:`,
                error
              );
              return { ...pet, level: null }; // Default level to null on error
            }
          })
        );
        setPets(petsWithLevels);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, pets, loading, error, setUser, setPets }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);
