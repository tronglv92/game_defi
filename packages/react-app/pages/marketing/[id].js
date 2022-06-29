import React, { useContext, useState } from "react";

import { Rate } from "antd";

import staff from "../../public/staff.svg";

import { LeftOutlined } from "@ant-design/icons";

function DetailWeapon({ web3 }) {
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
        <div className="mt-8 md:mt-20 grid md:grid-cols-2 gap-10">
          <div sm={24} md={12} className="max-w-lg w-full mx-auto ">
            <div className="flex w-full justify-between ">
              <span
                className="bg-[url('/price-bg.png')] w-[160px] h-[40px] md:w-[165px] md:h-[56px] flex items-center 
              justify-center text-base md:text-lg font-extrabold text-[#FFE368]"
                style={{ backgroundSize: "100% 100%" }}
              >
                400.00 KWS
              </span>
              <span
                className="bg-[url('/price-bg.png')] w-[160px] h-[40px] md:w-[165px] md:h-[56px] flex items-center
               justify-center text-base md:text-lg font-extrabold text-[rgba(33, 11, 6, 0.87)]"
                style={{ backgroundSize: "100% 100%" }}
              >
                $1.31
              </span>
            </div>
            <img className="max-w-[250px] mx-auto" src="/staff.png" />
            <img src="/stone-shelf.png" className="mx-auto max-w-full"></img>
            <div className="text-center mt-10">
              <button className="uppercase text-[16px] bg-[url('/sell-buy.png')]  w-[319px] h-[60px] text-[#FFC700] font-bold">
                buy this item
              </button>
            </div>
          </div>
          <div>
            {/* ABOUT */}
            <div
              className="bg-[url('/item-detail-bg.png')] bg-center bg-no-repeat px-10 md:px-20 py-16 relative"
              style={{ backgroundSize: "100% 100%" }}
            >
              <span
                className="flex justify-center items-center uppercase text-[16px] bg-[url('/sell-buy.png')] 
              border-none bg-no-repeat bg-center bg-contain w-[268px] h-[50px] text-white 
              absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 font-bold"
              >
                about
              </span>
              <div className="flex">
                <div className="flex flex-1 items-center">
                  <span className="text-[#F3D29C] text-[17px] font-bold w-24">Type</span>
                  <img src={staff.src} />
                </div>
                <div className="flex flex-1 items-center">
                  <span className="text-[#F3D29C] text-[17px] font-bold w-24">Level</span>
                  <span className="text-white font-bold text-base">12</span>
                </div>
              </div>
              <div className="mt-8 flex ">
                <div className="flex flex-1 items-center">
                  <span className="text-[#F3D29C] text-[17px] font-bold w-24">ID</span>
                  <span className="text-white font-bold text-base">#1001905</span>
                </div>
                <div className="flex flex-1 items-center">
                  <span className="text-[#F3D29C] text-[17px] font-bold w-24">Star</span>
                  <Rate count={1} value={1} style={{ fontSize: "16px" }} />
                </div>
              </div>
            </div>
            {/* STAT */}
            <div
              className="bg-[url('/item-detail-bg.png')] bg-center bg-no-repeat px-10 md:px-20 
              py-16 relative mt-20"
              style={{ backgroundSize: "100% 100%" }}
            >
              <span
                className="flex justify-center items-center uppercase text-[16px] bg-[url('/sell-buy.png')] 
              border-none bg-no-repeat bg-center bg-contain w-[268px] h-[50px] text-white 
              absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 font-bold"
              >
                stat
              </span>
              <div className="flex justify-around">
                <div>
                  <span className="text-[#F3D29C] text-[17px] font-bold">Damage</span>
                  <div className="mt-5 flex">
                    <img src="/ic-dmg.png" className="mr-2"></img>
                    <span _ngcontent-njy-c37="" class="text-white text-base font-bold">
                      309.69
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[#F3D29C] text-[17px] font-bold">Speed</span>
                  <div className="mt-5 flex">
                    <img src="/ic-speed.png" className="mr-2"></img>
                    <span className="text-white text-base font-bold">1.03</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#F3D29C] text-[17px] font-bold">Hp</span>
                  <div className="mt-5 flex">
                    <img src="/ic-hp.png" className="mr-2"></img>
                    <span className="text-white text-base font-bold">2024.64</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#F3D29C] text-[17px] font-bold">Critical</span>
                  <div className="mt-5 flex">
                    <img src="/ic-critical.png" className="mr-2"></img>
                    <span className="text-white text-base font-bold">21.09</span>
                  </div>
                </div>
              </div>
            </div>
            {/* ABILITIES */}
            <div
              className="bg-[url('/item-detail-bg.png')] bg-center bg-no-repeat px-10 md:px-20 
              py-16 relative mt-20"
              style={{ backgroundSize: "100% 100%" }}
            >
              <span
                className="flex justify-center items-center uppercase text-[16px] bg-[url('/sell-buy.png')] 
              border-none bg-no-repeat bg-center bg-contain w-[268px] h-[50px] text-white 
              absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 font-bold"
              >
                abilities
              </span>
              <div className="mt-5 flex">
                <img className="mr-5 max-w-[70px]" src="https://static.knightwar.io/skills/2.png"></img>
                <div className="flex-1 flex-col">
                  <div className="flex justify-between align-middle">
                    <span className="text-[#F3D29C] text-[17px] font-extrabold flex justify-between ">Explosive </span>
                    <span className="text-base font-bold text-[#ffc69ba3]">Level 1</span>
                  </div>
                  <span className="text-white text-sm md:text-base font-bold">
                    Have 40% explore when attack. Range explore 1 damage 50%{" "}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex">
                <img className="mr-5 max-w-[70px]" src="https://static.knightwar.io/skills/6.png"></img>
                <div className="flex-1 flex-col">
                  <div className="flex justify-between align-middle">
                    <span className="text-[#F3D29C] text-[17px] font-extrabold flex justify-between ">Icy </span>
                    <span className="text-base font-bold text-[#ffc69ba3]">Level 2</span>
                  </div>
                  <span className="text-white text-sm md:text-base font-bold flex-1">
                    Have 100% slow when attack. Slow 45%, slow time 2.5s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default DetailWeapon;
