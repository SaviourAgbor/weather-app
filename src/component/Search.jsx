import { FaSearch } from "react-icons/fa";

function Search({ search, setSearch, handleSearch, loading, weatherData }) {
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleSearch(); // call the search function you passed as prop
    }
  }

  return (
    <div className={`${loading ? 'hidden' : 'h-[50px] w-full flex gap-2 items-center justify-around'}`}>
      {/* <div
        className={`${
          loading || weatherData?.cod !== 200
            ? "hidden"
            : "h-[60dvh] w-[100dvh]  md:block md:w-[40dvw] top-10  shadow-[0_0_30px_10px_rgba(2,0,0,0.3)] rounded-b-xl z-10 bg-white/10 absolute mx-autoo"}`}></div> */}
      <div className={`${
          loading || weatherData?.cod !== 200 ? 'hidden' : "h-[0dvh] w-[50dvw] animate-pulse z-20 shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] rounded-b-full bg-white/10 absolute left-0"}`}></div>
      

      <input
        type="text"
        value={search}
        required
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyPress}
        name="search"
        className="w-full outline-none z-90 shadow-[0_0_8px_1px_rgba(0,0,0,0.3)]  bg-white h-full rounded-xl p-4 text-xl font-bold text-black"
      />
      <button
        onClick={handleSearch}
        className="rounded-xl z-50 p-2 h-full shadow-[0_0_8px_1px_rgba(0,0,0,0.3)] cursor-pointer  w-[20%] flex bg-white/70 items-center justify-center text-2xl text-black"
      >
        <FaSearch />
      </button>
    </div>
  );
}

export default Search;
