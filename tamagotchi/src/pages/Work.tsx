import "../css/Work.css";
import { useEffect, useState } from 'react';
import { Tamagotchi,useUserContext } from "../context/UserContext";
import { useJobContext } from "../context/JobContext";
import { useShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config.tsx';
import axios from "axios";
import JobTimer from "../components/JobTimer.tsx";

function Work() {
  const { jobs } = useJobContext();
  const { items } = useShopContext();
  const { user, loading, setUser } = useUserContext();
  const [activePet, setActivePet] = useState<Tamagotchi | null>();
  const [activePetLoading, setActivePetLoading] = useState(true);
  const [balance, setBalance] = useState(user?.balance);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [endWorking, setEndWorking] = useState(true);
  const [level, setLevel] = useState(activePet?.level);

  const navigate = useNavigate();
  jobs.sort((a, b) => a.duration - b.duration);

  useEffect(() => {
    const fetchActivePet = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/${user.id}/active-pet`
          );
          setActivePet(response.data);
        } catch (error) {
          console.error("Error fetching active pet:", error);
        } finally {
          setActivePetLoading(false);
        }
      } else {
        setActivePetLoading(false); 
      }
    };

    if (!user && !loading) {
      navigate("/signIn");
    }

    if (user) {
      setBalance(user.balance);
    }

    if(!user){
      return;
    }
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/user/${user.id}/jobs`);
        setSelectedJob(data[0]);
        if (data.length > 0) {
          if (data[0].time_elapsed >= data[0].duration) {
            setEndWorking(true);  
          }
          else {
          setEndWorking(false);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    const fetchLevel = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`);
        setLevel(data.level);
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };
    fetchActivePet();
    fetchLevel();
    fetchJob();
  }, [user, loading, navigate, level]);

  if (loading || activePetLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const pet = activePet;
  if (!pet) {
    setTimeout(() => {
      navigate("/adopt");
    }, 3000);
    return <div>No active Tamagotchi found. Please adopt a new one first.<br></br>Redirecting to adopt page in 3 seconds...</div>;  
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

  const addItemToInventory = async (itemId: number, quantity: number) => {
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/api/user/${user.id}/inventory`, { itemId, quantity });
      } catch (error) {
        console.error("Error adding item to inventory:", error);
      }
    }
  };

  const updateSick = async () => {
    if (activePet) {
      try {
        await axios.put(`${API_BASE_URL}/api/user/${user.id}/is_sick`, { is_sick: true });
        setActivePet({ ...activePet, is_sick: true });
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  const updateActive = async () => {
    if (activePet) {
      try {
        await axios.put(`${API_BASE_URL}/api/user/${user.id}/activeChange`, { is_active: false });
        setActivePet({ ...activePet, is_active: false });
      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  // function after finish working
  const handleJobCompletion = async (job : any) => {
    // Update or create level
    try {
      // Fetch current level
      let currentLevelResponse = await axios.get(`${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`);
      const currentLevel = currentLevelResponse.data.level; 
      const newLevel = Math.min(currentLevel + job.duration);
      console.log(newLevel);
      if (newLevel >= 100) {
        try {
          await axios.delete(`${API_BASE_URL}/api/user/${user.id}/jobs`);
        } catch (error) {
          console.error("Error deleting work:", error);
        }
        setSelectedJob(null);
        setEndWorking(true);
        await updateActive();
        return navigate("/");
      }
      else{
        await axios.put(`${API_BASE_URL}/api/tamagotchi/${activePet?.id}/level`, { level: newLevel });
        setLevel(newLevel);
      }
    } catch (error) {
      console.error("Error updating or creating level:", error);
    }
    
    const randomItem = items[Math.floor(Math.random() * 12)];
    const isSick = Math.random() < 0.3; // 30% chance to get sick
    const newBalance = balance + job.reward;
    setBalance(newBalance); // Add gold
    await updateBalance(newBalance);
    await addItemToInventory(randomItem.id, 1);

    if (isSick) {
      await updateSick();
      alert(`You earned ${job.reward} gold and found a random item!`);
      alert("Your pet got sick! Please treat your pet.");
    } else {
      alert(`You earned ${job.reward} gold and found a random item!`);
    }

    try {
        await axios.delete(`${API_BASE_URL}/api/user/${user.id}/jobs`);
      } catch (error) {
        console.error("Error deleting work:", error);
    }
    setSelectedJob(null);
    setEndWorking(true);

    navigate("/work");
  };


  // Post job to API
  const postJob = async (job:any) => {
    if (activePet) {
      try {
        await axios.post(`${API_BASE_URL}/api/user/${user.id}/jobs`, {user_id:user.id, job_name:job.job_name, duration:job.duration, reward:job.reward });
        
      } catch (error) {
        console.error("Error posting jobs:", error);
      }
    }
  };

  const handleJobStart = async (job: any) => {
    let updatedPet = { ...pet };
    if (updatedPet.hunger < 50) {
      alert("Not enough hunger!");
      return;
    }
    if (updatedPet.clean < 40) {
      alert("Not enough cleanliness!");
      return;
    }
    if (updatedPet.fun < 60) {
      alert("Not enough happiness!");
      return;
    }

    if(updatedPet.is_sick){
      alert("Your pet is sick! Please treat your pet first.");
      return;
    }

    updatedPet.hunger = Math.max(updatedPet.hunger - 50,0);
    updatedPet.clean = Math.max(updatedPet.clean - 40, 0);
    updatedPet.fun = Math.max(updatedPet.fun - 60, 0);
    setActivePet(updatedPet);

    // Update the pet status
    await axios.put(`${API_BASE_URL}/api/user/${pet.id}/statusChange`, updatedPet)
      .catch(error => console.error("Error updating pet status:", error));
      
    setSelectedJob(job);
    await postJob(job);
    setEndWorking(false)
  };

  return (
    <div className="work-page fullscreen">
      <div className="work-header">
        {endWorking ? <h2>Your pet is resting...</h2>:<h2>Your pet is working...</h2>}
      </div>
        <div className="work-status-container">
          <div className="work-status">
            <span>Hunger</span>
            <div className="work-status-bar">
              <div className="tooltip-hunger">{activePet?.hunger}/100</div>
              <div className="hunger-filled" style={{ width: `${activePet?.hunger}%` }}></div>
            </div>
          </div>

          <div className="work-status">
            <span>Happiness</span>
            <div className="work-status-bar">
            <div className="tooltip-fun">{activePet?.fun}/100</div>
              <div className="happiness-filled" style={{ width: `${activePet?.fun}%` }}></div>
            </div>
          </div>

          <div className="work-status">
            <span>Cleanliness</span>
            <div className="work-status-bar">
            <div className="tooltip-clean">{activePet?.clean}/100</div>
              <div className="cleanliness-filled" style={{ width: `${activePet?.clean}%` }}></div>
            </div>
          </div>

          <div className="work-status">
            <span>Lvl.</span>
            <div className="work-status-bar">
            <div className="tooltip-exp">{level}/100</div>
              <div className="exp-filled" style={{ width: `${level}%` }}></div>
            </div>
          </div>
        </div>

      <div className="jobs-container">
        {selectedJob ? (
          <div>
            {endWorking ? <button className="claim-reward-button btn btn-outline-success" onClick={()=>handleJobCompletion(selectedJob)}>Claim the reward</button>:<p>Your pet is working now.</p>}
        </div>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => handleJobStart(job)}
          >
            <h3>{job.job_name}</h3>
            <p>Duration: {job.duration} seconds</p>
            <p>Reward: {job.reward} G</p>
          </div>
        ))
      )}
      </div>

      <div className="earned-item">
        {endWorking ? <p>Choose a workplace.</p>:<JobTimer job={selectedJob} />}
      </div>
    </div>
  );
}

export default Work;
