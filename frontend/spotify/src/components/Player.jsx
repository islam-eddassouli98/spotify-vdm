import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsPlaying, setCurrentSong } from "../slices/PlaylistSlice";
import useSongInfo from "./libFunction/useSongInfo";
import axios from "axios";
import { HiSwitchHorizontal } from "react-icons/hi";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import {
  AiFillPauseCircle,
  AiFillPlayCircle,
  AiOutlineRollback,
} from "react-icons/ai";
import { BsVolumeDownFill, BsVolumeUpFill } from "react-icons/bs";
import { debounce } from "lodash";

const Player = () => {
  const [volume, setVolume] = useState(50);
  const token = window.localStorage.getItem("token");
  const songInfo = useSongInfo();
  const currentSong = useSelector((state) => state.playlist.currentSong);
  const isPlaying = useSelector((state) => state.playlist.isPlaying);
  const dispatch = useDispatch();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      axios
        .get(`https://api.spotify.com/v1/me/player/currently-playing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          dispatch(setCurrentSong(data.body?.item.id));
        });

      axios
        .get(`https://api.spotify.com/v1/me/player`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          dispatch(setIsPlaying(data.body?.is_playing));
        });
    }
  };

  const handlePlayPause = () => {
    axios
      .get(`https://api.spotify.com/v1/me/player`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        if (data.data.is_playing) {
          axios
            .put(
              `https://api.spotify.com/v1/me/player/pause`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((data) => {})
            .catch((err) => console.log(err));
          dispatch(setIsPlaying(false));
        } else {
          axios
            .put(
              `https://api.spotify.com/v1/me/player/play`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((data) => {})
            .catch((err) => console.log(err));
          dispatch(setIsPlaying(true));
        }
      });
  };

  const skipPrevious = () => {
    axios
      .post(
        `https://api.spotify.com/v1/me/player/previous`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {})
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (token && !currentSong) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [token, currentSong]);

  const debounceVolume = useCallback(
    debounce((volume) => {
      axios
        .put(
          `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => console.log(err));
    }, 200),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume <= 100) {
      debounceVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <HiSwitchHorizontal className="button" />
        <FaAngleDoubleLeft onClick={() => skipPrevious()} className="button" />
        {isPlaying ? (
          <AiFillPauseCircle
            onClick={() => handlePlayPause()}
            className="button"
          />
        ) : (
          <AiFillPlayCircle
            onClick={() => handlePlayPause()}
            className="button"
          />
        )}
        <FaAngleDoubleRight className="button" />
        <AiOutlineRollback className="button" />
      </div>

      <div className="flex items-center space-x-3 justify-end pr-5">
        <BsVolumeDownFill
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={volume}
          className="w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <BsVolumeUpFill
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
