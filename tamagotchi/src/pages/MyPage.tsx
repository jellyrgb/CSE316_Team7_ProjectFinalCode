import "../css/MyPage.css";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.tsx";

function MyPage() {
  const { user, pets, loading, setUser } = useUserContext();
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // Make it YYYY-MM-DD format
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "facility_reservation"); // Cloudinary upload preset

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/docfch5cp/image/upload`,
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;
      await axios.put(`${API_BASE_URL}/api/user/${user.id}/profile-image`, {
        profile_image: imageUrl,
      });
      
      setUser(prevUser => prevUser ? { ...prevUser, profile_image: imageUrl } : null);
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Failed to update profile image");
    } finally {
      setUploading(false);
      // setShowModal(false);
    }
  };

  return (
    <div className="container mt-4">
      <main>
        <div className="my-page fullscreen">
          <div className="profile-section">
            <img
              src={user.profile_image || "/images/user.png"}
              alt="Profile"
              className="profile-picture"
            />
            <div className="profile-info">
              <h2>{user.username}</h2>
              <p>Member since {formatDate(user.creation_date)}</p>
              <button className="edit-profile-button btn btn-primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </button>
            </div>
          </div>
          {/* Change Image Modal */}
          {showModal && (
            <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>

                  </button>
                </div>
                <div className="modal-body">
                  <input type="file" id="file-input" accept="image/*" style={{ display: "none" }}></input>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      New Image
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  {uploading && <div className="mt-2">Uploading...</div>}
                </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Save changes</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          )}
          <div className="records-section">
            <h3>Pets History</h3>
            <div className="pets-container">
              {pets.map((pet) => (
                <div key={pet.id} className="pet-card">
                  <img
                    src={pet.image_source}
                    alt={pet.name}
                    className="profile-pet-image"
                  />
                  <div className="pet-info">
                    <h4>{pet.name}</h4>
                    <p>Adopted on {formatDate(pet.adoption_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}

export default MyPage;
