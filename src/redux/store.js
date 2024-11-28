import { configureStore } from "@reduxjs/toolkit";
import flightParamsCheckerReducer from "../features/flightParamsChecker";

export const store = configureStore({
    reducer: {
        flightParamsCheck: flightParamsCheckerReducer
    },
})