import { useContractReader } from "eth-hooks";
import React, { useContext, useState } from "react";

import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";

import { Row, Col, Card, Rate, Divider, Checkbox, Pagination } from "antd";
import icStaff from "../../public/ic-staff-small.svg";

import { FilterOutlined } from "@ant-design/icons";
import Filter from "../../components/Web3/Filter";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

import ItemWeapon from "../../components/Views/Marketing/ItemWeapon";
import { getWeaponsApi } from "../../store/weapon/weaponApi";
import { getWeapons, getWeaponsSuccess } from "../../store/weapon/weaponSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../../store/store";
function Marketing({ web3 }) {
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
  const { weapons, limit, count } = useSelector(state => state.weapon);
  const [pageSelect, setPageSelect] = useState(1);
  const [filter, setFilter] = useState({});

  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  // const number = useContractReader(readContracts, "YourContract", "number");

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [visibleFilter, setVisibleFilter] = useState(false);
  const router = useRouter();
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  const onClickFilter = () => {
    setVisibleFilter(!visibleFilter);
  };
  const onChangePage = (page, pageSize) => {
    console.log("onChangePage ", page, pageSize);
    setPageSelect(page);
    dispatch(
      getWeapons({
        page: page,
        limit: pageSize,
        ...filter,
      }),
    );
  };
  const onFilter = (types, stars, priceFrom, priceTo) => {
    const params = {
      page: 1,
      limit: limit,
      types: types,
      stars: stars,
      priceFrom: priceFrom,
      priceTo: priceTo,
    };
    setFilter({
      types: types,
      stars: stars,
      priceFrom: priceFrom,
      priceTo: priceTo,
    });
    setPageSelect(1);
    console.log("onFilter params ", params);
    dispatch(getWeapons(params));
  };
  return (
    <>
      <div className="flex max-w-screen-2xl mx-auto mt-20">
        {/* Filter */}
        {!isMobile && <Filter onFilter={onFilter} />}
        {/* List Weapon */}
        <div className="flex flex-col border-l-[1px] border-l-[#333333] flex-1">
          <Row
            style={{ paddingLeft: "20px", paddingBottom: "20px", borderBottomWidth: 1, borderBottomColor: "#333333" }}
            justify="space-between"
            align="middle"
          >
            <span className="text-white text-lg">{count} items</span>
            {isMobile && (
              <FilterOutlined
                style={{ fontSize: "25px", color: "white" }}
                onClick={onClickFilter}
                className="cursor-pointer"
              />
            )}
          </Row>
          {isMobile && visibleFilter && <Filter onFilter={onFilter} />}
          <Row gutter={[16, 16]} style={{ marginTop: "20px", marginLeft: "20px" }}>
            {weapons.map((item, index) => {
              return <ItemWeapon key={index} item={item} />;
            })}
          </Row>
          <div className="flex mt-5 mx-auto">
            {count > 0 && (
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
export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  const { weapon } = store.getState();
  const { limit } = weapon;
  const result = await getWeaponsApi({ page: 1, limit });
  console.log("getServerSideProps result ", result);

  if (result.success) {
    store.dispatch(getWeaponsSuccess({ items: result.data.items }));
  } else {
    console.log(result.message);
  }
});
export default Web3Consumer(Marketing);
