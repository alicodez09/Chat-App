import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avator from "../components/Avator";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../middlewares/uploadFile";
import Loader from "./Loader";
import BackgroundImage from "../assets/wallapaper.jpeg";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [isOpenImageVideoPopup, setIsOpenImageVideoPopup] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAllMessages, setIsAllMessages] = useState([]);
  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isAllMessages]);

  const handleOpenPopup = () => {
    setIsOpenImageVideoPopup((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setIsOpenImageVideoPopup(false);
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleRemoveImage = async (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setIsOpenImageVideoPopup(false);

    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.url,
      };
    });
  };
  const handleRemoveVideo = async (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params?.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params?.userId);

      socketConnection.on("message-user", (data) => {
        setUserData(data);
      });
      socketConnection.on("message", (msg) => {
        setIsAllMessages(msg);
      });
    }
  }, [socketConnection, params?.userId, user]);
  console.log("userData=>", userData);
  return (
    <div
      style={{ backgroundImage: `url(${BackgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-6">
        <div className="flex items-center gap-5 ml-1">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div className="mt-3">
            <Avator
              width={40}
              height={40}
              name={userData?.name}
              imageURL={userData?.profile_pic}
              userId={userData?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-xl my-0 mb-1 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            <p className="-my-2 text-sm">
              {userData?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-300">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiOutlineDotsVertical size={20} />
          </button>
        </div>
      </header>
      {/* Show All Messages */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-300 bg-opacity-50">
        {/* Upload Image Display */}
        {message.imageUrl && (
          <div className="h-full w-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded">
            <div
              className="absolute top-0 right-0 cursor-pointer hover:text-red-700"
              onClick={handleRemoveImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-slate-200 p-1 rounded">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* Upload Video Display */}
        {message.videoUrl && (
          <div className="h-full w-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded">
            <div
              className="absolute top-0 right-0 cursor-pointer hover:text-red-700"
              onClick={handleRemoveVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-slate-200 p-1 rounded">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center w-full h-full sticky bottom-0">
            <Loader />
          </div>
        )}
        {/* All Messages will show here */}

        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {isAllMessages?.map((msg, index) => {
            return (
              <>
                <div
                  className={`bg-white p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    user?._id === msg?.msgByUserId ? "bg-green-200 ml-auto" : ""
                  }`}
                >
                  <div className="w-full relative">
                    {msg.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down bg-white border border-primary"
                      />
                    )}

                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className="w-full h-full object-scale-down bg-white border border-primary"
                        controls
                      />
                    )}
                  </div>
                  <p className="px-2 text-lg">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </section>

      {/* Send Messages */}
      <section className="h-16 bg-white flex items-center px-6">
        <div className="relative">
          <button
            onClick={handleOpenPopup}
            className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white cursor-pointer"
          >
            <FaPlus size={20} />
          </button>
          {/* video and image popup */}
          {isOpenImageVideoPopup && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 cursor-pointer rounded hover:bg-slate-200"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 cursor-pointer rounded hover:bg-slate-200"
                >
                  <div className="text-purple-600">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/* Input Box */}
        <form
          className="h-full w-full flex justify-center items-center gap-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Type a message"
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondory">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
