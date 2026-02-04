import React, { useEffect, useState } from "react";
import TagsDropdown from "./TagsDropDown";  
const Tags = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();  
        setNotes(response.data);  
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
