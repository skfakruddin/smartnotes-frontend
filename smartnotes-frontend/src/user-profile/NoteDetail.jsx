import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

// Register the ImageResize module with Quill
Quill.register("modules/imageResize", ImageResize);

// Define Quill modules and formats
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
      ["link", "image"], // Includes image button
      [{ color: [] }, { background: [] }], // Includes background color options
      ["clean"],
    ],
  },
  imageResize: {
    modules: ["Resize", "DisplaySize", "Toolbar"],
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

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
      const response = await fetch(
        isFavourite
          ? `https://smartnotes-backend.vercel.app/user-api/users/notes/unfavorite/${noteId}`
          : `https://smartnotes-backend.vercel.app/user-api/users/notes/favorite/${noteId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // Toggle the favourite status in the local state
        setIsFavourite(!isFavourite);

        // Re-fetch the list of favourite notes after updating the status
        fetchFavouriteNotes();

        const action = isFavourite ? "removed from" : "added to";
        alert(`Note ${action} favourites successfully!`);
      } else {
        console.error("Failed to update favourite status.");
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
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
        navigate("/profile/notes");
      } catch (error) {
        console.error("Error moving note to trash:", error);
      }
    }
  };

  const handleToggleChangePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://smartnotes-backend.vercel.app/user-api/users/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Password changed successfully.");
        setShowChangePasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordChangeError(result.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeError("An error occurred while changing the password.");
    }
  };

  return (
    <div className="relative p-4">
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
        <button
          onClick={handleToggleFavourite}
          className={`px-4 py-2 font-semibold text-white rounded-md transition-colors duration-300 
    ${isFavourite ? "bg-red-500 hover:bg-red-600" : "bg-[#41b3a2]"} 
    `}
        >
          {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
        </button>

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

      {isLocked ? (
        <p className="text-gray-500 italic">
          This note is locked. Enter the password to unlock and view the
          content.
        </p>
      ) : (
        <ReactQuill
          value={noteText}
          onChange={handleTextChange}
          modules={modules}
          formats={formats}
          placeholder="Write your note here..."
          className="mt-3"
        />
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Enter Notes Password</h2>
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-[#41b3a2]"
              placeholder="Enter password"
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-3 py-1 bg-[#41b3a2] text-white font-semibold rounded hover:bg-[#33a89f] transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Change Notes Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            {passwordChangeError && (
              <p className="text-red-500 text-sm">{passwordChangeError}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleToggleChangePasswordModal}
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteDetail;
