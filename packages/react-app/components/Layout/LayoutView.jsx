import React, { useState } from "react";
import { MenuId, MENU_ID, WalletId } from "../../constants/key";

import { Web3Consumer } from "../../helpers/Web3Context";
import Account from "../Account";
import { useMediaQuery } from "react-responsive";
import ModalLogin from "../ModalLogin";
import ModalNetworkDisplay from "../ModalNetworkDisplay";
import { Breadcrumb, Button, Drawer, Layout, Menu, Row } from "antd";
import icMysteryBox from "../../public/ic-mystery-box.svg";
import icMarketPlace from "../../public/ic-marketplace.svg";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { MARKETING_PATH, MYSTERY_BOX_PATH } from "../../constants/path";
const { Header, Content, Footer } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Weapon", MENU_ID.Weapons),
  getItem("Mystery Boxes", MENU_ID.MysteryBoxes),

  // getItem("User", "sub1", <UserOutlined />, [getItem("Tom", "3"), getItem("Bill", "4"), getItem("Alex", "5")]),
  // getItem("Team", "sub2", <TeamOutlined />, [getItem("Team 1", "6"), getItem("Team 2", "8")]),
  // getItem("Files", "9", <FileOutlined />),
];
function LayoutView({ children, web3 }) {
  const {
    logoutOfWeb3Modal,
    showModalLogin,
    setShowModalLogin,
    onLogin,
    showModalDisplayNetWork,
    setShowModalDisplayNetWork,
    targetNetwork,
    loginCryto,
    library,
    walletIdSelected,
  } = web3;
  // const checkNetwork = async () => {
  //   if (window.ethereum) {
  //     const currentChainId = await library.provider.request({
  //       method: "eth_chainId",
  //     });

  //     // return true if network id is the same
  //     console.log("currentChainId ", currentChainId);
  //   }
  // };
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onClickMenu = menu => {
    const { item, key, keyPath, domEvent } = menu;
    console.log("menu ", menu);
    console.log("router ", router);
    const path = router.asPath;
    switch (key) {
      case MENU_ID.Weapons:
        if (path != MARKETING_PATH) {
          router.push({
            pathname: MARKETING_PATH,
          });
        }
        break;
      case MENU_ID.MysteryBoxes:
        if (path != MYSTERY_BOX_PATH) {
          router.push({
            pathname: MYSTERY_BOX_PATH,
          });
        }
        break;
      default:
        break;
    }
  };
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        {isMobile ? (
          <Header
            style={{
              position: "fixed",
              zIndex: 1,
              width: "100%",
            }}
            className="flex flex-row justify-end items-center"
          >
            <MenuOutlined
              style={{ fontSize: "30px", color: "white" }}
              onClick={showDrawer}
              className="cursor-pointer"
            />
          </Header>
        ) : (
          <Header
            style={{
              position: "fixed",
              zIndex: 1,
              width: "100%",
            }}
            className="flex flex-row justify-between items-center"
          >
            <Row align="middle">
              <div />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[MENU_ID.Weapons]}
                items={items}
                onClick={onClickMenu}
              />
            </Row>

            <Account
              {...web3}
              onConnect={() => {
                setShowModalLogin(true);
              }}
              onLogout={logoutOfWeb3Modal}
            />
          </Header>
        )}
        <Content
          style={{
            padding: "0 50px",
            marginTop: 64,
            backgroundColor: "#000000",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 380,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
      {showModalLogin == true && (
        <ModalLogin
          setShowModalLogin={setShowModalLogin}
          onLogin={wallet => {
            console.log("ModalLogin wallet ", wallet);
            onLogin(wallet);
          }}
        />
      )}
      {showModalDisplayNetWork == true && (
        <ModalNetworkDisplay
          walletIdSelected={walletIdSelected}
          onChangeNetwork={async () => {
            // checkNetwork();
            // console.log("targetNetwork ", targetNetwork);

            const data = [
              {
                chainId: "0x" + targetNetwork.chainId.toString(16),
                chainName: targetNetwork.name,
                nativeCurrency: targetNetwork.nativeCurrency,
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.blockExplorer],
              },
            ];
            console.log("data", data);

            let switchTx;
            // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
            try {
              switchTx = await library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: data[0].chainId }],
              });
            } catch (switchError) {
              console.log("swich network switchError ", switchError);
              // not checking specific error code, because maybe we're not using MetaMask
              try {
                switchTx = await library.provider.request({
                  method: "wallet_addEthereumChain",
                  params: data,
                });
              } catch (addError) {
                // handle "add" error
                console.log("swich network addError ", addError);
              }
            }

            if (switchTx) {
              console.log("switchTx ", switchTx);
            }
            setShowModalDisplayNetWork(false);
          }}
          onDisConnect={() => {
            logoutOfWeb3Modal();
            setShowModalDisplayNetWork(false);
          }}
        />
      )}
      <Drawer
        placement="right"
        onClose={onClose}
        closable={false}
        visible={visible}
        bodyStyle={{ backgroundColor: "rgba(51,51,51,1)", padding: 0 }}
        headerStyle={{ backgroundColor: "rgba(51,51,51,1)" }}
      >
        <Row
          align="middle"
          className="cursor-pointer hover:bg-[#2B2B2BA8] p-5 mt-20"
          onClick={() => {
            console.log("onclick Weapon");
          }}
        >
          <img src={icMarketPlace.src} width="30px"></img>
          <span className="text-xl font-bold text-white ml-5 hover:text-[#FFC700]">Weapons</span>
        </Row>
        <Row align="middle" className="cursor-pointer hover:bg-[#2B2B2BA8] p-5">
          <img src={icMysteryBox.src} width="30px"></img>
          <span className="text-xl font-bold text-white ml-5 hover:text-[#FFC700]">Mystery Boxes</span>
        </Row>
        <Button type="primary" className="ml-5 mt-2" shape="round">
          Connect
        </Button>
      </Drawer>
    </>
  );
}
export default Web3Consumer(LayoutView);
