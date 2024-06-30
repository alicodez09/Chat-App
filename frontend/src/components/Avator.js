import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avator = ({ userId, name, imageURL, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatorName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatorName = splitName[0][0] + splitName[1][0];
    } else {
      avatorName = splitName[0][0];
    }
  }

  const isOnline = onlineUser.includes(userId);
  return (
    <div
      className="rounded-full shadow border text-xl font-bold  text-white relative"
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

      {/* Online User */}
      {isOnline && (
        <div className="bg-green-600 p-1 absolute rounded-full bottom-2 -right-1  mr-1 z-10"></div>
      )}
    </div>
  );
};

export default Avator;
