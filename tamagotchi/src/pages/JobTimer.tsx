import React, { useState, useEffect } from "react";

interface JobTimerProps {
  job: {
    name: string;
    duration: number; // 소요 시간 (분)
    time_elapsed: number;
  };
}

const JobTimer: React.FC<JobTimerProps> = ({ job }) => {
  const [remainingTime, setRemainingTime] = useState(job.duration - (job.time_elapsed||0)); // 초 단위로 변환

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    // 타이머가 0이 되면 interval 정리
    if (remainingTime <= 0) {
      clearInterval(interval); 
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, [remainingTime]);

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
