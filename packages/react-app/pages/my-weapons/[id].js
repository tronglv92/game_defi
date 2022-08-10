import React, { useContext, useState } from "react";

import { Modal, notification, Rate } from "antd";

import icStaff from "../../public/staff.svg";
import icSword from "../../public/ic-sword-small.svg";
import icBow from "../../public/ic-bow-small.svg";
import { useRouter } from "next/router";
import { LeftOutlined } from "@ant-design/icons";
import { getWeaponByIdApi } from "../../../react-app-admin/store/weapon/weaponApi";
import { wrapper } from "../../store/store";
import { formatCurrency } from "../../helpers/helper";
import Image from "next/image";
import { WEAPON_CLASS } from "../../constants/key";
import { LOGIN_PATH, MARKETING_PATH } from "../../constants/path";
import { useDispatch, useSelector } from "react-redux";

import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";

function DetailMyWeapon({ web3, weapon }) {
  console.log("weapon ", weapon);
  const { readContracts, yourAccount, writeContracts, tx } = web3;

  const router = useRouter();
  const dispatch = useDispatch();
  const onPressSellWeapon = () => {
    if (yourAccount && writeContracts && readContracts) {
      
    } else {
      router.push(LOGIN_PATH);
    }
  };

  return (
    <>
      <div className="py-5 md:py-[50px] max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between ">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              router.replace(MARKETING_PATH);
            }}
          >
            <LeftOutlined style={{ color: "#FFC700", fontSize: "30px", fontWeight: "bold" }} />
            <span className="text-[#FFC700] text-3xl ml-2">Back</span>
          </div>
          {/* <div className="rounded border-[1px] border-[#FFC700] pl-2 pr-2 pt-1 pb-1">
            <span className="text-[#FFC700] text-base">VIEW TRANSACTION HISTORY</span>
          </div> */}
        </div>
        {weapon ? (
          <div className="mt-8 md:mt-20 grid md:grid-cols-2 gap-10">
            <div sm={24} md={12} className="flex flex-col max-w-lg w-full mx-auto">
              <img className="max-w-[250px] mx-auto object-contain" src={weapon.img} />
              <img src="/stone-shelf.png" className="mx-auto max-w-full"></img>
              <div className="text-center mt-10">
                <button
                  className="uppercase text-[16px] bg-[url('/sell-buy.png')]  w-[319px] h-[60px] text-[#FFC700] font-bold"
                  onClick={onPressSellWeapon}
                >
                  Sell
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
              absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 font-bold "
                >
                  about
                </span>
                <div className="grid grid-cols-2 gap-15">
                  <div className="flex items-center">
                    <span className="text-[#F3D29C] text-[17px] font-bold w-24">Type</span>
                    <img
                      src={
                        weapon.type == WEAPON_CLASS.Sword
                          ? icSword.src
                          : weapon.type == WEAPON_CLASS.Bow
                          ? icBow.src
                          : icStaff.src
                      }
                    />
                  </div>
                  <div className="flex  items-center">
                    <span className="text-[#F3D29C] text-[17px] font-bold w-24">Level</span>
                    <span className="text-white font-bold text-base">{weapon.level}</span>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-15 ">
                  <div className="flex items-center">
                    <span className="text-[#F3D29C] text-[17px] font-bold w-24">ID</span>
                    <span className="text-white font-bold text-base">#{weapon.id}</span>
                  </div>
                  <div className="flex  items-center">
                    <span className="text-[#F3D29C] text-[17px] font-bold w-24">Star</span>
                    {weapon.star && <Rate count={weapon.star} value={weapon.star} style={{ fontSize: "16px" }} />}
                  </div>
                </div>
              </div>
              {/* STAT */}
              {weapon.itemStat && (
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
                  <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 justify-around">
                    <div className="mt-8">
                      <span className="text-[#F3D29C] text-[17px] font-bold ">Damage</span>
                      <div className="mt-2 flex">
                        <img src="/ic-dmg.png" className="mr-2"></img>
                        <span _ngcontent-njy-c37="" className="text-white text-base font-bold">
                          {weapon.itemStat.damage}
                        </span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <span className="text-[#F3D29C] text-[17px] font-bold ">Speed</span>
                      <div className="mt-2 flex">
                        <img src="/ic-speed.png" className="mr-2"></img>
                        <span className="text-white text-base font-bold"> {weapon.itemStat.speed}</span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <span className="text-[#F3D29C] text-[17px] font-bold mt-5">Hp</span>
                      <div className="mt-2 flex">
                        <img src="/ic-hp.png" className="mr-2"></img>
                        <span className="text-white text-base font-bold"> {weapon.itemStat.hp}</span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <span className="text-[#F3D29C] text-[17px] font-bold mt-5">Critical</span>
                      <div className="mt-2 flex">
                        <img src="/ic-critical.png" className="mr-2"></img>
                        <span className="text-white text-base font-bold"> {weapon.itemStat.critical}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ABILITIES */}
              {weapon.itemAbilities.length > 0 && (
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
                  {weapon.itemAbilities.map((ability, index) => {
                    return (
                      <div className="mt-5 flex" key={index}>
                        <Image className="object-contain min-w[70px]" src={ability.img} height="70" width="70" />
                        <div className="flex-1 flex-col ml-5">
                          <div className="flex justify-between align-middle">
                            <span className="text-[#F3D29C] text-[17px] font-extrabold flex justify-between ">
                              {ability.name}
                            </span>
                            <span className="text-base font-bold text-[#ffc69ba3]">Level {ability.level}</span>
                          </div>
                          <span className="text-white text-sm md:text-base font-bold">{ability.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const { params } = context;
  const { id } = params;
  if (id != "requestProvider.js.map") {
    const result = await getWeaponByIdApi({ id: id });

    console.log("Detail weapons result ", result);
    return {
      props: {
        weapon: result.data.item,
      },
    };
  }
});
export default Web3Consumer(DetailMyWeapon);
