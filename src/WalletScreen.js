import { formatEther } from "@ethersproject/units";
import { AES, enc, lib } from "crypto-js";
import { ethers, providers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ScreenContext } from "./App";

const WalletScreen = () => {
  const [wallet, setWallet] = useState();
  const { password, setScreen, currentWalletAddress } =
    useContext(ScreenContext);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (
      !(
        password &&
        password.length > 0 &&
        currentWalletAddress &&
        currentWalletAddress.length > 0
      )
    )
      setScreen("onboard");
  }, [password, setScreen, currentWalletAddress]);

  useEffect(() => {
    let nosalt = lib.WordArray.random(0);
    let pKeyEncrypted = localStorage.getItem(currentWalletAddress);
    let pKey = AES.decrypt(pKeyEncrypted, password, { salt: nosalt }).toString(
      enc.Utf8
    );
    setWallet(new ethers.Wallet(pKey));
  }, [setWallet, password, currentWalletAddress]);

  useEffect(() => {
    async function setwalletBalance() {
      let provider = new providers.getDefaultProvider(4);
      let balance = await provider.getBalance(wallet.address);
      setBalance(balance);
    }

    if (wallet) {
      setwalletBalance();
    }
  }, [wallet]);

  return (
    <div className="wallet-screen">
      <h3>Your Saved Wallet</h3>

      {wallet ? (
        <>
          <p>
            <strong>Selected Network:</strong>4
          </p>
          <p>
            <strong>Your Wallet Address:</strong>
            {wallet.address}
          </p>
          <p>
            <strong>Your wallet Balance:</strong>
            {balance === null ? "Loading..." : formatEther(balance) + " ETH"}
          </p>
        </>
      ) : (
        <p>"Loading your wallet. Please wait..."</p>
      )}
    </div>
  );
};

export default WalletScreen;
