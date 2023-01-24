import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowModalLogin } from "../slices/modalSlice";
import { store } from "../store";
import Logo from "../assets/Spotify.png";

//Da Mettere in un file .env
//const CLIENT_ID = "7c95a86f9b9c490b842578cf8b795d4a"
const CLIENT_ID = "6e57d8152d494ce69869ece372fec823";
const REDIRECT_URI = "http://localhost:5173";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const scopes = [
  "user-read-email",
  "streaming",
  "user-read-private",
  "user-library-read",
  // "user-library-modify",
  "user-top-read",
  // "user-library-modify"
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(",");

//Gestione Login Modali (Per Creazione Account e Login) -- Per ora utilizzo spotify web API
const Login = () => {
  const Login = store.getState().modal.showModalInitialPage;
  const ModalLogin = useSelector((state) => state.modal.showModalLogin);
  const dispatch = useDispatch();

  const goToLogin = () => {
    dispatch(setShowModalLogin(!ModalLogin));
  };

  //Pagina Login Spotify
  return (
    <>
      {Login && (
        <div className="w-screen h-screen bg-black text-white flex justify-center items-center flex-col">
          <img src={Logo} alt="Spotify Logo" className="w-1/4"></img>
          {/* <input className="underline underline-offset-1" onChange={(e) => dispatch(setToken(e.target.value))}></input> */}
          <a
            to="/login"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 my-2 px-4 rounded-full"
            onClick={goToLogin}
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private&response_type=token&show_dialog=true`}
          >
            Login Spotify
          </a>
        </div>
      )}
    </>
  );
};

export default Login;
