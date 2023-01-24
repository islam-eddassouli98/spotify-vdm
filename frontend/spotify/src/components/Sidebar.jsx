import React from "react";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlinePlusSquare,
  AiOutlineLogout,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistId } from "../slices/PlaylistSlice";
import { setSearch } from "../slices/modalSlice";
import { setPlaylistPage } from "../slices/modalSlice";
import { logout } from "./libFunction/logout";

const Sidebar = () => {
  const token = localStorage.getItem("token"); //Token
  const [playlists, setPlaylists] = useState([]); //Dati Playlist
  const [playlistIda, setPlaylistIda] = useState(null); //Dati id Playlist
  const [User, setUser] = useState([]); //Dati Utente
  const UserData = useSelector((state) => state.user.data);
  const dispatch = useDispatch(); //Dispatch

  dispatch(setPlaylistId(playlistIda)); //Inserisco id in Redux Toolkit

  //Prendo Playlist
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaylists(response.data.items);
      dispatch(setPlaylist(response.data.items));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setUser(UserData.data?.mongoitems);
  }, [UserData]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylist = (playlist) => {
    setPlaylistIda(playlist);
    dispatch(setSearch(false));
    dispatch(setPlaylistPage(false));
  };

  const handleAddPlaylist = () => {
    dispatch(setPlaylistPage(true));
  };
  const handleHome = () => {
    dispatch(setSearch(false));
    dispatch(setPlaylistPage(false));
  };
  const handleSearch = () => {
    dispatch(setSearch(true));
  };
  return (
    <div className="h-screen w-[20vw] bg-black overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col justify-start">
        {/* Creazione Logout */}
        <div
          onClick={(e) => logout()}
          className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white"
        >
          <AiOutlineLogout className="text-2xl mx-4" />
          <span>Logout</span>
        </div>
        {/* Creazione Home */}
        <div
          className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white"
          onClick={(e) => handleHome()}
        >
          <AiOutlineHome className="text-2xl mx-4" />
          <span className="">Home</span>
        </div>
        {/* Creazione Search */}
        <div
          className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white"
          onClick={() => handleSearch()}
        >
          <AiOutlineSearch className="text-2xl mx-4" />
          <span>Search</span>
        </div>
        {/* Creazione canzoni Like */}
        <div
          className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white"
          onClick={(e) => handleHome()}
        >
          <AiOutlineHeart className="text-2xl mx-4" />
          <span>Liked Song</span>
        </div>
        {/* Creazione Playlist */}
        <div
          className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white"
          onClick={(e) => handleAddPlaylist()}
        >
          <AiOutlinePlusSquare className="text-2xl mx-4" />
          <span>Add Playlist</span>
        </div>
        {User &&
          User?.map((playlist, index) => (
            <div
              key={index}
              onClick={() => handlePlaylist(playlist)}
              className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white "
            >
              <span>{playlist.name}</span>
            </div>
          ))}

        {playlists &&
          playlists.map((playlist, index) => (
            <div
              key={index}
              onClick={() => handlePlaylist(playlist)}
              className="flex flex-row justify-start items-center p-4 cursor-pointer text-gray-500 hover:text-white "
            >
              <span>{playlist.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
