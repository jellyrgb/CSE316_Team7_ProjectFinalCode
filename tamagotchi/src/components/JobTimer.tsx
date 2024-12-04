import React, { useState, useEffect } from "react";

interface JobTimerProps {
  job: {
    name: string;
    duration: number;
    time_elapsed: number;
  };
  setEndWorking: React.Dispatch<React.SetStateAction<boolean>>;
}

const JobTimer: React.FC<JobTimerProps> = ({ job, setEndWorking }) => {
  // Remaining time in seconds
  const [remainingTime, setRemainingTime] = useState(
    job.duration - (job.time_elapsed || 0)
  );

  useEffect(() => {
    // Update the remaining time every second
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    if (remainingTime <= 0) {
      clearInterval(interval);
      setEndWorking(true);
    }

    return () => clearInterval(interval);
  }, [remainingTime]);

  // Format the time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <p>Remaining Time: {formatTime(remainingTime)}</p>
    </div>
  );
};

export default JobTimer;
