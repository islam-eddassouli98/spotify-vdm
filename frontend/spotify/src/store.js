import {configureStore} from '@reduxjs/toolkit';
import tokenReducer from './slices/tokenSlice';
import modalReducer from './slices/modalSlice';
import user from './slices/userSlice';
import playlistReducer from './slices/PlaylistSlice';



export const store = configureStore({
    reducer: {
        token: tokenReducer,
        modal: modalReducer,
        user: user,
        playlist: playlistReducer
    },
 });