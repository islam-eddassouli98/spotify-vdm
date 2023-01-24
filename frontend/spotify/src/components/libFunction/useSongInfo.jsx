import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useSongInfo = () => {
  const token = window.localStorage.getItem("token");
  const currentSong = useSelector((state) => state.player.currentSong);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${currentSong.track.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }.then((response) => response.json())
      );
      setSongInfo(response);
    };
    fetchSongInfo();
  }, [currentSong, token]);

  return songInfo;
};

export default useSongInfo;
