import React, { useContext, useState, useEffect } from "react";

import { wrapper } from "../../store/store";
import { formatCurrency } from "../../helpers/helper";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getBoxByIdApi } from "../../store/box/boxApi";
import Image from "next/image";
import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import { notification } from "antd";
import { BigNumber } from "ethers";
import { PAYMENT_ERC20 } from "../../constants/key";
import { useDispatch, useSelector } from "react-redux";
import { getBoxById, getSignatureWhenBuyBox } from "../../store/box/boxSlice";
import { LOGIN_PATH, MY_BOXES_PATH } from "../../constants/path";
import { useContractReader } from "eth-hooks";
import { DECIMAL } from "../../constants/constant";
import ButtonLoading from "../../components/Views/ButtonLoading";
import withAuth from "../../helpers/withAuth";

function DetailMyBox({ web3 }) {
  const { writeContracts, readContracts, yourAccount, setShowModalLogin, tx } = web3;
  const [isLoadBuyBox, setIsLoadBuyBox] = useState(false);
  const [box, setBox] = useState(false);
  // balance = useContractReader(readContracts, "ThetanCoin", "balanceOf", [yourAccount]);
  // allow = useContractReader(readContracts, "ThetanCoin", "allowance", [yourAccount, readContracts.ThetanCoin.address]);
  const router = useRouter();
  const dispatch = useDispatch();
  const queryKey = "id";
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      dispatch(
        getBoxById({
          params: { id: id },
          onSuccess: data => {
            setBox(data.item);
          },
          onError: err => {
            notification.error({
              message: "Error",
              description: err,
            });
          },
        }),
      );
    }
  }, [id]);
  const onOpenBox = async () => {};
  return (
    <>
      <div className="py-5 md:py-[50px] max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between ">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              router.replace(MY_BOXES_PATH);
            }}
          >
            <LeftOutlined style={{ color: "#FFC700", fontSize: "30px", fontWeight: "bold" }} />
            <span className="text-[#FFC700] text-3xl ml-2">Back</span>
          </div>
          {/* <div className="rounded border-[1px] border-[#FFC700] pl-2 pr-2 pt-1 pb-1">
            <span className="text-[#FFC700] text-base">VIEW TRANSACTION HISTORY</span>
          </div> */}
        </div>
        {box ? (
          <div className="flex flex-col">
            <div className="mt-5 md:mt-[80px] grid md:grid-cols-2 gap-[2%]">
              <div
                className="bg-[url('/item-detail-bg.png')] max-w-full bg-center bg-no-repeat 
          py-20 px-16 md:max-w-[720px] md:mr-20 flex justify-center"
                style={{ backgroundSize: "100% 100%" }}
              >
                <Image className="mx-auto" height={200} width={200} src={box.img} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-3xl md:text-[40px] text-white">{box.name}</span>
                <div className="flex items-center mt-5">
                  <span className="text-white text-[25px] border-[#F7AE4E] border-[1px] border-solid rounded-[4px] px-5 py-1">
                    ID #{box.id}
                  </span>
                </div>

                {box.nft.addressOwner && (
                  <span className="text-sm md:text-base text-white mt-5">Owner by: {box.nft.addressOwner}</span>
                )}
                <ButtonLoading text={"Open Box"} isLoadBuyBox={isLoadBuyBox} onClick={onOpenBox} />
              </div>
            </div>
            <div className="mt-20 border-[#F7AE4E] border-[1px] border-solid rounded-[10px] p-8">
              <span _ngcontent-vfl-c56="" className="text-yellow-500 text-xl md:text-[30px] font-bold ">
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
          <div className="flex items-center justify-center w-full mt-16 "></div>
        )}
      </div>
    </>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(store => async context => {});
export default Web3Consumer(withAuth(DetailMyBox));
