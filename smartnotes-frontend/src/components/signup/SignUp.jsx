import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp({ setShowForm }) {
  // console.log('setShowForm: ', setShowForm);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    notesPassword: "",
    confirmNotesPassword: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if notes passwords match
    if (formData.notesPassword !== formData.confirmNotesPassword) {
      alert("Notes password and confirmation do not match.");
      return;
    }

    try {
      // Sending the data to the backend
      const response = await fetch(
        "https://smartnotes-backend.vercel.app/user-api/users",
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
        // Navigate to login page after successful signup
        // navigate("/login");
        setShowForm("login");
        alert("Signup successful!");
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="w-96 mb-10">
      <div className="w-full mx-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <p className="text-center py-4 bg-[#41b3a2] text-2xl text-white font-semibold">
          Sign Up
        </p>
        <form className="p-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Enter your email"
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
          <div className="mb-4">
            <label
              htmlFor="notesPassword"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              Set Password For Notes:
            </label>
            <input
              type="password"
              id="notesPassword"
              value={formData.notesPassword}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Set a password for your notes"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmNotesPassword"
              className="block text-lg font-bold text-gray-700 mb-2"
            >
              Confirm Notes Password:
            </label>
            <input
              type="password"
              id="confirmNotesPassword"
              value={formData.confirmNotesPassword}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
              placeholder="Confirm your notes password"
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

export default SignUp;
