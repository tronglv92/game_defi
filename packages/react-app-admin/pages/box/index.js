import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext, useState } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Card, Col, Divider, Pagination, Row } from "antd";
import { useRouter } from "next/router";
import { CREATE_BOX_PATH } from "../../constants/path";
import withAuth from "../../helpers/withAuth";
import { getAllBoxApi } from "../../store/box/boxApi";
import { getAllBoxes, getAllBoxesSuccess } from "../../store/box/boxSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../../store/store";
import Link from "next/link";
function AdminBox({ web3 }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { boxes, page, limit, count } = useSelector(state => state.box);
  const [pageSelect, setPageSelect] = useState(page);
  const onCreateBox = () => {
    router.push({
      pathname: CREATE_BOX_PATH,
    });
  };
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
  const renderItem = (item, index) => {
    return (
      <>
        <Divider style={{ margin: 0 }} />
        <div className={`${index % 2 == 0 ? "bg-white" : "bg-gray-50"} pr-5 pl-5 pt-5 pb-5`}>
          <Row gutter={[16, 16]} align="middle" key={index}>
            <Col span={2}>
              <Link href={"/box/" + item.id}>
                <a>{item.id}</a>
              </Link>
            </Col>

            <Col span={4}>{item.name}</Col>
            <Col span={4}>
              <img src={item.img} style={{ objectFit: "contain", height: "50px" }} />
            </Col>
            <Col span={4}>{item.nft ? `${item.nft.price} KWS` : ""}</Col>
            <Col span={2}>{item.nft ? item.nft.minted : false}</Col>
            <Col span={2}>{item.nft && item.nft.tokenId ? item.nft.tokenId : ""}</Col>

            <Col span={6}>
              <p className="break-words">{item.nft && item.nft.addressOwner ? item.nft.addressOwner : ""}</p>
            </Col>
          </Row>
        </div>
      </>
    );
  };

  const renderHeadGrid = () => {
    return (
      <Row gutter={[16, 16]} className="pl-5 pr-5 pt-5 pb-5" align="middle" justify="center">
        <Col span={2} className="text-black font-bold">
          ID
        </Col>

        <Col span={4} className="text-black font-bold">
          Name
        </Col>
        <Col span={4} className="text-black font-bold">
          Image
        </Col>
        <Col span={4} className="text-black font-bold">
          Price
        </Col>
        <Col span={2} className="text-black font-bold">
          Minted
        </Col>
        <Col span={2} className="text-black font-bold">
          Token ID
        </Col>
        <Col span={6} className="text-black font-bold">
          Owner
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Card bodyStyle={{ paddingRight: 0, paddingLeft: 0 }}>
        <Col>
          <Row className="ml-5 mr-5 flex">
            <Row className="flex-1">
              <Button type="primary" className="mr-5" onClick={onCreateBox}>
                Create Box
              </Button>
            </Row>
            {count > 0 && (
              <Pagination
                onChange={onChangePage}
                current={pageSelect}
                total={count}
                pageSize={limit}
                showSizeChanger={false}
              />
            )}
          </Row>
          <Divider style={{ margin: 0, marginTop: 30 }} />

          {renderHeadGrid()}
          {boxes.map((item, index) => {
            return renderItem(item, index);
          })}
          <Divider style={{ margin: 0, marginBottom: 30 }} />
          <Row justify="end" className="pr-5">
            {count > 0 && (
              <Pagination
                onChange={onChangePage}
                current={pageSelect}
                total={count}
                pageSize={limit}
                showSizeChanger={false}
              />
            )}
          </Row>
        </Col>
      </Card>
    </>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  console.log("store.getState() ", store.getState());
  const { box } = store.getState();
  const { page, limit } = box;
  const result = await getAllBoxApi({ page, limit });
  console.log("getServerSideProps result ", result);

  if (result.success) {
    store.dispatch(getAllBoxesSuccess({ items: result.data.items, page: page }));
  } else {
    console.log(result.message);
  }
});
export default Web3Consumer(AdminBox);
