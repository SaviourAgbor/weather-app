import { FaSearch } from "react-icons/fa";

function Search({search, setSearch, handleSearch}) {
  function handleKeyPress(e) {
  if (e.key === "Enter") {
    handleSearch(); // call the search function you passed as prop
  }
}
  
  return (
    <div className=" h-[50px] w-full flex  gap-2 items-center justify-around">
      <input
        type="text"
        value={search}
        required
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyPress}
        name="search"
        className="w-full outline-none shadow-2xl bg-white/70 h-full rounded-xl p-2 text-xl font-bold text-black"
      />
      <button 
      onClick={handleSearch}
      className="rounded-full p-2 h-full shadow-2xl cursor-pointer  w-[20%] flex bg-white/70 items-center justify-center text-2xl text-black">
        <FaSearch />
      </button>
    </div>
  );
}

export default Search;
