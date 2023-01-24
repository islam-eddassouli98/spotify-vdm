import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { millisToMinutesAndSeconds } from "./libFunction/time";
import { setCurrentSong, setIsPlaying } from "../slices/PlaylistSlice";

import axios from "axios";

const Songs = () => {
  const dispatch = useDispatch();
  const song = useSelector((state) => state.playlist.song);
  const token = localStorage.getItem("token");
//Player
  const playSong = (song) => {
    axios({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player/play",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uris: [song.track.uri],
      },
    })
      .then((response) => {
        console.log(response.data);
        dispatch(setCurrentSong(song));
        dispatch(setIsPlaying(true));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="pt-5">
      {!song?.playlist ? (
        song?.map((song, index) => (
          <div key={index} className=" flex flex-col space-y-1  text-gray-500">
            <div
              onClick={() => playSong(song)}
              className="px-8  py-6 grid grid-cols-2 hover:bg-gray-900 items-center rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4 ">
                <p key={index}>{index + 1}</p>
                <img
                  src={song.track.album.images[0].url}
                  alt=""
                  className="w-10 h-10"
                />
                <div>
                  <p className="text-white w-36 lg:2-64 truncate">
                    {song.track.name}
                  </p>
                  <p>{song.track.artists[0].name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between ml-0">
                <p className="inline">{song.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(song.track.duration_ms)}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1></h1>
      )}
    </div>
  );
};
export default Songs;
