import { Wallet } from "@ethersproject/wallet";
import { AES } from "crypto-js";
import React, { useContext, useState } from "react";
import { ScreenContext } from "./App";

const CreateWallet = () => {
  const { setPassword, setScreen } = useContext(ScreenContext);

  const [passwordKey, setPasswordKey] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let wallet = Wallet.createRandom();

    console.log(wallet.privateKey);

    let encrypted = AES.encrypt(wallet.privateKey, passwordKey).toString();
    console.log(encrypted);
    localStorage.setItem("sling_saved_pkey", encrypted);
    setPassword(passwordKey);
    setScreen("wallet");
  };
  return (
    <div className="create-wallet-screen">
      <h2>Create a new Wallet</h2>

      <form onSubmit={handleFormSubmit}>
        <div className="input-holder">
          <input
            type="passwordKey"
            placeholder="Create a Password"
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
          Create Wallet
        </button>
      </form>
    </div>
  );
};

export default CreateWallet;
