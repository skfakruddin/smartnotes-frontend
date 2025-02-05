import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const SearchModal = () => {
  const [actions, setActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // To navigate to note content

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://smartnotes-backend.vercel.app/user-api/users/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authorization failed or invalid token");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data to check structure
        if (Array.isArray(data)) {
          setActions(data);
        }
      })
      .catch((error) => console.error("Error fetching notes:", error.message));
  }, []);

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={buttonStyles}
        className="w-full text-black bg-green-400"
      >
        <img src={SearchBar} className="text-black" alt="" />
        Click to Search Notes here
      </button>

      {isOpen && (
        <div style={modalStyles}>
          <input
            type="text"
            placeholder="Search for notes or actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyles}
          />
          <div style={resultsContainerStyles}>
            {filteredActions.length > 0 ? (
              filteredActions.map((note) => (
                <div
                  key={note.noteId} // Use the correct key
                  style={resultItemStyles}
                  onClick={() => navigate(`/profile/notes/${note.noteId}`)} // Navigate using correct noteId
                >
                  {note.title}
                </div>
              ))
            ) : (
              <div style={resultItemStyles}>No results</div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={buttonStyles}
            className="bg-blue-600 text-white"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

// Updated styles
const buttonStyles = {
  padding: "10px 20px",

  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "400px",
  zIndex: 1000, // Added z-index for the modal
};

const searchInputStyles = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const resultsContainerStyles = {
  maxHeight: "200px",
  overflowY: "auto",
  scrollbarWidth: "none", // For Firefox
  msOverflowStyle: "none", // For Internet Explorer and Edge
};

const resultItemStyles = {
  padding: "10px",
  // Removed the border from the notes
  cursor: "pointer",
};

// Hide scrollbar for WebKit browsers (Chrome, Safari)
resultsContainerStyles["::-webkit-scrollbar"] = {
  display: "none",
};

export default SearchModal;
