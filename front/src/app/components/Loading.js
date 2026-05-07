import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center fixed top-0 left-0 bg-black z-40">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
