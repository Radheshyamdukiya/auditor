/* eslint-disable no-unused-vars */
import { Star } from "lucide-react";
import { useState } from "react";

function Rating_Component({ title, handlesubmit }) {
  const totalStar = 5;
  const [rating, setRating] = useState(-1);
  const [hover, setHover] = useState(-1);

  function updaterating(val) {
    setRating(val);
    handlesubmit(title, val);
  }

  return (
    <div className="flex flex-col space-y-3 group bg-white p-4 rounded-xl border border-transparent hover:border-gray-100 hover:shadow-sm transition-all">
      <p className="text-sm font-bold text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">
        {title}
      </p>
      <div className="flex items-center gap-3">
        {[...Array(totalStar)].map((_, idx) => {
          const starValue = idx + 1;
          const isActive = starValue <= (hover !== -1 ? hover : rating);

          return (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => updaterating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(-1)}
                className="relative transition-transform duration-200 hover:scale-125 focus:outline-none"
              >
                <Star
                  size={24}
                  strokeWidth={isActive ? 0 : 2}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                      : "text-gray-300"
                  }`}
                />
              </button>
              <span className={`text-[10px] font-bold transition-colors ${
                starValue === rating ? "text-indigo-600" : "text-gray-400"
              }`}>
                {starValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Rating_Component;