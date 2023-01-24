import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlaylistPage } from "../slices/modalSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePlaylist = () => {
  const navigateTo = useNavigate();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistImage, setPlaylistImage] = useState("");
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.user.data);
  const body = {
    name: playlistName,
    image: playlistImage,
    track: [],
    playlist: [],
  };

  //Crea una playlist
  const Addnewplaylist = () => {
    if(!body.image){
      body.image = "https://gogomagazine.it/wp-content/uploads/2018/01/Spotify-logo.jpg";
    }
    axios
      .post(
        `http://localhost:8080/api/users/mongoitems/${UserData.data._id}`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(setPlaylistPage(false));
        navigateTo(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Create a playlist
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <input
                      type="text"
                      onChange={(e) => setPlaylistName(e.target.value)}
                      className="w-full border-2 border-black rounded mb-4 text-center"
                      placeholder="Playlist name"
                    ></input>
                    <input
                      type="text"
                      onChange={(e) => setPlaylistImage(e.target.value)}
                      className="w-full border-2 border-black rounded mb-4 text-center"
                      placeholder="Image Playlist"
                    ></input>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => Addnewplaylist()}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create
            </button>
            <button
              onClick={() => dispatch(setPlaylistPage(false))}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
