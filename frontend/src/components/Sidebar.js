import React, { useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Avator from "./Avator";
import { useSelector } from "react-redux";
import EditUserModal from "./EditUserModal";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [getUsers, setGetUsers] = useState([]);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isSearchUsersModalOpen, setIsSearchUsersModalOpen] = useState(false);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 rounded ${
                isActive && "bg-slate-300"
              }`
            }
            title="Chats"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>
          <NavLink
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 rounded"
            title="Add Friends"
            onClick={() => setIsSearchUsersModalOpen(true)}
          >
            <FaUserPlus size={20} />
          </NavLink>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setIsEditUserModalOpen(true)}
          >
            <Avator
              width={37}
              height={37}
              name={user?.name}
              imageURL={user?.profile_pic}
            />
          </button>
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 rounded"
            title="Logout"
          >
            <span className="-ml-1">
              <RiLogoutBoxLine size={20} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Messages</h2>
        </div>
        <div className="p-[0.5px] bg-slate-300"></div>
        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {getUsers.length === 0 && (
            <div className="mt-24">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore Users to Start the conversation.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <EditUserModal
          onClose={() => setIsEditUserModalOpen(false)}
          data={user}
        />
      )}

      {/* Search User Modal */}
      {isSearchUsersModalOpen && (
        <SearchUser
          onClose={() => setIsSearchUsersModalOpen(false)}
          data={user}
        />
      )}
    </div>
  );
};

export default Sidebar;
