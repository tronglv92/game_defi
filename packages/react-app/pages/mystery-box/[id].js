import React, { useContext, useState } from "react";

import { wrapper } from "../../store/store";
import { formatCurrency } from "../../helpers/helper";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getBoxByIdApi } from "../../store/box/boxApi";
import Image from "next/image";
import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import { Modal, notification } from "antd";
import { BigNumber } from "ethers";
import { PAYMENT_ERC20 } from "../../constants/key";
import { useDispatch, useSelector } from "react-redux";
import { getSignatureWhenBuyBox, updateNFT } from "../../store/box/boxSlice";
import { LOGIN_PATH, MARKETING_PATH } from "../../constants/path";
import { useContractReader } from "eth-hooks";
import { DECIMAL, STATE_NFT } from "../../constants/constant";
import ButtonLoading from "../../components/Views/ButtonLoading";

function DetailMysteryBox({ web3, box }) {
  const { writeContracts, readContracts, yourAccount, setShowModalLogin, tx } = web3;
  const [isLoadBuyBox, setIsLoadBuyBox] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const onClickBuyItem = async () => {
    if (yourAccount) {
      if (writeContracts && readContracts) {
        setIsLoadBuyBox(true);

        const id = box.id;

        // const price = BigNumber.from(box.nft.price).mul(BigNumber.from(10).pow(18));

        const price = box.nft.price;
        const priceBigNumber = BigNumber.from(price).mul(BigNumber.from(10).pow(DECIMAL));

        // CHECK BALANCE OF ACCOUNT
        const balance = await readContracts.TrongCoin.balanceOf(yourAccount);
        let balanceResult = balance.div(BigNumber.from(10).pow(DECIMAL));
        console.log("balanceResult ", balanceResult.toNumber());
        if (balanceResult.toNumber() < price) {
          notification.error({
            message: "Transaction Fail",
            description: "You don't have enough balance to make transaction",
          });
          setIsLoadBuyBox(false);
          return;
        }

        // GENERATE SIGNATURE FROM BACKEND
        dispatch(
          getSignatureWhenBuyBox({
            params: {
              id: id,
              user: yourAccount,
              price: price,
              paymentErc20: readContracts.TrongCoin.address,
            },
            onSuccess: async data => {
              const signature = data.signature;
              if (signature) {
                // CHECK ALLOW OFF ACCOUNT
                const validBuy = await approveERC20(price, priceBigNumber);
                if (validBuy) {
                  // BUY BOX WITH SIGNATURE
                  const result = await buyBox(id, priceBigNumber, signature);
                  console.log("result ", result);
                  if (result && result.hash) {
                    updateNFTWhenBuy(id, result.hash, yourAccount);
                  }
                }
              } else {
                setIsLoadBuyBox(false);
                notification.error({ message: "Error", description: "Generate Signature is error!" });
              }
            },
            onError: err => {
              setIsLoadBuyBox(false);
            },
          }),
        );
      } else {
        notification.error({ message: "Error", description: "writeContracts is null" });
      }
    } else {
      router.push(LOGIN_PATH);
    }
  };

  const approveERC20 = async (price, priceBigNumber) => {
    const allow = await readContracts.TrongCoin.allowance(yourAccount, readContracts.TrongCoin.address);
    const allowResult = allow / Math.pow(10, DECIMAL);

    let validBuy = true;
    if (allowResult < price) {
      validBuy = false;
      // APPROVE ERC20 ACCOUNT
      const approve = await tx(writeContracts.TrongCoin.approve(readContracts.BoxHub.address, priceBigNumber));
      if (approve && approve.hash) {
        validBuy = true;
      }
    }
    if (!validBuy) {
      setIsLoadBuyBox(false);
    }
    return validBuy;
  };

  const buyBox = async (id, priceBigNumber, signature) => {
    const result = await tx(
      writeContracts.BoxHub.buyBoxWithSignature(id, priceBigNumber, readContracts.TrongCoin.address, signature),
    );
    if (!result) {
      setIsLoadBuyBox(false);
    }
    return result;
  };
  const updateNFTWhenBuy = (boxId, hash, buyer) => {
    dispatch(
      updateNFT({
        params: {
          id: boxId,
          state: STATE_NFT.Game,
          hashNFT: hash,
          buyer: buyer,
        },
        onSuccess: data => {
          setIsLoadBuyBox(false);
          showDialogSucces();
        },
        onError: err => {
          notification.error({
            message: "Message",
            description: err,
          });
          setIsLoadBuyBox(false);
        },
      }),
    );
  };
  const showDialogSucces = () => {
    Modal.success({
      content: "Buy Box success",
      onOk() {
        router.replace(MARKETING_PATH);
      },
    });
  };
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
                <span className="text-[25px] text-[rgba(255,255,255,0.8)] mt-5">Price</span>
                <span className="text-yellow-300 text-[30px] font-bold mt-5">
                  {box.nft ? formatCurrency(box.nft.price) : "0"} KWS
                  <span className="text-white text-[25px] font-semibold">≈ $ 6.32</span>
                </span>
                {box.nft.addressOwner && (
                  <span className="text-sm md:text-base text-white">Sold by: {box.nft.addressOwner}</span>
                )}
                <ButtonLoading text={"buy item"} isLoadBuyBox={isLoadBuyBox} onClick={onClickBuyItem} />
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
export default Web3Consumer(DetailMysteryBox);
