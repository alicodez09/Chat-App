import React from "react";
import logo from "../assets/logooo.png";

const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img
          src={logo}
          width={150}
          alt="logo"
          draggable={false}
          className="rounded-full"
        />
      </header>
      {children}
    </>
  );
};

export default AuthLayouts;
