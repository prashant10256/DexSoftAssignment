// import react from ("react")
import Card from "./components/Card";
import Navbar from "./components/Navbar";

import { useState,useEffect } from "react";

function App() {
  
let [booksList, setbooksList] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      try{
  
        const response = await fetch("http://localhost:5000/api/details")
        const json = await response.json();
        setbooksList(json)
        console.log(json);
        
      }catch(error){
        console.log("error",error);
      }
    }
    fetchData()
  }, [])

  const getBooksList = async () => {
    try{

      const response = await fetch("/api/details")
      const json = await response.json();
      setbooksList(json)
      console.log(json);
      
    }catch(error){
      console.log("error",error);
    }
  }

  return (
    <>
      
<Navbar></Navbar>
  
      <div className="flex flex-wrap">{booksList.length>0 && booksList.map((obj) => (
 
 <Card 
className="mt-2 flex flex-row"
key={obj._id}
bookname={obj.book_name}
img_src={obj.book_image}
orders={obj.total_orders}
price={obj.price}
author_name={obj.author_name}
_id={obj._id}
getBooksList={getBooksList}
></Card>

))}</div>

    </>

  );


}
export default App;
