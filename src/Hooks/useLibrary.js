import { useSelector } from 'react-redux'


export default function () {
  const books = useSelector(state => state.library.books || [])
  const favorites = useSelector(state => state.library.favorites || [])
  const categories = useSelector(state => state.library.categories ||[])


  return {books,favorites,categories}
}
