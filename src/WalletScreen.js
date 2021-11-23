import { formatEther } from "@ethersproject/units";
import { enc } from "crypto-js";
import { ethers, providers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ScreenContext } from "./App";
var AES = require("crypto-js/aes");

const WalletScreen = () => {
  const [wallet, setWallet] = useState();
  const { password, setScreen, setPassword } = useContext(ScreenContext);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!(password && password.length > 0)) setScreen("onboard");
  }, [password, setScreen]);

  useEffect(() => {
    let pKeyEncrypted = localStorage.getItem("sling_saved_pkey");
    let pKey = AES.decrypt(pKeyEncrypted, password).toString(enc.Utf8);
    setWallet(new ethers.Wallet(pKey));
  }, [setWallet, password]);

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
            {formatEther(balance)} ETH
          </p>
        </>
      ) : (
        <p>"Loading your wallet. Please wait..."</p>
      )}
    </div>
  );
};

export default WalletScreen;
