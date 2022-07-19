import React, { useContext, useState } from "react";

import { wrapper } from "../../store/store";
import { formatCurrency } from "../../helpers/helper";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getBoxByIdApi } from "../../store/box/boxApi";
import Image from "next/image";
function DetailMysteryBox({ web3, box }) {
  const router = useRouter();

  return (
    <>
      <div className="py-5 md:py-[50px] max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between ">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              router.replace("/mystery-box");
            }}
          >
            <LeftOutlined style={{ color: "#FFC700", fontSize: "30px", fontWeight: "bold" }} />
            <span className="text-[#FFC700] text-3xl ml-2">Back</span>
          </div>
          <div className="rounded border-[1px] border-[#FFC700] pl-2 pr-2 pt-1 pb-1">
            <span className="text-[#FFC700] text-base">VIEW TRANSACTION HISTORY</span>
          </div>
        </div>
        {box ? (
          <div className="flex flex-col">
            <div className="mt-5 md:mt-[80px] grid md:grid-cols-2 gap-[2%]">
              <div
                className="bg-[url('/item-detail-bg.png')] max-w-full bg-center bg-no-repeat 
          py-20 px-16 md:max-w-[720px] md:mr-20"
                style={{ backgroundSize: "100% 100%" }}
              >
                <Image className="mx-auto" height={200} width={200} src={box.img} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-3xl md:text-[40px] text-white">{box.name}</span>
                <div className="flex items-center mt-5">
                  <span class="text-white text-[25px] border-[#F7AE4E] border-[1px] border-solid rounded-[4px] px-5 py-1">
                    ID #{box.id}
                  </span>
                </div>
                <span className="text-[25px] text-[rgba(255,255,255,0.8)] mt-5">Price</span>
                <span className="text-yellow-300 text-[30px] font-bold mt-5">
                  {box.nft ? formatCurrency(box.nft.price) : "0"} KWS
                  <span className="text-white text-[25px] font-semibold">≈ $ 6.32</span>
                </span>
                {box.nft.addressOwner && (
                  <span className="text-sm md:text-base text-white">Sold by: {box.nft.addressOwner}</span>
                )}
                <button className="uppercase bg-yellow-500 text-black border-[1px] border-[#F7AE4E] border-solid text-[25px] px-5 rounded-[4px] font-kidgame mt-8 py-1">
                  buy this item
                </button>
              </div>
            </div>
            <div class="mt-20 border-[#F7AE4E] border-[1px] border-solid rounded-[10px] p-8">
              <span _ngcontent-vfl-c56="" class="text-yellow-500 text-xl md:text-[30px] font-bold ">
                {" "}
                Product description{" "}
              </span>
              <div className=" border-[1px] border-[#3F3F3F] border-solid mt-4" />
              <p className="text-white text-[20px] mt-5">Containing 1 Random NFT Weapon:</p>
              {box.itemInBoxes.map((item, index) => {
                return (
                  <p className="text-white text-[20px] " key={index}>
                    Chance for {item.level}-star: {item.percent}%
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full mt-16 ">
            <span className="text-white text-3xl">Box not exists</span>
          </div>
        )}
      </div>
    </>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const { params } = context;
  const { id } = params;
  if (id != "requestProvider.js.map") {
    const result = await getBoxByIdApi({ id: id });

    console.log("Detail Box result ", result);
    return {
      props: {
        box: result.data.item,
      },
    };
  }
});
export default DetailMysteryBox;
