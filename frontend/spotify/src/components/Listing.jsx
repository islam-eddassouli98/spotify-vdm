import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSongs } from "../slices/PlaylistSlice";
import Songs from "./Songs";
import SongMongo from "./SongMongo";
import { useNavigate } from "react-router-dom";

//Homepage Principale
const Listing = () => {
  const navigateTo = useNavigate();
  const [User, setUser] = useState([]); //Dati Utente
  const [song, setSong] = useState([]); //Dati Canzoni presenti nella playlist
  const token = localStorage.getItem("token"); //Token
  const dispatch = useDispatch(); //Dispatch
  const playlistId = useSelector((state) => state.playlist.playlistId); //Dati Playlist
  const UserMongo = useSelector((state) => state.user.data); //Dati Utente

  //Prendere Canzoni
  useEffect(() => {
    if (playlistId === null) return;
    if (!playlistId.playlist) {
      axios
        .get(`https://api.spotify.com/v1/playlists/${playlistId.id}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSong(response.data.items);
          dispatch(setSongs(response.data.items));
        });
    } else {
      dispatch(setSongs(playlistId));
      console.log(playlistId);
    }
  }, [playlistId]);

  useEffect(() => {
    // Prendere User Informazioni
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //Prendere Playlist
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        setPlaylist(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const removePlaylistMongo = (UserMongo, playlistId) => {
    axios
      .delete(
        `http://localhost:8080/api/users/del/mongoitems/${UserMongo.data._id}/${playlistId.name}`,
        {
          data: {
            name: playlistId.name,
          },
        }
      )
      .then((response) => {
        console.log(response);
        navigateTo(0);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log(playlistId)

  return (
    <div className="h-screen w-[80vw] bg-black text-white  flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 bg-black">
          <img
            className="rounded-full w-10 h-10"
            src={User?.images?.[0]?.url}
            alt="Profile Picture"
          />
          <h2>{User.display_name}</h2>
          <BsChevronDown className="cursor-pointer" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black from-emerald-500 h-80 text-white padding-8`}
      >
        <img
          src={
            playlistId?.images?.[0]?.url
              ? playlistId?.images?.[0]?.url
              : playlistId?.image
          }
          alt="Image Album"
          className="w-44 h-44 shadow-2xl"
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl xl:text-5xl font-bold">{playlistId?.name}</h1>
          {playlistId?.id ? (
            <></>
          ) : (
            <button
              onClick={(e) => removePlaylistMongo(UserMongo, playlistId)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full my-4"
            >
              Delete Playlist
            </button>
          )}
        </div>
      </section>
      <div>{playlistId?.id ? <Songs /> : <SongMongo />}</div>
    </div>
  );
};

export default Listing;
