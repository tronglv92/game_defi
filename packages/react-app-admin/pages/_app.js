import "../styles/index.css";
import "antd/dist/antd.css";
import NextNProgress from "nextjs-progressbar";
import React, { useEffect, useRef } from "react";
import { Web3Provider as Web3ContextProvider } from "../helpers/connectAccount/Web3Context";
import { Web3ReactProvider } from "@web3-react/core";
import { ThemeProvider } from "next-themes";

import { ethers } from "ethers";
import { POLLING_INTERVAL } from "../helpers/connectAccount/connectors";
import { wrapper } from "../store/store";
import LayoutView from "../components/Layout/LayoutView";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const prevTheme = useRef("light");
  const router = useRouter();
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
            {/* <NetworkDisplay /> */}
            {/* <DevUI /> */}
            {router.pathname !== "/login" ? (
              <LayoutView>
                <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
                <Component {...pageProps} />
              </LayoutView>
            ) : (
              <>
                <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
                <Component {...pageProps} />
              </>
            )}
          </>
        </ThemeProvider>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}

export default wrapper.withRedux(MyApp);
