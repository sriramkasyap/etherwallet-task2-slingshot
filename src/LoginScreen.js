import { AES, enc } from "crypto-js";
import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { Fragment } from "react";
import { ScreenContext } from "./App";

const LoginScreen = () => {
  const { setPassword, setScreen, setError, error, setCurrentWalletAddress } =
    useContext(ScreenContext);
  const [passwordKey, setPasswordKey] = useState();
  const [walletAddress, setWwalletAddress] = useState();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let encryptedPKey = localStorage.getItem(walletAddress);
    try {
      let pKey = AES.decrypt(encryptedPKey, passwordKey).toString(enc.Utf8);

      let wallet = new ethers.Wallet(pKey);

      setCurrentWalletAddress(wallet.address);

      setPassword(passwordKey);

      setScreen("wallet");
    } catch (e) {
      setError("Decryption failed. Incorrect Password.");
    }
  };

  let existingWallets = localStorage.getItem("ss_saved_wallets");

  existingWallets = JSON.parse(existingWallets) || [];

  return (
    <div className="login-screen">
      <h2>Login to access your wallet</h2>

      <p style={{ color: "red" }}>{error}</p>

      <form onSubmit={handleFormSubmit}>
        <div className="input-holder">
          {existingWallets.map((ew, i) => (
            <div key={i}>
              <input
                type="radio"
                name="walletAddress"
                value={ew}
                checked={walletAddress === ew}
                title={ew}
                onChange={(e) => setWwalletAddress(e.target.value)}
              />
              <label>{ew}</label>
            </div>
          ))}
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

        <button className="submit-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
