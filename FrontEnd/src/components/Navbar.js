import React, { useEffect, useState,useRef } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hiddenFileInput = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const donwloadBooks = () => {
    const url = "/api/csvtojson";
    window.open(url);
  };
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileInput = async (event) => {
    var formdata = new FormData();
    formdata.append("file", event.target.files[0]);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("/api/uploadcsvFile", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
      window.location.reload(false);
  };
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Book Store</span>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          onClick={toggleMenu}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="text-sm lg:flex-grow"></div>
        <div>
          <a
            href="#"
            target="_blank"
            className="inline-block text-sm px-4 py-2 m-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            onClick={donwloadBooks}
          >
            Download
          </a>

          <a
            href="#"
            onClick={handleClick}
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          >
            <input
              className="d-none"
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleFileInput}
              type={"file"}
              accept={".csv"}
            />
            Add Books
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
