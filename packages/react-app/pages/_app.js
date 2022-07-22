import "../styles/index.css";
import "antd/dist/antd.css";
import React, { useEffect, useRef, useState } from "react";
import { Web3Provider as Web3ContextProvider } from "../helpers/connectAccount/Web3Context";
import { Web3ReactProvider } from "@web3-react/core";

import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { ethers } from "ethers";
import { POLLING_INTERVAL } from "../helpers/connectAccount/connectors";
import Layout from "../components/Layout/LayoutView";
import { useRouter } from "next/router";

import { wrapper } from "../store/store";
import { MARKETING_PATH } from "../constants/path";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const prevTheme = useRef("light");

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
    console.log("useEffect DB_USER ", process.env.DB_USER);
    if (router.asPath == "/") {
      router.replace({
        pathname: MARKETING_PATH,
      });
    }
  }, []);

  function getLibrary(provider) {
    console.log("provider ", provider);
    const library = new ethers.providers.Web3Provider(provider, "any");
    library.pollingInterval = POLLING_INTERVAL;
    return library;
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider network="rinkeby">
        <ThemeProvider attribute="class">
          <>
            <Head>
              <link
                rel="icon"
                href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏗</text></svg>"
              />
            </Head>

            <Layout>
              <Component {...pageProps} />
            </Layout>
          </>
        </ThemeProvider>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}
export default wrapper.withRedux(MyApp);
