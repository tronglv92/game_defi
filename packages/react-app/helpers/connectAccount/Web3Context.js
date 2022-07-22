import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, notification } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";

import { INFURA_ID, NETWORKS, ALCHEMY_KEY, NETWORK } from "../../constants";
import { Transactor } from "..";
import { useContractLoader, useContractReader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

// contracts
import deployedContracts from "../../contracts/hardhat_contracts.json";
import externalContracts from "../../contracts/external_contracts";
import { activateInjectedProvider, getErrorMessage, getWalletById, injected } from "./connectors";
import { useWeb3React } from "@web3-react/core";

import { getLocal, setLocal } from "../local";
import { AUTH_LOCAL_ID, LS_KEY, METAMASK_ID } from "../../constants/key";

import { useBalance } from "../../hooks/useBalance";
import lib from "@ant-design/icons";
import _ from "lodash";
import { useEagerConnectLogin } from "./ConnectHook";
import { useRouter } from "next/router";
import { MARKETING_PATH } from "../../constants/path";
const { ethers, BigNumber } = require("ethers");

// create our app context
export const Web3Context = React.createContext({});

// provider Component that wraps the entire app and provides context variables
export function Web3Provider({ children, ...props }) {
  // for Nextjs Builds, return null until "window" is available
  if (!global.window) {
    return null;
  }
  const router = useRouter();
  const { network = "localhost", DEBUG = true, NETWORKCHECK = true } = props;
  const { active, account, library, connector, chainId, activate, deactivate } = useWeb3React();
  // app states
  // const [injectedProvider, setInjectedProvider] = useState();
  const [yourLocalBalance, setYourLocalBalance] = useState(BigNumber.from(0));
  // const [yourAccount, setYourAccount] = useState();
  const [walletIdSelected, setWalletIdSelected] = useState();
  // const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalDisplayNetWork, setShowModalDisplayNetWork] = useState(false);
  const [state, setState] = useState({});
  const [historyRoute, setHistoryRoute] = useState([]);
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
  const userProviderAndSigner = useUserProviderAndSigner(library, localProvider);
  const userSigner = userProviderAndSigner.signer;

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  const yourAccount = useEagerConnectLogin({
    walletId: walletIdSelected,
    localChainId: NETWORKS[network].chainId,
    setShowModalDisplayNetWork: setShowModalDisplayNetWork,
  });
  const getBalance = async () => {
    if (library && yourAccount) {
      console.log("getBalance 1");
      const balanceAccount = await library.getBalance(yourAccount);

      setYourLocalBalance(balanceAccount);
    } else {
      console.log("getBalance 2");
      setYourLocalBalance(BigNumber.from(0));
    }
  };

  const isNetworkSelected = chainId => {
    console.log("NETWORKS[network].chainId ", NETWORKS[network].chainId);
    return chainId == NETWORKS[network].chainId;
  };

  //SET MOUNTED
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    console.log("Calculation balance chainId ", chainId);
    // have chainId=> have account=> have loggedin
    if (chainId) {
      if (isNetworkSelected(chainId)) {
        getBalance();
      }
    }
    // When logout=> chainId=null
    else {
      setYourLocalBalance(BigNumber.from(0));
    }
  }, [library, yourAccount, chainId]);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  // const yourLocalBalance = useBalance(localProvider, account);

  // Just plug in different 🛰 providers to get your balance on different chains:

  const yourMainnetBalance = "0";
  // const yourMainnetBalance = useBalance(mainnetProvider, account);

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

  useOnBlock(localProvider, () => {
    getBalance();
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
  useEffect(() => {
    let historyCopy = [...historyRoute, router.asPath];
    setHistoryRoute(historyCopy);
  }, [router.asPath]);
  // const clearAccount = () => {
  //   setLocal(LS_KEY, null);
  //   setYourAccount(null);
  //   setYourLocalBalance(0);
  //   setState({ auth: null });
  //   setWalletIdSelected(null);
  //   // deactivate();
  // };
  const onLogin = async wallet => {
    console.log("onLogin wallet ", wallet);
    try {
      setWalletIdSelected(wallet.id);
      activateInjectedProvider(wallet.id);

      await activate(wallet.connector, undefined, true);

      console.log("onLogin account ", account);
      console.log("onLogin library ", library);

      // localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      const msgError = getErrorMessage(ex);

      notification.error({
        message: "Login Error",
        description: msgError,
      });
    }
  };
  const logout = async () => {
    deactivate();
    router.replace(MARKETING_PATH);
  };
  // const triedEager = useEagerConnect();

  // useInactiveListener(!triedEager, network);

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

    blockExplorer,

    library,
    onLogin,
    logout,
    yourLocalBalance,
    contractConfig,
    targetNetwork,

    showModalDisplayNetWork,
    setShowModalDisplayNetWork,
    yourAccount,
    // loginCryto,
    walletIdSelected,
    historyRoute,
  };

  return <Web3Context.Provider value={providerProps}>{mounted && children}</Web3Context.Provider>;
}

export function Web3Consumer(Component) {
  return function HOC(pageProps) {
    return <Web3Context.Consumer>{web3Values => <Component web3={web3Values} {...pageProps} />}</Web3Context.Consumer>;
  };
}
