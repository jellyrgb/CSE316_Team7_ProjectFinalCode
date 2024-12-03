import { useEffect, useState } from 'react';
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
        <div className="fullscreen home-page">
            <img src="/logos/tamagotchi_logo.webp" alt="main_logo" className="main-logo" />
            
            <div className="home-page-content">
                {user ? (
                    <div>
                        <div>
                            <h1 className="home-welcome">Welcome, {user.username}!</h1>
                            <ol>
                                <li className="home-explanation">Go to <a href="/adopt">Adopt</a> page to get a new Tamagotchi.</li>
                                <li className="home-explanation">Feed and play with your Tamagotchi in <a href="/tamagotchi">My Pet</a> page.</li>
                                <li className="home-explanation">Buy items from <a href="/shop">Shop</a> page for your Tamagotchi.</li>
                                <li className="home-explanation">Work part time in <a href="/work">Work</a> page to earn gold.</li>
                                <li className="home-explanation">Check out <a href="/test">Test Page</a> to test the application features.</li>
                            </ol>
                        </div>
                        <div className="button-and-balance">
                            <h2 className="home-balance">💰 {balance}G</h2>
                            <button className="earn-gold-button" onClick={() => EarnBtn(user.balance)}>Earn Gold</button>
                        </div>
                    </div>
                    ) : (
                    <p className="home-p">You can earn gold from here after sign-In</p>
                )}
                <img className="home-cat" src="/images/cat.png" alt="Cat" />
            </div>
        </div>
    );
}

export default Home;