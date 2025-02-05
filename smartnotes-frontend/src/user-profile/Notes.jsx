import React from 'react';
import { Outlet } from 'react-router-dom';

function Notes() {
  return (
    <div>
      <h2></h2>
      <Outlet />
    </div>
  );
}

export default Notes;
