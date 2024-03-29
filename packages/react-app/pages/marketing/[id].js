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
import { getSignatureMintWeapon, updateMintWeapon } from "../../store/weapon/weaponSlice";
import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import { DECIMAL, STATE_NFT } from "../../constants/constant";
import { BigNumber } from "ethers";
function DetailWeapon({ web3, weapon }) {
  const { readContracts, yourAccount, writeContracts, tx } = web3;
  const [isLoadBuyBox, setIsLoadBuyBox] = useState(false);
  console.log("weapon ", weapon);
  console.log("readContracts ", readContracts);
  const router = useRouter();
  const dispatch = useDispatch();
  const onPressWeapon = () => {
    if (yourAccount && writeContracts && readContracts) {
      if (weapon.nft && weapon.nft.minted) {
        onBuyWeapon();
      } else {
        onMintWeapon();
      }
    } else {
      router.push(LOGIN_PATH);
    }
  };
  const onMintWeapon = async () => {
    const { id } = weapon;
    const price = weapon.nft.price;
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
    //GENERATE SIGNATURE FROM BACKEND
    const nftAddress = readContracts.NftWeapon.address;
    const paymentErc20 = readContracts.TrongCoin.address;
    dispatch(
      getSignatureMintWeapon({
        params: {
          id: id,
          price: price,
          paymentErc20: paymentErc20,
          nftAddress: nftAddress,
          buyer: yourAccount,
        },
        onSuccess: async data => {
          const { signature, saltNonce } = data;
          if (signature) {
            // CHECK ALLOW OFF ACCOUNT
            const validBuy = await approveERC20(price, priceBigNumber);
            if (validBuy) {
              // BUY BOX WITH SIGNATURE
              const result = await mintWeapon({
                id: id,
                nftAddress: nftAddress,
                paymentErc20: paymentErc20,
                buyer: yourAccount,
                saltNonce: saltNonce,
                priceBigNumber: priceBigNumber,
                signature: signature,
              });
              console.log("result ", result);
              if (result && result.hash) {
                //UPDATE NFT WEAPON WHEN MINT SUCCESS
                updateNFTWhenMinted(id, result.hash, true, yourAccount);
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
  };

  const onBuyWeapon = () => {};
  const approveERC20 = async (price, priceBigNumber) => {
    const allow = await readContracts.TrongCoin.allowance(yourAccount, readContracts.TrongCoin.address);
    const allowResult = allow / Math.pow(10, DECIMAL);

    let validBuy = true;
    if (allowResult < price) {
      validBuy = false;
      // APPROVE ERC20 ACCOUNT
      const approve = await tx(writeContracts.TrongCoin.approve(readContracts.Marketplace.address, priceBigNumber));
      if (approve && approve.hash) {
        validBuy = true;
      }
    }
    if (!validBuy) {
      setIsLoadBuyBox(false);
    }
    return validBuy;
  };
  const mintWeapon = async params => {
    console.log("mintWeapon params ", params);
    const { id, nftAddress, paymentErc20, buyer, saltNonce, priceBigNumber, signature } = params;

    const addresses = [nftAddress, paymentErc20, buyer];
    const values = [id, priceBigNumber, saltNonce];
    const result = await tx(writeContracts.Marketplace.mintWithSignatures(addresses, values, signature));
    if (!result) {
      setIsLoadBuyBox(false);
    }
    return result;
  };
  const updateNFTWhenMinted = async (weaponId, hash, minted, buyer) => {
    dispatch(
      updateMintWeapon({
        params: {
          id: weaponId,
          state: STATE_NFT.Game,
          hashNFT: hash,
          minted: minted,
          buyer: buyer,
        },
        onSuccess: data => {
          setIsLoadBuyBox(false);
          showDialogMintSucces();
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
  const showDialogMintSucces = () => {
    Modal.success({
      content: "Mint Weapon success",
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
              <div className="flex w-full justify-between mb-5">
                <span
                  className="bg-[url('/price-bg.png')] w-[160px] h-[40px] md:w-[165px] md:h-[56px] flex items-center 
              justify-center text-base md:text-lg font-extrabold text-[#FFE368] mx-auto"
                  style={{ backgroundSize: "100% 100%" }}
                >
                  {weapon.nft ? formatCurrency(weapon.nft.price) : 0} KWS
                </span>
                {/* <span
                className="bg-[url('/price-bg.png')] w-[160px] h-[40px] md:w-[165px] md:h-[56px] flex items-center
               justify-center text-base md:text-lg font-extrabold text-[rgba(33, 11, 6, 0.87)]"
                style={{ backgroundSize: "100% 100%" }}
              >
                $1.31
              </span> */}
              </div>
              <Image className="max-w-[250px] mx-auto object-contain" src={weapon.img} height="300" width="300" />
              <img src="/stone-shelf.png" className="mx-auto max-w-full"></img>
              <div className="text-center mt-10">
                <button
                  className="uppercase text-[16px] bg-[url('/sell-buy.png')]  w-[319px] h-[60px] text-[#FFC700] font-bold"
                  onClick={onPressWeapon}
                >
                  {weapon.nft && weapon.nft.minted ? "Buy" : "Mint"}
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
                        <Image className="object-contain " src={ability.img} height="70" width="70" />
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
export default Web3Consumer(DetailWeapon);
