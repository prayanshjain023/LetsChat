import { configureStore } from '@reduxjs/toolkit'
import ThemeSliceReducer from './ThemeSlice'

export const store = configureStore({
  reducer: {
    themekey : ThemeSliceReducer
  },
})