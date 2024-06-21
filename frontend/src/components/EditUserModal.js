import React, { useRef, useState } from "react";
import Avator from "./Avator";
import uploadFile from "../middlewares/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserModal = ({ onClose, data }) => {
  const [isUser, setIsUser] = useState({
    name: data?.name,
    profile_pic: data?.profile_pic,
    phone: data?.phone,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setIsUser((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleOpenUpload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}/auth/update-user-details`;

      const response = await axios.put(URL, isUser, { withCredentials: true });
      toast.success(response?.data?.message);
      console.log(response?.data?.data, "123456789");
      if (response?.data?.success) {
        dispatch(setUser(response?.data?.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 m-1 py-6 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>
        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={isUser?.name}
              onChange={handleChange}
              className="w-full py-1 px-2 focus:outline-primary border rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              name="phone"
              id="phone"
              value={isUser?.phone}
              onChange={handleChange}
              className="w-full py-1 px-2 focus:outline-primary border rounded-sm"
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className="my-2 flex items-center gap-4">
              <Avator
                width={40}
                height={40}
                name={isUser?.name}
                imageURL={isUser?.profile_pic}
              />
              <label htmlFor="profile_pic">
                <button className="font-semibold" onClick={handleOpenUpload}>
                  Change Photo
                </button>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex gap-2 w-fit ml-auto">
            <button
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="border-primary border bg-primary text-white px-4 py-1 rounded hover:bg-secondory"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
