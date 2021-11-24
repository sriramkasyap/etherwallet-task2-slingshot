import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { ScreenContext } from "./App";
var AES = require("crypto-js/aes");

const ImportWallet = () => {
  const { setScreen, setPassword, setError, setCurrentWalletAddress, error } =
    useContext(ScreenContext);
  const [pKey, setPkey] = useState(
    "1fe001cdfeed0e55af243b20d1052c0fbdfea133c12bdeb7ad57c0d68bd99273"
  );
  const [passwordKey, setPasswordKey] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let wallet = new ethers.Wallet(pKey);

    if (wallet && wallet.address) {
      let encrypted = AES.encrypt(pKey, passwordKey).toString();
      console.log(encrypted);

      let existingWallets = localStorage.getItem("ss_saved_wallets");
      existingWallets = JSON.parse(existingWallets) || [];

      if (!existingWallets.includes(wallet.address)) {
        existingWallets.push(wallet.address);

        localStorage.setItem(
          "ss_saved_wallets",
          JSON.stringify(existingWallets)
        );
      }
      localStorage.setItem(wallet.address, encrypted);

      setCurrentWalletAddress(wallet.address);
      setPassword(passwordKey);
      setScreen("wallet");
    } else {
      setError("Invalid Private Key. Unable to load wallet");
    }
  };
  return (
    <div className="import-screen">
      <h2>Import existing Wallet</h2>

      <p style={{ color: "red" }}>{error}</p>

      <form onSubmit={handleFormSubmit}>
        <div className="input-holder">
          <input
            type="text"
            className="form-control"
            name="privateKey"
            placeholder="Your Private key"
            value={pKey}
            required={true}
            onChange={(e) => setPkey(e.target.value)}
          />
        </div>
        <div className="input-holder">
          <input
            type="password"
            placeholder="Create a PasswordKey"
            className="form-control"
            name="passwordKey"
            value={passwordKey}
            required={true}
            onChange={(e) => setPasswordKey(e.target.value)}
          />
        </div>
        <p className="helper-text">
          This password will be used to encrypt your keys. Please save it in a
          safe place
        </p>
        <button className="submit-button" type="submit">
          Import Wallet
        </button>
      </form>
    </div>
  );
};

export default ImportWallet;
