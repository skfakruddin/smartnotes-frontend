import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function NoteDetail() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [tags, setTags] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isNewNote, setIsNewNote] = useState(!noteId);
  const [showTagOptions, setShowTagOptions] = useState(false);

  const predefinedTags = ["Personal", "Work"];

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const response = await fetch(
            `https://smartnotes-backend.vercel.app/user-api/users/notes/${noteId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();

          if (data.noteId === noteId) {
            setNote(data);
            setNoteTitle(data.title || "");
            setNoteText(data.content || "");
            setTags(data.tags || []);
            setIsFavourite(data.isFavorite || false);
            setIsLocked(data.isLocked || false);
          } else {
            console.error("Note ID mismatch");
          }
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      };

      fetchNote();
    }
  }, [noteId]);

  useEffect(() => {
    const autoSaveNote = debounce(async () => {
      try {
        await fetch(
          `https://smartnotes-backend.vercel.app/user-api/users/notes/${noteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: noteTitle,
              content: noteText,
              tags,
              isFavorite: isFavourite,
              isLocked,
            }),
          }
        );
        console.log("Note auto-saved successfully!");
      } catch (error) {
        console.error("Error auto-saving note:", error);
      }
    }, 1000); // Delay of 1 second

    autoSaveNote();
  }, [noteText, noteTitle, tags, isFavourite, isLocked, noteId]);

  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleAddTag = () => {
    setShowTagOptions(!showTagOptions);
  };

  const handleSelectTag = (tag) => {
    setTags([tag]); // Ensure only one tag is assigned
    setShowTagOptions(false);
  };

  const handleRemoveTag = () => {
    setTags([]); // Remove current tag
  };

  const handleToggleFavourite = async () => {
    try {
      await fetch(
        `https://smartnotes-backend.vercel.app/user-api/users/notes/favorite/${noteId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFavourite(!isFavourite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleRemoveFromFavourites = async () => {
    if (
      window.confirm(
        "Are you sure you want to remove this note from favourites?"
      )
    ) {
      try {
        await fetch(
          `https://smartnotes-backend.vercel.app/user-api/users/notes/unfavorite/${noteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavourite(false);
        alert("Note removed from favourites.");
      } catch (error) {
        console.error("Error removing note from favourites:", error);
      }
    }
  };

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
  };

  const handleDeleteNote = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to move this note to trash?"
    );
    if (confirmDelete) {
      try {
        await fetch(
          `https://smartnotes-backend.vercel.app/user-api/users/notes/delete/${noteId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Note moved to trash.");
        navigate("/notes");
      } catch (error) {
        console.error("Error moving note to trash:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={noteTitle}
        onChange={handleTitleChange}
        placeholder="Enter note title"
        className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring focus:border-[#41b3a2]"
      />
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleAddTag}
          className="px-3 py-1 bg-[#41b3a2] text-white font-semibold rounded hover:bg-[#33a89f] transition duration-300"
        >
          Add Tag
        </button>
        {showTagOptions && (
          <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-2">
            {predefinedTags.map((tag) => (
              <div
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        {isFavourite ? (
          <button
            onClick={handleRemoveFromFavourites}
            className="px-3 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition duration-300"
          >
            Remove from Favourites
          </button>
        ) : (
          <button
            onClick={handleToggleFavourite}
            className="px-3 py-1 bg-[#41b3a2] text-white font-semibold rounded hover:bg-[#33a89f] transition duration-300"
          >
            Add to Favourites
          </button>
        )}
        <button
          onClick={handleToggleLock}
          className={`px-3 py-1 ${
            isLocked ? "bg-red-500" : "bg-[#41b3a2]"
          } text-white font-semibold rounded hover:bg-[#33a89f] transition duration-300`}
        >
          {isLocked ? "Unlock Note" : "Lock Note"}
        </button>
        {!isNewNote && (
          <button
            onClick={handleDeleteNote}
            className="px-3 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition duration-300"
          >
            Delete Note
          </button>
        )}
      </div>
      <textarea
        value={noteText}
        onChange={handleTextChange}
        className="w-full h-96 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#41b3a2] focus:border-transparent"
        placeholder="Enter your note content here..."
        disabled={isLocked}
      />
      <div className="mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 text-md bg-gray-200 rounded-full mr-2"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-red-700 text-2xl pb-0.5"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default NoteDetail;
