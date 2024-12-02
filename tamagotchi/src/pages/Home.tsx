import { useEffect, useState } from 'react';
import homeImage from '../Images/cat.png';
import { useUserContext } from '../context/UserContext';
import { API_BASE_URL } from '../config.tsx';
import '../css/Home.css'; 
import axios from 'axios';

function Home() {
    const { user, setUser } = useUserContext();
    const [balance, setBalance] = useState(user?.balance);

    useEffect(() => {
        if (user) {
            setBalance(user.balance);
        }
    }, [user]);

    const getRandomIncrement = (): number => {
        return Math.floor(Math.random() * 3) + 1;
    };

    async function EarnBtn(balance: number): Promise<void> {
         const newBalance = balance + getRandomIncrement();
         setBalance(newBalance);
         await updateBalance(newBalance);
    }

    const updateBalance = async (newBalance: number) => {
    if (user) {
      try {
        await axios.put(`${API_BASE_URL}/api/user/${user.id}/balance`, { balance: newBalance });
        setUser({ ...user, balance: newBalance });
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

    return (
        <div>
            <div style={{ marginLeft: '150px' }}>
                <h1>Welcome !!</h1>

            </div>
            
            <div className="fullscreen-home">
                {user ? (
                    <div className='btnAndBalance'>
                        <h2 className='Homebalance'>💰 {balance}G</h2>
                        <button onClick={() => EarnBtn(user.balance)}>Earn Gold</button>
                    </div>
                    ) : (
                    <p>You can earn gold from here after sign-In</p>
                )}
                <img src={homeImage} alt="Cat" />
            </div>
        </div>
    );
}

export default Home;