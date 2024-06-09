import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avator = ({ userId, name, imageURL, width, height }) => {
  return (
    <div className="text-slate-800">
      {imageURL ? (
        <img src={imageURL} width={width} height={height} alt={name} />
      ) : name ? (
        <div></div>
      ) : (
        <PiUserCircle size={width} />
      )}
    </div>
  );
};

export default Avator;
