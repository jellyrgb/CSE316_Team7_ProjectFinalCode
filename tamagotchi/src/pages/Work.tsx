import "../css/Work.css";
import { useEffect, useState } from 'react';
import { Tamagotchi,useUserContext } from "../context/UserContext";
import { useJobContext } from "../context/JobContext";
import { useShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config.tsx';
import axios from "axios";
import JobTimer from "./JobTimer";



function Work() {
  const { jobs } = useJobContext();
  const { items } = useShopContext();
  const { user, pets, loading, error, setUser,setPets } = useUserContext();
  const [activePet, setActivePet] = useState<Tamagotchi | null>();
  const [balance, setBalance] = useState(user?.balance);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [endWorking, setEndWorking] = useState(true);
  const [levelData, setLevelData] = useState(Number);

  const navigate = useNavigate();

  useEffect(() => {
    const activePet = pets.find((pet) => pet.is_active);
    setActivePet(activePet);

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
        // 사용자 작업 데이터 가져오기
        const { data } = await axios.get(`${API_BASE_URL}/api/user/${user.id}/jobs`);
        console.log(data);
        setSelectedJob(data[0]);
        if(data.length>0){
          if (data[0].time_elapsed >= data[0].duration) {
            console.log(data[0].id);
            setEndWorking(true); // 작업 완료 처리     
          }
          else{
          setEndWorking(false);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    fetchJob();
  }, [user, loading, navigate]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const pet = activePet;
    if (!pet) {
    return <div>No active pet found</div>;
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


  // function after finish working
  const handleJobCompletion = async (job:any) => {
    const randomItem = items[Math.floor(Math.random() * 12)];
    const isSick = Math.random() < 0.3; // 30% chance to get sick
    const newBalance = balance + job.reward;
    setBalance(newBalance); // Add gold
    await updateBalance(newBalance);
    await addItemToInventory(randomItem.id, 1);

    // Update or create level
  try {
    // Fetch current level
    let currentLevelResponse = await axios.get(`${API_BASE_URL}/api/user/${user.id}/tamagotchi/${activePet?.id}/level`);

    const currentLevel = currentLevelResponse.data.level; 
    const newLevel = Math.min(currentLevel + 30, 100); // Increase by 30, cap at 100

      await axios.put(`${API_BASE_URL}/api/user/${user.id}/tamagotchi/${activePet?.id}/level`, { level: newLevel });
      alert(`Your pet's level increased to ${newLevel}!`);
      setLevelData(newLevel);
    
  } catch (error) {
    console.error("Error updating or creating level:", error);
  }

    if (isSick) {
      await updateSick();
      alert("Youe pet got sick !! 🤒 Please threat your pet.");
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


  //Post job to API
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
    if(updatedPet.hunger<30 || updatedPet.hunger<30 || updatedPet.hunger<30){
      alert("Not Enough Status!!");
      return;
    }

    if(updatedPet.is_sick){
      alert("Your Pet is sick 🤒");
      return;
    }

    updatedPet.hunger = Math.max(updatedPet.hunger -30,0);
    updatedPet.clean = Math.max(updatedPet.clean - 30, 0);
    updatedPet.fun = Math.max(updatedPet.fun - 30, 0);
    setActivePet(updatedPet);

    // Update the pet status
    await axios.put(`${API_BASE_URL}/api/user/${pet.id}/statusChange`, updatedPet)
      .catch(error => console.error("Error updating pet status:", error));
      

    setSelectedJob(job); // 선택한 작업 설정
    await postJob(job);
    setEndWorking(false)

  };

  return (
    <div className="work-page fullscreen">
      <div className="work_Header">
        {endWorking ? <h1>Resting...</h1>:<h1>Your pet is Working...</h1>}
      </div>
        <div className="work-status-container">
          <div className="work-status">
            <span>Hunger</span>
            <div className="work-status-bar">
              <div className="hunger-filled" style={{ width: `${activePet?.hunger}%` }}></div>
            </div>
          </div>

          <div className="work-status">
            <span>Happiness</span>
            <div className="work-status-bar">
              <div className="happiness-filled" style={{ width: `${activePet?.fun}%` }}></div>
            </div>
          </div>

          <div className="work-status">
            <span>Cleanliness</span>
            <div className="work-status-bar">
              <div className="cleanliness-filled" style={{ width: `${activePet?.clean}%` }}></div>
            </div>
          </div>
        </div>

      <div className="jobs-container">
        {selectedJob ? (
          <div>
            {endWorking ? <button onClick={()=>handleJobCompletion(selectedJob)}>Get a reward!</button>:<p>Your pet is working now.</p>}
        </div>
      ) : (
        // 작업 목록 표시
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
        {endWorking ? <p>Choose where you want to work !</p>:<JobTimer job={selectedJob} />}
      </div>
    </div>
  );
}

export default Work;
