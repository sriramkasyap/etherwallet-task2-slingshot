import { AES, enc } from "crypto-js";
import React, { useContext, useState } from "react";
import { ScreenContext } from "./App";

const LoginScreen = () => {
  const { setPassword, setScreen, setError, error } = useContext(ScreenContext);
  const [passwordKey, setPasswordKey] = useState();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let encryptedPKey = localStorage.getItem("sling_saved_pkey");

    try {
      AES.decrypt(encryptedPKey, passwordKey).toString(enc.Utf8);

      setPassword(passwordKey);

      setScreen("wallet");
    } catch (e) {
      setError("Decryption failed. Incorrect Password.");
    }
  };

  return (
    <div className="login-screen">
      <h2>Login to access your wallet</h2>

      <p style={{ color: "red" }}>{error}</p>

      <form onSubmit={handleFormSubmit}>
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
