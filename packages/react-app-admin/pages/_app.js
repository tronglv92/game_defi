import "../styles/index.css";
import "antd/dist/antd.css";
import React, { useEffect, useRef } from "react";
import { Web3Provider as Web3ContextProvider } from "../helpers/Web3Context";
import { Web3ReactProvider } from "@web3-react/core";
import { DevUI, NetworkDisplay, ThemeSwitch } from "../components";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { ethers } from "ethers";
import { POLLING_INTERVAL } from "../helpers/connectors";

import LayoutView from "../components/Layout/LayoutView";

function MyApp({ Component, pageProps }) {
  const prevTheme = useRef("light");

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
    console.log("useEffect DB_USER ", process.env.DB_USER);
  }, []);
  function getLibrary(provider) {
    console.log("provider ", provider);
    const library = new ethers.providers.Web3Provider(provider, "any");
    library.pollingInterval = POLLING_INTERVAL;
    return library;
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider network="localhost">
        <ThemeProvider attribute="class">
          <>
            <Head>
              <link
                rel="icon"
                href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏗</text></svg>"
              />
            </Head>
            {/* <NetworkDisplay /> */}
            {/* <DevUI /> */}

            <LayoutView>
              <Component {...pageProps} />
            </LayoutView>
          </>
        </ThemeProvider>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
