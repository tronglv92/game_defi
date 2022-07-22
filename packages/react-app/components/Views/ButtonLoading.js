import React, { useContext, useState } from "react";

function ButtonLoading(props) {
  const { isLoadBuyBox, onClick, text } = props;
  return (
    <>
      <button
        className={`uppercase ${isLoadBuyBox ? "bg-yellow-200" : "bg-yellow-500"} text-black border-[1px]
                 border-[#F7AE4E] border-solid text-[25px] px-5 rounded-[4px]
                  font-kidgame mt-8 py-1 inline-flex items-center justify-center`}
        onClick={onClick}
        disabled={isLoadBuyBox}
      >
        {isLoadBuyBox && (
          <svg
            className="w-5 h-5 mr-3 -ml-1 text-white  animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {text}
      </button>
    </>
  );
}

export default ButtonLoading;
