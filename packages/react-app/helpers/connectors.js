import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
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
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
});
