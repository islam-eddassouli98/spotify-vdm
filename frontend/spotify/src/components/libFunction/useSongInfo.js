import { useEffect,useState } from "react";
import { useSelector } from "react-redux";




function useSongInfo(){
const token = window.localStorage.getItem("token");
const currentSong = useSelector((state) => state.playlist.currentSong);
const isSearch = useSelector((state) => state.modal.search);
const [songInfo, setSongInfo] = useState(null);


  useEffect(() => {
    if(currentSong !== null){
        const fetchSongInfo = async () => {
      const id = currentSong.id ? currentSong.id : currentSong.track.id;
      const response = await fetch(
        

       isSearch ? `https://api.spotify.com/v1/tracks/${id}` : `https://api.spotify.com/v1/tracks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => response.json());
      setSongInfo(response);
    };
    fetchSongInfo();
    }
    
  }, [currentSong, token]);

  return songInfo;
};

export default useSongInfo;