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

const ModalRegister = () => {
const [name, setName] = useState("a");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [month, setMonth] = useState("");
const [date, setDate] = useState("");
const [year, setYear] = useState("");
const [gender, setGender] = useState("");
const [error, setError] = useState("");
const register = () => {
    axios
      .post(
        "http://localhost:8080/api/users",
        {
          name: name,
          email: email,
          password: password,
          month: month,
          date: date,
          year: year,
          gender: gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
        setError(error.response.data);
      });
    };

  return (
    <div className="text-black bg-black  h-screen w-screen absolute flex justify-center items-center">
      <div className="m-[30%]  bg-white rounded">
        <img
          src={Spotify}
          alt="Spotify Logo"
          className="w-1/2 mx-auto my-4"
        ></img>
        <div className="flex justify-around my-10">
          <Link to="/login" className="">
            SIGN IN
          </Link>
          <button className="text-emerald-700 font-bold">SIGN UP</button>
        </div>
        {/* Input email e password */}
        <div className="flex flex-col justify-center items-center">
          <input
            type="name"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          ></input>
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
          <input
            type="string"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Month"
            onChange={(e) => setMonth(e.target.value)}
          ></input>
          <input
            type="string"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Date"
            onChange={(e) => setDate(e.target.value)}
          ></input>
          <input
            type="string"
            className="w-3/4 h-10 border-2 border-black rounded mb-4 text-center"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
          ></input>
          <div className="mb-4">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="gender"
              name="gender"
              onChange={(e) => setGender(e.target.value)}
            >
            <option value="default"></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="text-red-500 text-center">{error}</div>
        <div className="flex justify-center">
          <button onClick={register} className="w-3/4 h-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full my-10">
            REGISTER
          </button>

        </div>
      </div>
    </div>
  );
};

export default ModalRegister;
