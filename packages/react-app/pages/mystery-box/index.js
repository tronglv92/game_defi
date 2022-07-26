import React, { useContext, useState } from "react";
import { useRouter } from "next/router";

import { getAllBoxApi } from "../../store/box/boxApi";
import { getAllBoxes, getAllBoxesSuccess } from "../../store/box/boxSlice";
import { Pagination } from "antd";
import { wrapper } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "../../helpers/helper";
function MysteryBox({ web3 }) {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.box);
  const { boxes, count, limit } = selector;
  console.log("selector ", selector);
  const [pageSelect, setPageSelect] = useState(1);
  const router = useRouter();

  const onChangePage = (page, pageSize) => {
    console.log("onChangePage ", page, pageSize);
    setPageSelect(page);
    dispatch(
      getAllBoxes({
        page: page,
        limit: pageSize,
      }),
    );
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-8 flex flex-col">
        <div className="flex justify-between border-b-[1px] border-b-[rgba(51,51,51,1)]">
          <span className="uppercase text-white text-lg md:text-xl font-extrabold pb-2 "> Resold by User </span>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-5 ">
          {boxes.map((item, index) => {
            console.log("item ", item);
            console.log("index ", index);
            return (
              <Link href={`/mystery-box/${item.id}`} key={index}>
                <div className="bg-[#c4c4c429] rounded-[4px] p-5 w-full md:max-w-[315px] cursor-pointer flex flex-col">
                  <div className="flex justify-between mb-5">
                    <span
                      className="text-sm font-semibold px-2 py-0 border-[1px]
                 border-solid rounded-sm  text-white"
                    >
                      {item.name}
                    </span>
                  </div>

                  <Image src={item.img} className="mx-auto object-contain" height={200} width={200} />

                  {item.nft && (
                    <div className="flex flex-col mt-5 items-end">
                      <span className="text-white text-sm font-semibold"> {formatCurrency(item.nft.price)} KWS</span>
                      <span className="text-[rgba(255,255,255,0.8)] text-sm">= $7.26</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
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
    </>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  const { box } = store.getState();
  const { limit } = box;
  const result = await getAllBoxApi({ page: 1, limit });
  console.log("getServerSideProps result ", result);

  if (result.success) {
    store.dispatch(getAllBoxesSuccess({ items: result.data.items }));
  } else {
    console.log(result.message);
  }
});
export default MysteryBox;
