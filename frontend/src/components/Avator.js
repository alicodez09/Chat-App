import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avator = ({ userId, name, imageURL, width, height }) => {
  let avatorName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatorName = splitName[0][0] + splitName[1][0];
    } else {
      avatorName = splitName[0][0];
    }
  }
  return (
    <div
      className="overflow-hidden rounded-full shadow border text-xl font-bold  text-white"
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageURL ? (
        <img
          src={imageURL}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
          draggable={false}
        />
      ) : name ? (
        <div
          className="overflow-hidden flex justify-center items-center rounded-full text-white bg-primary"
          style={{ width: width + "px", height: height + "px" }}
        >
          {avatorName}
        </div>
      ) : (
        <PiUserCircle size={width} color="#14213d" />
      )}
    </div>
  );
};

export default Avator;
