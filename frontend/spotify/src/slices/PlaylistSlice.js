import { createSlice} from "@reduxjs/toolkit";


const initialState = {
    playlist: null,
    playlistId: null,
    song:null,
    currentSong:null,
    isPlaying:false,
    addedsong:null,
};

export const playlistIdSlice = createSlice({
    name: 'playlistId',
    initialState,
    reducers: {
        setPlaylist: (state, action) => {
            state.playlist = action.payload;
        },
        setPlaylistId: (state, action) => {
            state.playlistId = action.payload;
        },
        setSongs: (state, action) => {
            state.song = action.payload;
        },
        setCurrentSong: (state, action) => {
            state.currentSong = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setAddedSong: (state, action) => {
            state.addedsong = action.payload
        },       

    }
});




export const { setPlaylists,setPlaylistId,setSongs,setCurrentSong,setIsPlaying,setAddedSong } = playlistIdSlice.actions;

export const selectPlaylist = (state) => state.playlistId.playlist;
export const selectPlaylistId = (state) => state.playlistId.playlistId;
export const selectSongs = (state) => state.playlistId.song;
export const selectCurrentSong = (state) => state.playlistId.currentSong;
export const selectIsPlaying = (state) => state.playlistId.isPlaying;
export const selectAddedSong = (state) => state.playlistId.addedsong;

export default playlistIdSlice.reducer;

