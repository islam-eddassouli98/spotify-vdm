import React, { useEffect, useState } from "react";
import Spotify from "../../assets/spotify_black.png";
import axios from "axios";
import { setToken } from "../../slices/tokenSlice";
import {
  setShowModalLogin,
  setShowModalInitialPage,
  setShowModalRegister,
} from "../../slices/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {setUserId, setUserName,setUserEmail} from '../../slices/userSlice'


const ModalLogin = () => {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const ModalLogin = useSelector((state) => state.modal.showModalLogin);
  const ShowLogin = useSelector((state) => state.modal.showModalInitialPage);
  const ShowRegister = useSelector((state) => state.modal.showModalRegister);
  useSelector((state) => state.user.id);
  useSelector((state) => state.user.name);
useSelector((state) => state.user.email);


  const [error, setError] = useState("");
  const login = () => {
    axios
      .post(
        "http://localhost:8080/api/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        const token = response.data.data;
        dispatch(setToken(token));
        dispatch(setShowModalLogin(!ModalLogin));
        dispatch(setShowModalInitialPage(!ShowLogin));
        dispatch(setUserId(response.data.id));
        dispatch(setUserName(response.data.name));
        dispatch(setUserEmail(response.data.email));
        localStorage.setItem("token", response.data.data);
        navigateTo("/");

      })
      .catch(function (error) {
        console.log(error);
        setError(error.response.data);
      });
  };

  const changePage = () => {
    dispatch(setShowModalLogin(!ModalLogin));
    dispatch(setShowModalRegister(!ShowRegister));
  };

  return (
    <div className="text-black bg-black h-screen w-screen absolute flex justify-center items-center">
      <div className="w-1/3 h-1/2  bg-white rounded">
        <img
          src={Spotify}
          alt="Spotify Logo"
          className="w-1/2 mx-auto my-4 relative"
          to="/"
        ></img>
        <div className="flex justify-around my-10">
          <button className="text-emerald-700 font-bold ">SIGN IN</button>
          <Link to="/register" onClick={changePage}>
            SIGN UP
          </Link>
        </div>
        {/* Input email e password */}
        <div className="flex flex-col justify-center items-center">
          <input
            type="email"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="text-red-500 text-center">{error}</div>
        {/* Button Login */}
        <div className="flex justify-center">
          <button
            className="w-3/4 h-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full my-10"
            onClick={login}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
