import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletId } from "../../constants/key";
import metamask from "../../images/metamask.svg";
import coinbase_wallet from "../../images/coinbase_wallet.svg";
import wallet_connect from "../../images/wallet_connect.svg";
import { UnsupportedChainIdError } from "@web3-react/core";

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
export const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/e8cb245fc6964448938cc0b63b5abfdd",
  4: "https://rinkeby.infura.io/v3/e8cb245fc6964448938cc0b63b5abfdd",
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337, 56],
});
export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  chainId: 1,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
export function resetWalletConnector(connector) {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = undefined;
  }
}
export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "game defi",
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001, 31337, 56],
});

export const connectorsByName = {
  METAMASK: { connector: injected, popular: true, svg: metamask.src, name: "Metamask", id: WalletId.Metamask },
  COINBASE: {
    connector: walletlink,
    popular: false,
    svg: coinbase_wallet.src,
    name: "Coinbase Wallet",
    id: WalletId.Coinbase,
  },

  WALLET: {
    connector: walletconnect,
    popular: false,
    svg: wallet_connect.src,
    name: "WalletConnect",
    id: WalletId.WalletLink,
  },
};

export const getWalletById = walletId => {
  switch (walletId) {
    case WalletId.Metamask:
      return connectorsByName.METAMASK;
    case WalletId.Coinbase:
      return connectorsByName.COINBASE;
    case WalletId.WalletLink:
      return connectorsByName.WALLET;
    default:
      break;
  }
};
export function activateInjectedProvider(providerName) {
  const { ethereum } = window;

  if (!ethereum?.providers) {
    return undefined;
  }

  let provider;
  switch (providerName) {
    case WalletId.Coinbase:
      provider = ethereum.providers.find(({ isCoinbaseWallet }) => isCoinbaseWallet);
      break;
    case WalletId.Metamask:
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
      break;
  }

  if (provider) {
    ethereum.setSelectedProvider(provider);
  }
}
export function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return error.message;
  }
}
