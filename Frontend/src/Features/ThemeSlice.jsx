import { createSlice } from '@reduxjs/toolkit'

export const ThemeSlice = createSlice({
    name: 'themeSlice',
    initialState:true,
    reducers: {
        toggleTheme : (state) => {
            return state = !state;
        },
    },
}) 

export const {toggleTheme} = ThemeSlice.actions
export default ThemeSlice.reducer