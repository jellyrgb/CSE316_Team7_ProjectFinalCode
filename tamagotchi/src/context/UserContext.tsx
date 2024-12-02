import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config.tsx';

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
}

interface UserContextType {
  user: User | null;
  pets: Tamagotchi[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  pets: [],
  loading: true,
  error: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Tamagotchi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

        console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/${user.id}`);
        setUser(userResponse.data);

        const petsResponse = await axios.get(`${API_BASE_URL}/api/user/${userResponse.data.id}/tamagotchis`);
        setPets(petsResponse.data);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, pets, loading, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);