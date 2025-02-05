import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import rightArrow from "../assets/disabled-right.svg";
import leftArrow from "../assets/disabled-left.svg";

const RecentNotes = () => {
  const [recentNotes, setRecentNotes] = useState([]);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const response = await fetch(
          "https://smartnotes-backend.vercel.app/user-api/users/recent-notes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setRecentNotes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecentNotes();
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      if (scrollElement) {
        const scrollLeftValue = scrollElement.scrollLeft;
        const scrollWidthValue =
          scrollElement.scrollWidth - scrollElement.clientWidth;

        setAtStart(scrollLeftValue === 0); // Reached start
        setAtEnd(scrollLeftValue >= scrollWidthValue); // Reached end
      }
    };

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -336, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 336, behavior: "smooth" });
    }
  };

  // Function to handle note click
  const handleNoteClick = (noteId) => {
    navigate(`/profile/notes/${noteId}`); // Navigate to the note detail page
  };

  return (
    <div className="recent-notes ms-10 scroll-section pt-12 mb-8">
      <h1 className="text-5xl font-afacad font-medium mb-12">Recent Notes</h1>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-4 rounded-xl scrollbar-hide"
      >
        <div className="flex gap-4 me-2">
          {error && <p className="text-red-500">{error}</p>}
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => (
              <div
                key={note.noteId}
                className="flex flex-col w-60 h-52 p-6 rounded-xl pb-4 sm:pe-4 bg-[#bfeae7]  hover:scale-[1.07] transition-all cursor-pointer  hover:bg-[#8ddfd8]"
                onClick={() => handleNoteClick(note.noteId)} // Attach click handler
              >
                <h2 className="text-2xl font-semibold mb-2">{note.title}</h2>
                <p className="text-md">
                  <strong>Tags:</strong> {note.tags.join(", ")}
                </p>
                <p className="text-md">
                  <strong>Last Accessed:</strong>{" "}
                  {formatDistanceToNow(parseISO(note.lastAccessed), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-md text-gray-500">No recent notes available</p>
          )}
        </div>
      </div>
      <div className="flex justify-end me-10 mt-12 gap-6 sm:gap-4">
        {!atStart && (
          <img
            className="w-12 sm:w-10 bg-[#e0e0e3] p-1 rounded-full hover:cursor-pointer"
            src={leftArrow}
            alt=""
            onClick={scrollLeft}
          />
        )}
        {!atEnd && (
          <img
            className="w-12 sm:w-10 bg-[#e0e0e3] p-1 rounded-full hover:cursor-pointer"
            src={rightArrow}
            alt=""
            onClick={scrollRight}
          />
        )}
      </div>
    </div>
  );
};

export default RecentNotes;
