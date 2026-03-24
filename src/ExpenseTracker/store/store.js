import {configureStore} from '@reduxjs/toolkit';
import CatSlice from './CatSlice';
import TransSlice from './TransSlice';
import BudgSlice from './BudgSlice';
import authSlice from './authSlice';

const store=configureStore({
        reducer:{
            categories:CatSlice,
            transaction:TransSlice,
            budgets:BudgSlice,
            auth:authSlice
        }
    
})

export default store;