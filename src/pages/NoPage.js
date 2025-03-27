// NoPage.js
import React from "react";

const NoPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NoPage;
