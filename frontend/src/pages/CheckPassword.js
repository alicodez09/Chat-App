import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avator from "../components/Avator";
// import { useDispatch } from "react-redux";
// import { setToken } from "../redux/userSlice";
const CheckPassword = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();
  useEffect(() => {
    if (!location?.state?.data?.name) {
      navigate("/email");
    }
  }, [location?.state?.data?.name, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BASE_URL}/auth/verify-user-password`;
    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?.data?._id,
          password: data?.password,
        },
        withCredentials: true,
      });

      // const payload = {
      //   password: data?.password,
      //   userId: location?.state?.data?._id,
      // };
      // const response = await axios.post(URL, payload, {
      //   withCredentials: true,
      // });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avator
            width={70}
            height={70}
            // name={location?.state?.data?.name}
            // imageURL={location?.state?.data?.profile_pic}
          />
          <h2 className="mt-2 font-semibold text-lg">
            {location?.state?.data?.name}
          </h2>
        </div>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="bg-primary text-lg text-white px-4 py-1 hover:bg-secondory rounded mt-2 font-bold leading-relaxed">
            Login
          </button>
          <p className="my-3 text-center">
            <Link
              to={"/forgot-password"}
              className="hover:text-primary font-semibold"
            >
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckPassword;
