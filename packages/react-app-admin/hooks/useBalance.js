import { useOnRepetition } from "eth-hooks";
import { BigNumber } from "ethers";
import { useState, useCallback } from "react";

const zero = BigNumber.from(0);
/**
 * Gets your balance in ETH from given address and provider
 *
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param provider (ethers->Provider)
 * @param address (string)
 * @param pollTime (number) :: if >0 use polling, else use instead of onBlock event
 * @returns (Bignumber) ::  current balance
 */
export const useBalance = (provider, address, pollTime = 0) => {
  console.log("useBalance provider ", provider);
  console.log("useBalance address ", address);
  const [balance, setBalance] = useState();
  const pollBalance = useCallback(
    async (provider, address) => {
      if (provider && address) {
        const newBalance = await provider.getBalance(address);
        if (!newBalance.eq(balance !== null && balance !== void 0 ? balance : zero)) {
          setBalance(newBalance);
          console.log(address, newBalance.toString(), balance);
        }
      }
    },
    [provider, address],
  );

  useOnRepetition(
    pollBalance,
    { pollTime, provider, leadingTrigger: address != null && address !== "" && provider != null },
    provider,
    address,
  );
  return balance !== null && balance !== void 0 ? balance : zero;
};
