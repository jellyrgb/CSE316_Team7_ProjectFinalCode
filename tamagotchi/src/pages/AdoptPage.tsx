import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config.tsx';
import "../css/AdoptPage.css";
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdoptPage() {
    type Tamagotchi = {
        id: number;
        image_source: string;
        description: string;
    };

    const [tamagotchiList, setTamagotchiList] = useState<Tamagotchi[]>([]);
    const [selectedTamagotchi, setSelectedTamagotchi] = useState<number | null>(null);
    const [tamagotchiName, setTamagotchiName] = useState("");
    const [hasActiveTamagotchi, setHasActiveTamagotchi] = useState(false);

    const { user, loading } = useUserContext();
    const navigate = useNavigate();

    // Fetch Tamagotchi templates from the server
    useEffect(() => {
        if (!user && !loading) {
            navigate("/signIn");
        }
        async function fetchTamagotchiTemplates() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tamagotchi_templates`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Tamagotchi templates');
                }
                const data = await response.json();
                setTamagotchiList(data);
            } catch (error) {
                console.error("Error fetching templates:", error);
            }
        }

        const checkActiveTamagotchi = async () => {
            if (user) {
              try {
                const response = await axios.get(`${API_BASE_URL}/api/user/${user.id}/active-tamagotchi`);
                setHasActiveTamagotchi(response.data.hasActiveTamagotchi);
              } catch (error) {
                console.error('Error checking active tamagotchi:', error);
              }
            }
          };

        fetchTamagotchiTemplates();
        checkActiveTamagotchi();
    }, [user, loading, navigate]);

    // Handle Tamagotchi selection
    const handleSelect = (id: number) => {
        setSelectedTamagotchi(id);
    };

    // Handle adopt action
    const handleAdopt = async () => {
        if (hasActiveTamagotchi) {
            alert("You already have an active Tamagotchi!");
            return;
        }
        if (!selectedTamagotchi) {
            alert("Please select a Tamagotchi to adopt.");
            return;
        }
        const selectedTemplate = tamagotchiList.find((t) => t.id === selectedTamagotchi);
        if(!selectedTemplate || !user){
            return;
        }
        await addTamagotchi(tamagotchiName,selectedTemplate, user?.id)
    };

    const addTamagotchi = async (name: string, tama: Tamagotchi, userId: number) => {
        console.log("ID: "+ userId);
        const adoptionDate = new Date().toISOString(); 
        const formattedAdoptionDate = adoptionDate.toString().split('T')[0]; // 날짜가 잘못됐는데?
        if (userId) {
            try {
            await axios.post(`${API_BASE_URL}/api/user/${userId}/tamagotchis`, {
                name,
                image_source: tama.image_source,
                hunger: 70,         
                clean: 70,          
                fun: 70,             
                is_sick: false,      
                adoption_date: formattedAdoptionDate,
                is_active: true,   
                user_id: userId,    
            });
            } catch (error) {
            console.error("Error adding Tamagotchi:", error);
            }
        } else {
            console.error("User ID is required to add Tamagotchi.");
        }
        alert("You Successfully Adopted!!");
        return navigate("/");
    };


    return (
        <div className="adopt-page">
            <h2>Adopt a Tamagotchi</h2>
            <div className="tamagotchi-list">
                {tamagotchiList.map((tamagotchi) => (
                    <div key={tamagotchi.id} className={`tamagotchi-card ${selectedTamagotchi === tamagotchi.id ? 'selected' : ''}`}
                        onClick={() => handleSelect(tamagotchi.id)}
                    >
                        <img src={tamagotchi.image_source} alt={tamagotchi.description} />
                        <p>{tamagotchi.description}</p>
                    </div>
                ))}
            </div>
            <div className="name-input">
                <label htmlFor="tamagotchi-name">Enter Your Pet Name:</label>
                <input id="tamagotchi-name" type="text" value={tamagotchiName} onChange={(e) => setTamagotchiName(e.target.value)} placeholder="Enter a name"/>
            </div>
            <button className="adopt-page-button" onClick={handleAdopt} disabled={!selectedTamagotchi || !tamagotchiName}>
                Adopt Tamagotchi
            </button>
        </div>
    );
}

export default AdoptPage;
