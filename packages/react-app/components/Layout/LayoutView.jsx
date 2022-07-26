import React, { useEffect, useState } from "react";
import { MenuId, MENU_ID, WalletId } from "../../constants/key";

import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import Account from "../Web3/Account";
import { useMediaQuery } from "react-responsive";
import ModalLogin from "../Web3/ModalLogin";
import ModalNetworkDisplay from "../Web3/ModalNetworkDisplay";
import { Breadcrumb, Button, Drawer, Layout, Menu, Row } from "antd";
import icMysteryBox from "../../public/ic-mystery-box.svg";
import icMarketPlace from "../../public/ic-marketplace.svg";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import {
  BUY_TOKEN_PATH,
  LOGIN,
  LOGIN_PATH,
  MARKETING_PATH,
  MYSTERY_BOX_PATH,
  MY_BOXES_PATH,
  MY_WEAPONS_PATH,
} from "../../constants/path";
const { Header, Content, Footer } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [getItem("Weapons", MENU_ID.Weapons), getItem("Mystery Boxes", MENU_ID.MysteryBoxes)];
const itemsWhenLogin = [
  getItem("Weapons", MENU_ID.Weapons),
  getItem("Mystery Boxes", MENU_ID.MysteryBoxes),
  getItem("My Boxes", MENU_ID.MyBoxes),
  getItem("My Weapons", MENU_ID.MyWeapons),
];
function LayoutView({ children, web3 }) {
  const {
    logout,

    onLogin,
    showModalDisplayNetWork,
    setShowModalDisplayNetWork,
    targetNetwork,
    loginCryto,
    library,
    walletIdSelected,
    yourAccount,
  } = web3;

  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(MENU_ID.Weapons);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onClickMenu = menu => {
    const { item, key, keyPath, domEvent } = menu;

    switch (key) {
      case MENU_ID.Weapons:
        navigateTo(MARKETING_PATH);

        break;
      case MENU_ID.MysteryBoxes:
        navigateTo(MYSTERY_BOX_PATH);
        break;
      case MENU_ID.MyBoxes:
        navigateTo(MY_BOXES_PATH);
        break;
      case MENU_ID.MyWeapons:
        navigateTo(MY_WEAPONS_PATH);
        break;
      default:
        break;
    }
  };
  const navigateTo = page => {
    const path = router.asPath;
    if (path != page) {
      router.push({
        pathname: page,
      });
    }
  };
  const getSelectedMenu = () => {
    let selectedMenu = MENU_ID.Weapons;
    // // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0];

    // // Break down the path between "/"s, removing empty entities
    // // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/").filter(v => v.length > 0);

    if (asPathNestedRoutes.length > 0) {
      switch ("/" + asPathNestedRoutes[0]) {
        case MARKETING_PATH:
          selectedMenu = MENU_ID.Weapons;
          break;
        case MYSTERY_BOX_PATH:
          selectedMenu = MENU_ID.MysteryBoxes;
          break;
        case MY_BOXES_PATH:
          selectedMenu = MENU_ID.MyBoxes;
          break;
        case MY_WEAPONS_PATH:
          selectedMenu = MENU_ID.MyWeapons;
          break;
        default:
          selectedMenu = MENU_ID.Weapons;
          break;
      }
    }
    return selectedMenu;
  };
  useEffect(() => {
    const selectedMenu = getSelectedMenu();
    console.log("useEffect router.asPath selectedMenu ", selectedMenu);
    setSelectedMenu(selectedMenu);
  }, [router.asPath]);
  //
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
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
            className="flex flex-row  items-center"
          >
            <div className="flex-1 flex">
              <Menu
                theme="dark"
                mode="horizontal"
                style={{ flex: 1 }}
                // defaultSelectedKeys={[selectedMenu]}
                selectedKeys={[selectedMenu]}
                items={yourAccount ? itemsWhenLogin : items}
                onClick={onClickMenu}
              />
            </div>

            <Account
              {...web3}
              onConnect={() => {
                router.push(LOGIN_PATH);
              }}
              onLogout={logout}
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
