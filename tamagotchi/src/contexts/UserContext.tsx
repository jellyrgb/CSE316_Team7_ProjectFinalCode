import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  profile_image: string;
  balance: number;
  creation_date: string;
}

interface Tamagotchi {
  id: number;
  name: string;
  image_source: string;
  hunger: number;
  clean: number;
  fun: number;
  is_sick: boolean;
  adoption_date: string;
}

interface UserContextType {
  user: User | null;
  pets: Tamagotchi[];
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  pets: [],
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Tamagotchi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5000/api/user/1');
        setUser(userResponse.data);

        const petsResponse = await axios.get(`http://localhost:5000/api/user/${userResponse.data.id}/tamagotchis`);
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
    <UserContext.Provider value={{ user, pets, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);