
import React, { useContext, useState } from "react";



import { LeftOutlined } from "@ant-design/icons";


function DetailMysteryBox({ web3 }) {
  const items = [1, 2, 3, 4, 5, 6];
  return (
    <>
      <div className="py-5 md:py-[50px] max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <LeftOutlined style={{ color: "#FFC700", fontSize: "30px", fontWeight: "bold" }} />
            <span className="text-[#FFC700] text-3xl ml-2">Back</span>
          </div>
          <div className="rounded border-[1px] border-[#FFC700] pl-2 pr-2 pt-1 pb-1">
            <span className="text-[#FFC700] text-base">VIEW TRANSACTION HISTORY</span>
          </div>
        </div>
        <div className="mt-5 md:mt-[80px] grid md:grid-cols-2 gap-[2%]">
          <div
            className="bg-[url('/item-detail-bg.png')] max-w-full bg-center bg-no-repeat 
          py-20 px-16 md:max-w-[720px] md:mr-20"
            style={{ backgroundSize: "100% 100%" }}
          >
            <img className="mx-auto" src="/silver-box.png"></img>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl md:text-[40px] text-white">Silver Box</span>
            <div className="flex items-center mt-5">
              <div
                className="text-white text-[25px] flex items-center mr-5 px-5 
              pr-0 py-1 border-[#F7AE4E] border-[1px] border-solid rounded-[4px]"
              >
                <img src="/ic-silver-box.png" alt="" class="mr-2"></img>
                <span class="text-white text-[25px] min-w-[30px] text-center ">1</span>
              </div>
              <span class="text-white text-[25px] border-[#F7AE4E] border-[1px] border-solid rounded-[4px] px-5 py-1">
                ID #420
              </span>
            </div>
            <span className="text-[25px] text-[rgba(255,255,255,0.8)] mt-5">Price</span>
            <span className="text-yellow-300 text-[30px] font-bold mt-5">
              {" "}
              2250.0 KWS<span className="text-white text-[25px] font-semibold">≈ $ 6.32</span>
            </span>
            <span className="text-sm md:text-base text-white">Sold by: 0x31B3E620E67AF608e5500BF24c0706C8D303556a</span>
            <button className="uppercase bg-yellow-500 text-black border-[1px] border-[#F7AE4E] border-solid text-[25px] px-5 rounded-[4px] font-kidgame mt-8 py-1">
              {" "}
              buy this item{" "}
            </button>
          </div>
        </div>
        <div class="mt-20 border-[#F7AE4E] border-[1px] border-solid rounded-[10px] p-8">
          <span _ngcontent-vfl-c56="" class="text-yellow-500 text-xl md:text-[30px] font-bold ">
            {" "}
            Product description{" "}
          </span>
          <div className=" border-[1px] border-[#3F3F3F] border-solid mt-4" />
          <p className="text-white text-[20px] mt-5">
            Containing 1 Random NFT Weapon: <br />
            Chance for 1-star: 65% <br />
            Chance for 2-star: 30% <br />
            Chance for 3-star: 5%
          </p>
        </div>
      </div>
    </>
  );
}
export default DetailMysteryBox;
