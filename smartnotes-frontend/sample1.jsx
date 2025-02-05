import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// Quill modules and formats
const modules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"], // Added image button
      [{ color: [] }, { background: [] }], // Added background color
      ["clean"],
    ],
    handlers: {
      image: handleImageUpload, // Custom handler for image upload
    },
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
];

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    if (!isLocked) {
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
    }
  }, [noteText, noteTitle, tags, isFavourite, isLocked, noteId]);

  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value);
  };

  const handleTextChange = (content) => {
    setNoteText(content);
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
    if (isLocked) {
      setShowPasswordModal(true);
    } else {
      setIsLocked(true);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const userResponse = await fetch(
        "https://smartnotes-backend.vercel.app/user-api/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userData = await userResponse.json();

      if (!userData.success) {
        setPasswordError("Failed to fetch user data.");
        return;
      }

      const isPasswordMatch = await fetch(
        "https://smartnotes-backend.vercel.app/user-api/users/notes/verify-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: enteredPassword,
            notesPassword: userData.notesPassword,
          }),
        }
      );
      const result = await isPasswordMatch.json();

      if (result.success) {
        setIsLocked(false);
        setShowPasswordModal(false);
        setPasswordError("");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setPasswordError("An error occurred while verifying the password.");
    }
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

  // Custom image handler
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch(
            "https://smartnotes-backend.vercel.app/user-api/users/notes/upload-image",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );
          const data = await response.json();
          if (data.success && data.imageUrl) {
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, "image", data.imageUrl);
          } else {
            alert("Image upload failed");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={noteTitle}
        onChange={handleTitleChange}
        placeholder="Enter note title"
        className="w-full mb-4 p-2 border rounded"
      />
      <ReactQuill
        value={noteText}
        onChange={handleTextChange}
        modules={modules}
        formats={formats}
      />
      <div className="flex items-center space-x-2 mt-4">
        <button onClick={handleToggleFavourite} className="btn-primary">
          {isFavourite ? "Unfavourite" : "Add to Favourite"}
        </button>
        {isFavourite && (
          <button
            onClick={handleRemoveFromFavourites}
            className="btn-secondary"
          >
            Remove from Favourite
          </button>
        )}
        <button onClick={handleToggleLock} className="btn-secondary">
          {isLocked ? "Unlock" : "Lock"}
        </button>
        <button onClick={handleAddTag} className="btn-secondary">
          Add Tag
        </button>
        <button onClick={handleDeleteNote} className="btn-secondary">
          Delete Note
        </button>
      </div>

      {showTagOptions && (
        <div className="tag-options mt-2">
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className="tag-option btn-secondary"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Password</h3>
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder="Enter your notes password"
              className="w-full mb-2 p-2 border rounded"
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <button onClick={handlePasswordSubmit} className="btn-primary">
              Submit
            </button>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteDetail;
