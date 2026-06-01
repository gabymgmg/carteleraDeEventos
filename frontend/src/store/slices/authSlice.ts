import type { User } from '../../types/user';
import {createSlice, type PayloadAction} from '@reduxjs/toolkit';


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
            const user = action.payload.user
            const token = action.payload.token
            // update state variables
            state.user = user
            state.token = token
            state.isAuthenticated = true
            state.isLoading = false
            // Set the user and token in localstorage
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', token)    
        },

        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    }
})

export const {loginSuccess, logout, setLoading} = authSlice.actions // For componenent use
export default authSlice.reducer // For global store