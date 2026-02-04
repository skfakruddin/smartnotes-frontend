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
import SearchBar from "./user-profile/SearchBar";  

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
        { path: "", element: <Home /> },  
        { path: "home", element: <Home /> },
        { path: "search", element: <SearchBar /> },  
        { 
          path: "favourites", 
          element: <FavouritesList />,
          children: [
            { path: ":noteId", element: <FavNoteDetail /> },  
          ],
        },
        { 
          path: "notes", 
          element: <Notes />,
          children: [
            { path: ":noteId", element: <NoteDetail /> },  
          ],
        },
        { path: "tags", element: <Tags /> },
        { path: "trash", element: <Trash /> },  
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
