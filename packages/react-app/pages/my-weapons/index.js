import { useContractReader } from "eth-hooks";
import React, { useContext, useEffect, useState } from "react";

import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";

import { Row, Pagination } from "antd";
import icStaff from "../../public/ic-staff-small.svg";

import { FilterOutlined } from "@ant-design/icons";

import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

import ItemMyWeapon from "../../components/Views/MyWeapons/ItemMyWeapon";

import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../../store/store";
import { getMyWeaponsApi } from "../../store/myWeapons/myWeaponsApi";
import { getMyWeapons, getMyWeaponsSuccess } from "../../store/myWeapons/myWeaponsSlice";
function MyWeapons({ web3 }) {
  console.log("web3 ", web3);
  const {
    readContracts,
    yourAccount,
    userSigner,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    writeContracts,
    price,
    tx,
  } = web3;

  const dispatch = useDispatch();
  const { weapons, limit, count } = useSelector(state => state.myWeapons);
  const [pageSelect, setPageSelect] = useState(1);
  console.log("weapons ", weapons);
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  // const number = useContractReader(readContracts, "YourContract", "number");

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const router = useRouter();
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  useEffect(() => {
    dispatch(
      getMyWeapons({
        page: 1,
        limit: limit,
      }),
    );
  }, []);

  const onChangePage = (page, pageSize) => {
    setPageSelect(page);
    dispatch(
      getMyWeapons({
        page: page,
        limit: pageSize,
      }),
    );
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-8 flex flex-col ">
        <div className="flex justify-between border-b-[1px] border-b-[rgba(51,51,51,1)]">
          <span className="uppercase text-white text-lg md:text-xl font-extrabold pb-2 "> My Weapons </span>
        </div>

        {/* List Weapon */}
        <div className="flex flex-col  flex-1 ">
          {/* <Row style={{ paddingLeft: "20px", paddingBottom: "20px" }} justify="space-between" align="middle">
            {isMobile && (
              <FilterOutlined
                style={{ fontSize: "25px", color: "white" }}
                onClick={onClickFilter}
                className="cursor-pointer"
              />
            )}
          </Row> */}

          <Row gutter={[16, 16]} style={{ marginTop: "20px", marginLeft: "20px" }}>
            {weapons.map((item, index) => {
              return <ItemMyWeapon key={index} item={item} />;
            })}
          </Row>
          <div className="flex mt-5 mx-auto">
            {count > limit && (
              <Pagination
                onChange={onChangePage}
                current={pageSelect}
                total={count}
                pageSize={limit}
                showSizeChanger={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(MyWeapons);
