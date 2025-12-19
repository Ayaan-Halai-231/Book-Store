import React,{ useState, useEffect } from 'react'
import axios from 'axios'
import BookCard from '../BookCard/BookCard'

function Favourites() {
  const [ FavouriteBooks, setFavouriteBooks] = useState()
  const headers ={
    id:localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  }
  useEffect(() => {
    const fetch = async () =>{
      const response = await axios.get('https://bookstore-api.onrender.com/api/v1/get-favourite-books',{headers})
      setFavouriteBooks(response.data.data);
      console.log(response.data.data);
    }
    fetch()
  },[])
  

  return (
    <>
      {FavouriteBooks && FavouriteBooks.length === 0 && (
        <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center flex-col w-full">
          No Favourite Books
          <img src="https://cdn-icons-png.freepik.com/512/8875/8875695.png" alt="star" className="h-[20%] my-8" />
        </div>
      ) }
      <div className="grid grid-cols-4 gap-4">
        {FavouriteBooks &&
          FavouriteBooks.map((item,i)=>(
            <div key={i}>
              <BookCard data={item} favourite={true} />
            </div>
        ))}
      </div>
    </>
  )
}

export default Favourites