import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ConcoursPage() {
  return (
    <div>
      <h2>Page principale des Concours</h2>
      <Outlet />  {/* Cela affichera les sous-pages ici */}
    </div>
  );
}
