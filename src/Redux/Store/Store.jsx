import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slice/Userslice"
import SnackbarReducer from '../Slice/SnackbarSlice'
const Store=configureStore({
    reducer:{
        auth:userReducer,
        snackbar:SnackbarReducer
    }
})

export default Store