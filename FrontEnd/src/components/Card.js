import React from "react";

function Card({
  bookname,
  btnText = "visit me",
  author_name,
  img_src,
  orders,
  price,
  _id,
  getBooksList
})

{

const deleteBook=async ()=>{
  console.log(_id)
  var requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };
  
  fetch(`http://localhost:5000/api/delete/${_id}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    getBooksList()
}

  return (
    <div className="max-w-sm p-5 border m-5 rounded overflow-hidden shadow-lg">
      <button type="button" onClick={deleteBook} class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
      <div className="image-container">
        <img
          src={img_src}
          alt={bookname}
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{bookname}</div>
        <p className="text-gray-700">Author: <span className="font-semibold text-teal-500">{author_name}</span></p>
        <p className="text-gray-700">Orders: <span className="font-semibold text-teal-500">{orders}</span></p>
        <p className="text-gray-700">Price: <span className="font-semibold text-teal-500">₹{price}</span></p>
      </div>
    </div>
  );
}

export default Card;
