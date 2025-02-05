// App.jsx
import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Main from './components/main/Main';
import ProfileLayout from "./user-profile/ProfileLayout";
import Home from "./user-profile/Home";
import FavouritesList from "./user-profile/FavouritesList";
import NoteDetail from "./user-profile/NoteDetail"; 
import FavNoteDetail from "./user-profile/FavNotesDetail"; 
import Notes from "./user-profile/Notes";
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import Tags from "./user-profile/Tags";
import Trash from "./user-profile/Trash";
import SearchBar from "./user-profile/SearchBar";  // Assuming SearchBar needs to be integrated into the profile pages

function App() {  
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <Main />, 
    },
    {
      path: "/profile",
      element: <ProfileLayout />,
      children: [
        { path: "", element: <Home /> },  // Redirect to home
        { path: "home", element: <Home /> },
        { path: "search", element: <SearchBar /> },  // Search page
        { 
          path: "favourites", 
          element: <FavouritesList />,
          children: [
            { path: ":noteId", element: <FavNoteDetail /> },  // Show note details within favourites
          ],
        },
        { 
          path: "notes", 
          element: <Notes />,
          children: [
            { path: ":noteId", element: <NoteDetail /> },  // Dynamic note detail
          ],
        },
        { path: "tags", element: <Tags /> },
        { path: "trash", element: <Trash /> },  // Trash page
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ]);

  return (
    <RouterProvider router={browserRouter} />
  );
}

export default App;
