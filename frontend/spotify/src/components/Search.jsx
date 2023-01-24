import React from "react";
import axios from "axios";
import { useState } from "react";
import { millisToMinutesAndSeconds } from "./libFunction/time";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong, setIsPlaying } from "../slices/PlaylistSlice";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { setSongs } from "../slices/PlaylistSlice";
import { setAddedSong } from "../slices/PlaylistSlice";

const Search = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [elementToSearch, setElementToSearch] = useState("drake");
  const token = window.localStorage.getItem("token");
  const [searchedSong, setSearchedSong] = useState(null);
  const userData = useSelector((state) => state.user.data);
  const [OptionValue, setOptionValue] = useState(
    userData?.data?.mongoitems[0]?.name
  );
  const dispatch = useDispatch();

  //Mette la canzone in riproduzione
  const playSong = (song) => {
    axios({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player/play",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uris: [song.uri],
      },
    })
      .then((response) => {
        dispatch(setCurrentSong(song));
        dispatch(setIsPlaying(true));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchSong = (e) => {
    axios
      .get(
        `https://api.spotify.com/v1/search?q=${elementToSearch}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        setSearchedSong(data.data.tracks.items);
      });
    e.preventDefault();
  };
  const AddMongoPlaylist = (song, index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const addMongoSong = (song, index) => {
    axios
      .post(
        `http://localhost:8080/api/users/mongoitems/${userData.data._id}/${OptionValue}`,
        {
          name: song.id,
          object: song,
        }
      )
      .then((response) => {
        console.log(response.data);
        dispatch(setAddedSong(response.data));
        dispatch(setSongs(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="h-screen w-[80vw] text-white bg-black overflow-y-scroll scrollbar-hide">
      <form className="flex my-8 flex-row justify-center" onSubmit={searchSong}>
        <input
          type="text"
          placeholder="Search for a song ..."
          className=" w-60 h-10 mx-5 bg-gray-800 text-white rounded-full px-5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          onChange={(e) => setElementToSearch(e.target.value)}
        />
        <button
          type="submit"
          className="w-10 h-10 bg-green-800 rounded-full text-white flex items-center justify-center"
        >
          <BsSearch />
        </button>
      </form>

      {searchedSong &&
        searchedSong.map((song, index) => (
          <div className=" flex flex-col space-y-1  text-gray-500">
            <div
              onClick={() => playSong(song)}
              className="px-8 py-6 grid grid-cols-2 hover:bg-gray-900 items-center rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4 ">
                <p key={index}>{index + 1}</p>
                <img
                  src={song?.album.images[0].url}
                  alt=""
                  className="w-10 h-10"
                />
                <div>
                  <p className="text-white w-36 lg:2-64 truncate">
                    {song.name}
                  </p>
                  <p>{song.artists[0].name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between ml-0">
                <p className="inline">{song.name}</p>
                <p>{millisToMinutesAndSeconds(song.duration_ms)}</p>
                <BsThreeDots
                  className="cursor-pointer w-5"
                  onClick={(e) => {
                    AddMongoPlaylist(song, index);
                  }}
                />
                {dropdownOpen[index] && (
                  <div className="dropdown-content flex justify-center mx-2">
                    <select
                      className="mx-2"
                      onChange={(e) => setOptionValue(e.target.value)}
                    >
                      {userData?.data.mongoitems.map((playlist) => (
                        <option value={playlist.name}>{playlist.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => addMongoSong(song, index, OptionValue)}
                    >
                      Add to Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
