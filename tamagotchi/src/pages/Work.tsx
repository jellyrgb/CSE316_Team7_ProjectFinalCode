import "../css/Work.css";
import { useEffect } from 'react';
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Work() {
  const { user, pets, loading, error } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="work-page fullscreen">
      <h1>Work</h1>
    </div>
  );
}

export default Work;
