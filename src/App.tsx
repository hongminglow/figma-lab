import "./App.css";

function App() {
  return (
    <div className="bg-black h-screen px-3 py-5">
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-500 to-red-500">
        FIGMA LABORATORY
      </h1>

      <button className="bg-linear-to-r border border-[#FFFFFF4D] from-[#008F26] to-[#0A6422] px-1 py-0.5 rounded-[29px] font-semibold text-white text-sm">
        Refresh
      </button>

      <div className="flex-col mt-4 bg-[#1A1E24] px-2.5 py-4 rounded-[10px] drop-shadow-[0px_3px_5px_0px_#00000066] shadow-[0px_1px_1px_0px_#FFFFFF4D_inset] flex items-center justify-center">
        <div className="grid grid-cols-5 w-full p-2 gap-1.5 bg-linear-to-b rounded-lg from-[rgba(33,32,32,0.6)] to-[rgba(22,22,22,0.6)]">
          <span className="col-span-5 text-white place-self-center">1:8</span>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="py-[18px] opacity-90 rounded-lg flex items-center justify-center text-black font-bold"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(33, 32, 32, 0.6) 0%, rgba(22, 22, 22, 0.6) 100%), linear-gradient(180deg, #B2B2B1 0%, #999897 100%)",
              }}
            >
              <span className="text-white font-semibold text-lg">{index}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 w-full mt-3 gap-2">
          <button className=" text-white bg-linear-to-b from-[#4577E9] to-[#0A46A7] py-2.5 rounded-lg relative overflow-hidden blended-even-inside">
            <div className="flex flex-col space-y-1">
              <span>Even</span>
              <span>1:1.9</span>
            </div>
          </button>

          <button className="text-white bg-linear-to-b from-[#F12216] to-[#7C150D] py-2.5 rounded-lg relative blended-odd-inside">
            <div className="flex flex-col space-y-1">
              <span>Odd</span>
              <span>1:1.9</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
