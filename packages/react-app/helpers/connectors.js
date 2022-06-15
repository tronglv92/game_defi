import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletId } from "../constants/key";
import metamask from "../images/metamask.svg";
import coinbase_wallet from "../images/coinbase_wallet.svg";
import wallet_connect from "../images/wallet_connect.svg";
export const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/e8cb245fc6964448938cc0b63b5abfdd",
  4: "https://rinkeby.infura.io/v3/e8cb245fc6964448938cc0b63b5abfdd",
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 31337],
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
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001, 31337],
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
