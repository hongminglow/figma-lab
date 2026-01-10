import "./App.css";
import { AnimatedVersusBar } from "./component/AnimatedVersusBar";
import { CountDownTimer } from "./component/CountDownTimer";

function App() {
  return (
    <div className="bg-black h-screen px-3 py-5">
      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-500 to-red-500">
        FIGMA LABORATORY
      </h1>

      <div className="flex items-center space-x-6">
        <button className="bg-linear-to-r border border-[#FFFFFF4D] from-[#008F26] to-[#0A6422] px-1 py-0.5 rounded-[29px] font-semibold text-white text-sm">
          Refresh
        </button>

        {/* Glass Button - Gradient border wrapper */}
        <div
          className="glass-button relative backdrop-blur-[3px] size-8 rounded-[10px] flex items-center justify-center text-white font-medium"
          style={{
            boxShadow:
              "2.81px 2.81px 1.58px -4px #FFFFFF inset, -2.11px -2.11px 0.6px -2.46px #FFFFFF inset",
          }}
        >
          1
        </div>

        <div className="size-8 bg-white/16 rounded-[10px] shadow-[0_0_0_2px_#fff,0_0_0_4px_#fb64b6]" />

        <div className="size-8 bg-white/16 rounded-[10px] outline-[#fb64b6] outline-4 ring-2 ring-offset-4 ring-[--linear-gradient-red-blue]" />

        <div className="silver-corner-btn" />

        <button
          className="size-8 rounded-[10px] shadow-[2.81px_2.81px_1.58px_-4px_#FFFFFF_inset,-2.11px_-2.11px_0.6px_-2.46px_#FFFFFF_inset]"
          style={{
            background:
              "linear-gradient(58.52deg, #c6314d 22.37%, #2a2aeb 87.66%)",
          }}
        >
          2
        </button>
      </div>

     <AnimatedVersusBar />

      <div className="multi-blue-layer-btn" />

      <div className="gradient-border-container flex-col mt-4 bg-[#1A1E24] px-2.5 py-4 rounded-[10px] drop-shadow-[0px_3px_5px_0px_#00000066] shadow-[0px_1px_1px_0px_#FFFFFF4D_inset] flex items-center justify-center">
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

      <CountDownTimer />
    </div>
  );
}

export default App;
