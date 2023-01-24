import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    showModalLogin: false,
    showModalRegister: false,
    showModalInitialPage: true,
    search: false,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setShowModalLogin: (state, action) => {
            state.showModalLogin = action.payload;
        },
        setShowModalRegister: (state, action) => {
            state.showModalRegister = action.payload;
        },
        setShowModalInitialPage: (state, action) => {
            state.showModalInitialPage = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setPlaylistPage: (state, action) => {
            state.playlist = action.payload;
        }
    }
});

export const { setShowModalLogin,setShowModalRegister,setShowModalInitialPage,setSearch,setPlaylistPage } = modalSlice.actions;


export const selectShowModalLogin = (state) => state.modal.showModalLogin;
export const selectShowModalRegister = (state) => state.modal.showModalRegister;
export const selectShowModalInitialPage = (state) => state.modal.showModalInitialPage;
export const selectSearch = (state) => state.modal.search;
export const selectPlaylistPage = (state) => state.modal.playlist;

export default modalSlice.reducer;



