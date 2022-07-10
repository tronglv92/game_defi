import {
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import ModalLogin from "../ModalLogin";
import ModalNetworkDisplay from "../ModalNetworkDisplay";

import React, { Component, useState } from "react";
import Account from "../Account";
import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import { useRouter } from "next/router";
import { ADMIN_WEAPON_PATH, HOME_PATH, ADMIN_BOX_PATH } from "../../constants/path";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const MENU_KEY = {
  Home: "Home",
  Weapon: "Weapon",
  Box: "Box",
  User: "User",
};

const { Header, Content, Footer, Sider } = Layout;
function LayoutView({ children, web3 }) {
  const router = useRouter();
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
    yourAccount,
  } = web3;
  const defaultSelectedKeys = [MENU_KEY.Home];
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrums, setBreadCrums] = useState(defaultSelectedKeys);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState(defaultSelectedKeys);

  const items = [
    getItem("Home", MENU_KEY.Home, <PieChartOutlined />),
    yourAccount && getItem("Weapon", MENU_KEY.Weapon, <PieChartOutlined />),
    yourAccount && getItem("Box", MENU_KEY.Box, <PieChartOutlined />),
    yourAccount && getItem("User", MENU_KEY.User, <UserOutlined />, [getItem("Tom", "Tom")]),
    // getItem("User", "sub1", <UserOutlined />, [getItem("Tom", "3"), getItem("Bill", "4"), getItem("Alex", "5")]),
    // getItem("Team", "sub2", <TeamOutlined />, [getItem("Team 1", "6"), getItem("Team 2", "8")]),
    // getItem("Files", "9", <FileOutlined />),
  ];
  const onSelectedMenu = menu => {
    setBreadCrums(menu.keyPath);
    setSelectedMenuKeys(menu.keyPath);
    switch (menu.key) {
      case MENU_KEY.Home:
        router.push({
          pathname: HOME_PATH,
          // query:{
          //   postId:123
          // }
        });
        break;
      case MENU_KEY.Weapon:
        router.push({
          pathname: ADMIN_WEAPON_PATH,
        });
        break;
      case MENU_KEY.Box:
        router.push({
          pathname: ADMIN_BOX_PATH,
        });
        break;
      default:
        router.push({
          pathname: HOME_PATH,
        });
        break;
    }
  };
  const generateBreadcrumbs = () => {
    // Remove any query parameters, as those aren't included in breadcrumbs
    const asPathWithoutQuery = router.asPath.split("?")[0];

    // Break down the path between "/"s, removing empty entities
    // Ex:"/my/nested/path" --> ["my", "nested", "path"]
    const asPathNestedRoutes = asPathWithoutQuery.split("/").filter(v => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // The title will just be the route string for now
      const title = subpath;
      return { href, text: title };
    });

    // Add in a default "Home" crumb for the top-level
    return [{ href: "/", text: "Home" }, ...crumblist];
  };
  const breadcrumbs = generateBreadcrumbs();
  console.log("breadcrumbs ", breadcrumbs);
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
          // style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 1 }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            selectedKeys={selectedMenuKeys}
            mode="inline"
            items={items}
            onClick={menu => {
              onSelectedMenu(menu);

              console.log("Select menu menu ", menu);
            }}
          />
        </Sider>
        <Layout>
          {/* HEADDER */}
          <Header
            className="flex flex-row justify-between items-center"
            style={{ padding: 0, paddingLeft: 15, paddingRight: 15, position: "sticky", top: 0, zIndex: 1000 }}
          >
            {!collapsed ? (
              <MenuFoldOutlined
                style={{ fontSize: 30, color: "white" }}
                onClick={() => {
                  setCollapsed(true);
                }}
              />
            ) : (
              <MenuUnfoldOutlined
                style={{ fontSize: 30, color: "white" }}
                onClick={() => {
                  setCollapsed(false);
                }}
              />
            )}

            <Account
              {...web3}
              onConnect={() => {
                setShowModalLogin(true);
              }}
              onLogout={logoutOfWeb3Modal}
            />
          </Header>
          {/* BODY */}
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              {breadcrumbs.map((item, index) => {
                if (index == 0) {
                  return <Breadcrumb.Item>{item.text}</Breadcrumb.Item>;
                } else if (index != breadcrumbs.length - 1) {
                  return (
                    <Breadcrumb.Item
                      className="hover:underline cursor-pointer"
                      onClick={() => {
                        router.push(item.href);
                      }}
                    >
                      {item.text}
                    </Breadcrumb.Item>
                  );
                } else {
                  return <Breadcrumb.Item>{item.text}</Breadcrumb.Item>;
                }
              })}
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 300,
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
    </>
  );
}
export default Web3Consumer(LayoutView);
