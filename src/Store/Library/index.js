import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'library',
  initialState: { books: [], favorites: [],categories: []},
  reducers: {
    addBook: (state, { payload: { book } }) => {
      state.books = [...state.books, book]
    },
    removeBook: (state, { payload: { bookId } }) => {
      state.books = state.books.filter(b => b && b.id !== bookId)
    },
    editBook: (state, { payload: { book } }) => {
      state.books = state.books.map(b => {
        if (b.id === book.id) {
          return book
        }

        return b
      })
    },
    setCategories: (state,{payload: {categories}}) => {
      state.categories = categories
    }
  },
})

export const { addBook, removeBook, editBook,setCategories} = slice.actions

export default slice.reducer
