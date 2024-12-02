
import React, { useState } from 'react';
import { hashutil } from '../hashutil/typescript/Hashutil.ts';
import "../css/SignUp.css";
import { API_BASE_URL } from '../config.tsx';

function SignUp({ }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value, // id를 기준으로 formData 업데이트
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(API_BASE_URL);



        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const hashedPassword = hashutil(formData.username, formData.password); // hashing
            console.log('Request Payload:', {
                username: formData.username,
                password: hashedPassword,
                profile_image: "http://res.cloudinary.com/dkeneeift/image/upload/v1730882083/user_gyjnlf.png",
                balance: 0
            });



            const response = await fetch(`${API_BASE_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: hashedPassword,
                    profile_image:"http://res.cloudinary.com/dkeneeift/image/upload/v1730882083/user_gyjnlf.png",
                    balance: 0
                })
            });

            const result = await response.json();

            if (response.ok) {
                //console.log('User registered successfully:', result.message);
                alert(result.message);
            } else {
                //console.error('Registration failed:', result.message);
                alert(result.message);
            }

        } catch (error) {
            //console.error('Error during registration:', error);
            alert('Failed to register. Please try again later.');
        }
    };

    return (
        
        <div>
            <div className="sign-container">
                <h2>Sign Up</h2>
                <form className="sign-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">User Name</label>
                    <input type="username" id="username" onChange={handleInputChange} value={formData.username}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handleInputChange} value={formData.password}/>

                    <label htmlFor="password">Password Check</label>
                    <input type="password" id="confirmPassword" onChange={handleInputChange} value={formData.confirmPassword}/>

                    <div className="button-group">
                    <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default SignUp;
