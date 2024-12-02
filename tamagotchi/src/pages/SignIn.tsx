
import React, { useState } from 'react';
import { hashutil } from '../hashutil/Hashutil.ts';
import "../css/SignUp.css";
import { API_BASE_URL } from '../config.tsx';
import { useUserContext } from '../context/UserContext';

function SignIn({ }) {

    const [password, setPassword] = useState(''); //When login -> set password / Not password in the database table
    const [username, setName] = useState('');
    const [isLogin, setLogin] = useState(false);
    const { setUser } = useUserContext();

    async function fetchUser() {
      try {
          const response = await fetch(`${API_BASE_URL}/api/user`);
          if (!response.ok) {
              throw new Error('Failed to fetch registers');
          }
          const data = await response.json();
          return data;
      } catch (error) {
          console.error("Error fetching regiater:", error);
           return []; 
      }
  }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {

      e.preventDefault();
      const fetchedUser = await fetchUser();
      console.log(fetchedUser);

      if (!Array.isArray(fetchedUser)) {
          alert("Cannot load users.");
          return;
      }

      // Check if email exists in the fetchedUsers 
      const user = fetchedUser.find(user => user.username === username);
      
        if (!user) {
            alert('Wrong User');
            return;
        }

      setName(user.username);

        const hashedPassword = hashutil(username, password); // hashing
        // Validate password
        if (user.password !== hashedPassword) {
            alert('Wrong password');
            return;
        }

        // Sign-In Successful
        setLogin(true);
        setUser(user);
        //showPage('home');
        // setProfileImage(user.image);
        alert("User Registered Successfully!");
    };

    const handleName = (e: { target: { value: any; }; }) => {
        setName(e.target.value); 
    };

    const handlePassWord = (e: { target: { value: any; }; }) => {
        setPassword(e.target.value); 
    };

    return (
        <div>
            <div id="SignIn">
                <div className="sign-container">
                    <h2>Sign In</h2>
                    <form className="sign-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">User Name</label>
                        <input type="username" id="username" onChange={handleName} value={username}/>

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={handlePassWord} value={password}/>

                        <div className="button-group">
                        <button type="submit">Sign in</button>
                        <button type="button"><a href="/signUp">Sign up</a></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
