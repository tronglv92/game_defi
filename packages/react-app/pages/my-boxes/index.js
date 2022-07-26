import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getMyBoxesApi } from "../../store/myBox/myBoxApi";
import { getMyBoxes, getMyBoxesSuccess } from "../../store/myBox/myBoxSlice";
import { Pagination } from "antd";
import { wrapper } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import withAuth from "../../helpers/withAuth";

function MyBoxes({ web3 }) {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.myBox);
  const { boxes, count, limit } = selector;
  console.log("selector ", selector);
  const [pageSelect, setPageSelect] = useState(1);
  const router = useRouter();

  useEffect(() => {
    dispatch(
      getMyBoxes({
        page: 1,
        limit: limit,
      }),
    );
  }, []);

  const onChangePage = (page, pageSize) => {
    console.log("onChangePage ", page, pageSize);
    setPageSelect(page);
    dispatch(
      getMyBoxes({
        page: page,
        limit: pageSize,
      }),
    );
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-8 flex flex-col">
        <div className="flex justify-between border-b-[1px] border-b-[rgba(51,51,51,1)]">
          <span className="uppercase text-white text-lg md:text-xl font-extrabold pb-2 "> My Boxes </span>
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-5 ">
          {boxes.map((item, index) => {
            return (
              <Link href={`/my-boxes/${item.id}`} key={index}>
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
//NOTE: getAuth in SSR return null because window,localStorage,sessionStorage,etc.. are not defined on server
// export const getServerSideProps = wrapper.getServerSideProps(store => async () => {});
export default withAuth(MyBoxes);
