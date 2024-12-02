import "../css/MyPage.css";
import { useUserContext } from "../context/UserContext";

function MyPage() {
  const { user, pets, loading, error } = useUserContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User data unavailable.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Make it YYYY-MM-DD format
  };

  return (
    <div className="my-page fullscreen">
      <div className="profile-section">
        <img
          src={user.profile_image || "https://via.placeholder.com/200"}
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>Member since {formatDate(user.creation_date)}</p>
        </div>
      </div>
      <div className="records-section">
        <h3>Pets History</h3>
        <div className="pets-container">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image_source} alt={pet.name} className="profile-pet-image" />
              <div className="pet-info">
                <h4>{pet.name}</h4>
                <p>Adopted on {formatDate(pet.adoption_date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
