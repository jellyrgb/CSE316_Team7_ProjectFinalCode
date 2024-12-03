import React, { useState, useEffect } from "react";

// JobTimer 컴포넌트에 전달할 props 타입 정의
interface JobTimerProps {
  job: {
    name: string;
    duration: number;
  };
  onComplete: () => void;
}

const JobTimer: React.FC<JobTimerProps> = ({ job, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState(job.duration ); 

 useEffect(() => {
    console.log(remainingTime);
  if (remainingTime > 0) {
    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0)); // 0 이하로 내려가지 않음
    }, 1000);

    return () => clearInterval(interval); // 클린업
  } else if (remainingTime === 0) {
    onComplete(); // 종료 작업 한 번만 실행
  }
}, [remainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Job: {job.name}</h3>
      <p>Remaining Time: {formatTime(remainingTime)}</p>
    </div>
  );
};

export default JobTimer;
