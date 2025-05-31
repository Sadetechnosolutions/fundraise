import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formslice'
import blooddonorformReducer from './slices/bloodform'

const Store = configureStore({
    reducer:{
        form:formReducer,
        blooddonorform:blooddonorformReducer
    }
})

export default Store;
