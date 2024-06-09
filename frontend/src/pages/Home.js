import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      {/* Message component */}
      <section>
        <Outlet />
      </section>
    </>
  );
};

export default Home;
