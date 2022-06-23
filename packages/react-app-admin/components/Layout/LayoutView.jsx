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
import { Web3Consumer } from "../../helpers/Web3Context";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [getItem("Tom", "3"), getItem("Bill", "4"), getItem("Alex", "5")]),
  getItem("Team", "sub2", <TeamOutlined />, [getItem("Team 1", "6"), getItem("Team 2", "8")]),
  getItem("Files", "9", <FileOutlined />),
];
const { Header, Content, Footer, Sider } = Layout;
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

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout>
        <Sider collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header
            className="flex flex-row justify-between items-center"
            style={{ padding: 0, paddingLeft: 15, paddingRight: 15 }}
          >
            {!collapsed ? (
              <MenuFoldOutlined
                style={{ fontSize: 30 }}
                onClick={() => {
                  setCollapsed(true);
                }}
              />
            ) : (
              <MenuUnfoldOutlined
                style={{ fontSize: 30 }}
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
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
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
