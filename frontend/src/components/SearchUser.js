import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loader from "./Loader";
import SearchUserCard from "./SearchUserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    const URL = `${process.env.REACT_APP_BASE_URL}/auth/search-user`;

    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response?.data?.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, [search]);
  console.log("searchUser", searchUser);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/* input search user */}
        <div className="bg-white rounded h-12 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name and email..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-12 w-12 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>
        {/* Display search User */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/* No User found */}

          {searchUser?.length === 0 && !loading && (
            <p className="text-center text-slate-500">No User Found</p>
          )}

          {loading && (
            <>
              <Loader />
            </>
          )}
          {searchUser?.length !== 0 &&
            !loading &&
            searchUser?.map((user, index) => {
              return (
                <>
                  <SearchUserCard
                    key={user?._id}
                    user={user}
                    onClose={onClose}
                  />
                </>
              );
            })}
        </div>
        <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl">
          <button onClick={onClose}>
            <IoIosCloseCircle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
