import axios from "axios";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setToken, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  console.log("@@@@@@@@@@@@@user", user);
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}/auth/get-user-details`;

      const response = await axios.get(URL, { withCredentials: true });
      // getting the token data from local storage
      const tokenData = localStorage.getItem("token");
      dispatch(setToken(tokenData));

      // set user details in redux
      dispatch(setUser(response.data.data));

      if (response?.data?.data?.logout) {
        //logout the user[(To check logic go to getUserDetailsWithToken.js file)]
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div
        className={`${
          !basePath ? "hidden" : "lg:flex"
        } justify-center items-center flex-col gap-3 hidden`}
      >
        <div>
          <img src={logo} width={250} alt="logo" draggable={false} />
        </div>
        <p className="text-lg text-slate-500">
          Send a message to start a chat.
        </p>
      </div>
    </div>
  );
};

export default Home;
