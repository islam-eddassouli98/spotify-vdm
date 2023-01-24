import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { millisToMinutesAndSeconds } from "./libFunction/time";
import axios from "axios";
import { setCurrentSong, setIsPlaying } from "../slices/PlaylistSlice";
import { setSongs } from "../slices/PlaylistSlice";
import { setAddedSong } from "../slices/PlaylistSlice";

const SongMongo = () => {
  const [songpatched, setSongpatched] = useState([]);
  const token = window.localStorage.getItem("token");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const song = useSelector((state) => state.playlist.song);
  const AddedSong = useSelector((state) => state.playlist.addedsong);

  //Mette la canzone in riproduzione
  const playSong = (song) => {
    axios({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player/play",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uris: [song.object.uri],
      },
    })
      .then((response) => {
        dispatch(setCurrentSong(song.object));
        dispatch(setIsPlaying(true));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Rimuove la canzone da mongo
  const RemoveMongoPlaylist = (currentsong) => {
    axios
      .delete(
        `http://localhost:8080/api/users/mongoitems/${user.data._id}/${song.name}`,
        {
          data: {
            name: currentsong.name,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(setAddedSong(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    //Check if addesdsong.data.mongoitems.name are equal to song.name
    //if yes set songpatched to AddedSong.data.mongoitems[i]
    //if no set songpatched to song
    console.log("qua",song)
    if (AddedSong?.data) {
      console.log("qua",AddedSong)
      for (let i = 0; i < AddedSong.data.mongoitems.length; i++) {
        if (AddedSong.data.mongoitems[i].name === song.name) {
          setSongpatched(AddedSong.data.mongoitems[i]);
          console.log("cambiato", AddedSong.data.mongoitems[i])
        }
      }
    } else {
      setSongpatched(song);
    }
  }, [song, AddedSong]);

  return (
    <div className="pt-5 pb-20">
      {songpatched ? (
        songpatched?.playlist?.map((song, index) => (
          <div key={index} className=" flex flex-col space-y-1  text-gray-500">
            <div
              onClick={() => playSong(song)}
              className="px-8  py-6 grid grid-cols-2 hover:bg-gray-900 items-center rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4 ">
                <p>{index + 1}</p>
                <img
                  src={song?.object?.album?.images[0]?.url}
                  alt=""
                  className="w-10 h-10"
                />
                <div>
                  <p className="text-white w-36 lg:2-64 truncate">
                    {song?.object?.name}
                  </p>
                  <p>
                    {song?.object?.artists?.length > 0
                      ? song.object.artists[0].name
                      : "Unknown Artist"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between ml-0">
                <p className="inline">{song?.object?.album?.name}</p>
                <p>{millisToMinutesAndSeconds(song?.object?.duration_ms)}</p>
                <button
                  className="cursor-pointer  bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full my-4"
                  onClick={(e) => {
                    RemoveMongoPlaylist(song);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="flex justify-center items-center text-lg font-bold tracking-wider">NO SONGS</h1>
      )}
    </div>
  );
};

export default SongMongo;
