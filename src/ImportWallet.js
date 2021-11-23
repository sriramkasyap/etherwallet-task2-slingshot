import React, { useContext, useState } from "react";
import { ScreenContext } from "./App";
var AES = require("crypto-js/aes");

const ImportWallet = () => {
  const { setScreen, setPassword } = useContext(ScreenContext);
  const [pKey, setPkey] = useState(
    "1fe001cdfeed0e55af243b20d1052c0fbdfea133c12bdeb7ad57c0d68bd99273"
  );
  const [passwordKey, setPasswordKey] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let encrypted = AES.encrypt(pKey, passwordKey).toString();
    console.log(encrypted);
    localStorage.setItem("sling_saved_pkey", encrypted);
    setPassword(passwordKey);
    setScreen("wallet");
  };
  return (
    <div className="import-screen">
      <h2>Import existing Wallet</h2>

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
            type="passwordKey"
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
