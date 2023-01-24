import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Listing from "./Listing";
import Player from "./Player";
import { store } from "../store";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import axios from "axios";
import CreatePlaylist from "./CreatePlaylist";
import { setDataUser } from "../slices/userSlice";

const Home = () => {
  const token = localStorage.getItem("token");
  const SearchModal = useSelector((state) => state.modal.search);
  const PlaylistPage = useSelector((state) => state.modal.playlist);
  const dispatch = useDispatch();
  // Prendo i dati dell'utente

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setDataUser(response));
        const playListResponse = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Creo l'utenza
        const { data } = await axios.post("http://localhost:8080/api/users", {
          id: response.data.id,
          name: response.data.display_name,
          email: response.data.email,
          images: response.data.images[0].url,
          items: playListResponse.data.items,
          mongoitems: [],
        });
        dispatch(setDataUser(data));
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-row overflow-hidden">
        <Sidebar />
        {SearchModal ? <Search /> : <Listing />}

        {PlaylistPage && <CreatePlaylist />}
      </div>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export default Home;
