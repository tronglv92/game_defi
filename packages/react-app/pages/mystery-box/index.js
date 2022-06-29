import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { MYSTERY_BOX_DETAIL_PATH } from "../../constants/path";
function MysteryBox({ web3 }) {
  const items = [1, 2, 3, 4, 5, 6];
  const router = useRouter();
  const onClickBox = (item, index) => {
    router.push({
      pathname: MYSTERY_BOX_DETAIL_PATH,
    });
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-8">
        <div className="flex justify-between border-b-[1px] border-b-[rgba(51,51,51,1)]">
          <span className="uppercase text-white text-lg md:text-xl font-extrabold pb-2 "> Resold by User </span>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-5 ">
          {items.map((item, index) => {
            return (
              <div
                className="bg-[#c4c4c429] rounded-[4px] p-5 w-full md:max-w-[315px] cursor-pointer"
                onClick={() => {
                  onClickBox(item, index);
                }}
              >
                <div className="flex justify-between">
                  <span
                    className="text-sm font-semibold px-2 py-0 border-[1px]
                 border-solid rounded-sm  text-white"
                  >
                    Silver Box
                  </span>
                  <div className="flex items-center">
                    <img src="/ic-silver-box.png" className="mr-1 h-[18px]" />
                    <span className="text-white text-[15px] font-semibold">x1</span>
                  </div>
                </div>
                <img src="/silver-box.png" className="h-[200px] mx-auto mt-5" />
                <div className="flex flex-col mt-5 items-end">
                  <span className="text-white text-sm font-semibold">2,500.00 KWS</span>
                  <span className="text-[rgba(255,255,255,0.8)] text-sm">= $7.26</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default MysteryBox;
