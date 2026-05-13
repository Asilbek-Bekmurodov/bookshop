import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: '',
  isSearching: false,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload
    },
  },
})

export const { setSearchQuery, setIsSearching } = searchSlice.actions
export default searchSlice.reducer
