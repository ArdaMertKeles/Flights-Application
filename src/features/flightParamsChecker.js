import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    originSkyIdValue: '',
    originEntityIdValue: '',
    departureValue: '',
    adultsValue: 1,
    childrenValue: 0,
    infantsValue: 0
}

export const flightParamSlice = createSlice({
    name: 'flightParamCheck',
    initialState,
    reducers:{
        setOriginSkyId: (state, param) => {
            state.originSkyIdValue = param.payload
        },
        incrementAdults: (state) => {
            state.adultsValue = state.adultsValue + 1
        },
        decrementAdults: (state) => {
            state.adultsValue = state.adultsValue - 1
        },
        incrementChildren: (state) => {
            state.childrenValue = state.childrenValue + 1
        },
        decrementChildren: (state) => {
            state.childrenValue = state.childrenValue - 1
        },
        incrementInfants: (state) => {
            state.infantsValue = state.infantsValue + 1
        },
        decrementInfants: (state) => {
            state.infantsValue = state.infantsValue - 1
        },
        setOriginEntityId: (state, param) => {
            state.originEntityIdValue = param.payload
        },
        setDepartureValue: (state, param) => {
            state.departureValue = param.payload
        }
    }
})

export const { setOriginSkyId, incrementAdults, decrementAdults, incrementChildren, decrementChildren, incrementInfants, decrementInfants, setDepartureValue, setOriginEntityId } = flightParamSlice.actions

export default flightParamSlice.reducer