import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";

import { INFURA_ID, NETWORKS, ALCHEMY_KEY } from "../constants";
import { Transactor } from "../helpers";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

// contracts
import deployedContracts from "../contracts/hardhat_contracts.json";
import externalContracts from "../contracts/external_contracts";
import { injected } from "../helpers/connectors";
import { useWeb3React } from "@web3-react/core";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import { getLocal, setLocal } from "./local";
import { INJECTED_PROVIDER_ID } from "../constants/key";

const { ethers, BigNumber } = require("ethers");

// create our app context
export const Web3Context = React.createContext({});

// provider Component that wraps the entire app and provides context variables
export function Web3Provider({ children, ...props }) {
  // for Nextjs Builds, return null until "window" is available
  if (!global.window) {
    return null;
  }

  const { network = "localhost", DEBUG = true, NETWORKCHECK = true } = props;
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  // app states
  const [injectedProvider, setInjectedProvider] = useState();
  const [yourLocalBalance, setYourLocalBalance] = useState(BigNumber.from(0));
  // const [address, setAddress] = useState();

  /// 📡 What chain are your contracts deployed to?
  const targetNetwork = NETWORKS[network]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

  // 🛰 providers
  const scaffoldEthProvider = useMemo(() => {
    return navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;
  }, [navigator.onLine]);
  const poktMainnetProvider = useMemo(() => {
    return navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(
          "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
        )
      : null;
  }, [navigator.onLine]);
  const mainnetInfura = useMemo(() => {
    if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
    return navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`)
      : null;
  }, [navigator.onLine]);
  const localProvider = useMemo(() => {
    // 🏠 Your local provider is usually pointed at your local blockchain
    const localProviderUrl = targetNetwork.rpcUrl;
    // as you deploy to other networks you can set PROVIDER=https://dai.poa.network in packages/react-app/.env
    const localProviderUrlFromEnv = process.env.NEXT_PUBLIC_PROVIDER
      ? process.env.NEXT_PUBLIC_PROVIDER
      : localProviderUrl;
    if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
    return new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);
  }, []);

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  // useEffect(() => {
  //   async function getAddress() {
  //     if (userSigner) {
  //       const newAddress = await userSigner.getAddress();
  //       setAddress(newAddress);
  //     }
  //   }
  //   getAddress();
  // }, [userSigner]);

  useEffect(() => {
    console.log("Web3Context library ", library);
    if (library) {
      setInjectedProvider(library);
    }
  }, [library]);
  const getBalance = async () => {
    if (localProvider && account) {
      const balanceAccount = await localProvider.getBalance(account);
      console.log("balanceAccount ", balanceAccount);
      setYourLocalBalance(balanceAccount);
    }
  };
  useEffect(() => {
    getBalance();
  }, [localProvider, account]);
  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  // const yourLocalBalance = useBalance(localProvider, account);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, account);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      account &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", account);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    account,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    // const provider = await web3Modal.connect();
    // setInjectedProvider(new ethers.providers.Web3Provider(provider));
    // provider.on("chainChanged", chainId => {
    //   console.log(`chain changed to ${chainId}! updating providers`);
    //   setInjectedProvider(new ethers.providers.Web3Provider(provider));
    // });
    // provider.on("accountsChanged", () => {
    //   console.log(`account changed!`);
    //   setInjectedProvider(new ethers.providers.Web3Provider(provider));
    // });
    // // Subscribe to session disconnection
    // provider.on("disconnect", (code, reason) => {
    //   console.log(code, reason);
    //   logoutOfWeb3Modal();
    // });

    try {
      await activate(injected);

      console.log("library", library);
      setLocal(INJECTED_PROVIDER_ID, true);
      // localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }, [setInjectedProvider]);
  const logoutOfWeb3Modal = async () => {
    // await web3Modal.clearCachedProvider();
    // if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
    //   await injectedProvider.provider.disconnect();
    // }
    deactivate();
    setLocal(INJECTED_PROVIDER_ID, false);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      console.log("getLocal(INJECTED_PROVIDER_ID) ", getLocal(INJECTED_PROVIDER_ID));
      if (getLocal(INJECTED_PROVIDER_ID) == true) {
        try {
          await activate(injected);
          setLocal(INJECTED_PROVIDER_ID, true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: account,
              value: ethers.utils.parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  // use props as a way to pass configuration values
  const providerProps = {
    ...props,
    network,
    DEBUG,
    NETWORKCHECK,
    tx,
    price,
    gasPrice,
    selectedChainId,
    localChainId,
    localProvider,
    userSigner,
    readContracts,
    writeContracts,
    mainnetProvider,
    yourMainnetBalance,
    account,
    blockExplorer,
    faucetHint,

    faucetAvailable,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    yourLocalBalance,
    contractConfig,
    targetNetwork,
  };

  return <Web3Context.Provider value={providerProps}>{children}</Web3Context.Provider>;
}

export function Web3Consumer(Component) {
  return function HOC(pageProps) {
    return <Web3Context.Consumer>{web3Values => <Component web3={web3Values} {...pageProps} />}</Web3Context.Consumer>;
  };
}
