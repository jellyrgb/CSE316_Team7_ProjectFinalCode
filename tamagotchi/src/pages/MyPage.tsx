import React, { useState, useEffect } from "react";
import "../css/MyPage.css";

function MyPage() {
  // 프로필 데이터 이름/프로필 못바꾸게.
  const [profile, setProfile] = useState({
    name: "Alice",
  });

  // 히스토리 데이터 tamagochi table에서 불러오기.
  const [history, setHistory] = useState([
    { image: "", id: 1, tama_name: "first tama" },
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    { image: "",id: 2, tama_name: "sec tama"},
    

  ]);

  return (
    <div className="my-page">
      {/* 프로필 섹션 */}
      <div className="profile-section">
        <h2 className="profile-name">{profile.name}</h2>
      </div>

      {/* 히스토리 섹션 */}
      <div className="history-section">
        <h3>History</h3>
            <div className="tama-type">
              {history.map((tama) => (
                <div key={tama.id} className="tama">
                    <img src={tama.image} alt={"tama img"} className="tama-image" />
                    <p className="tama-name">{tama.tama_name}</p>
                </div>
                ))}
            </div>
      </div>
    </div>
  );
}

export default MyPage;
