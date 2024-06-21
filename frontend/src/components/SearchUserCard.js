import React from "react";
import Avator from "../components/Avator";
import { Link } from "react-router-dom";

const SearchUserCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-4 lg:p-4 border border-transparent border-b-slate-300 hover:border hover:border-slate-300 rounded cursor-pointer"
    >
      <div>
        <Avator
          width={50}
          height={50}
          name={user?.name}
          imageURL={user?.profile_pic}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
};

export default SearchUserCard;
