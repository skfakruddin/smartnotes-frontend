// Tags.jsx
import React, { useEffect, useState } from "react";
import TagsDropdown from "./TagsDropDown";  // Ensure the correct path

const Tags = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch notes from backend or use your existing state management
    const fetchNotes = async () => {
      try {
        const response = await getNotes();  // Fetch notes from backend
        setNotes(response.data);  // Adjust based on your response structure
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="tags-section">
      <h2 className="text-2xl font-bold mb-4">Tags</h2>
      <TagsDropdown  />
    </div>
  );
};

export default Tags;
