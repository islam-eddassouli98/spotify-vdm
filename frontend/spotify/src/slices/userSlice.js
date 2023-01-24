import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    id: null,
    name: null,
    email: null,
    data:{},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.id = action.payload;
        },
        setUserName: (state, action) => {
            state.name = action.payload;
        },
        setUserEmail: (state, action) => {
            state.email = action.payload;
        },
        setDataUser: (state, action) => {
            state.data = action.payload;
        }
    }
});


export const { setUserId,setUserName,setUserEmail,setDataUser } = userSlice.actions;

export const selectUserId = (state) => state.user.id;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectDataUser = (state) => state.user.data;

export default userSlice.reducer;
