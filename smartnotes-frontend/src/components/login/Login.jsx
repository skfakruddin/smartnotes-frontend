import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Sending the data to the backend
      const response = await fetch(
        "https://smartnotes-backend.vercel.app/user-api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Handling the response
      const data = await response.json();

      if (response.ok) {
        // Save token and username in localStorage upon successful login
        localStorage.setItem("token", data.token); // Store the token
        localStorage.setItem("username", data.username); // Ensure `data.username` is correct
        navigate("/profile"); // Navigate to the profile page
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="w-96 mb-10 pt-12">
      <div className="w-full mx-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <p className="text-center py-4 bg-[#41b3a2] text-2xl text-white font-semibold">
          Login
        </p>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              UserName:
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#41b3a2] text-white font-semibold rounded-md shadow-md hover:bg-[#33a89f] transition duration-300"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
