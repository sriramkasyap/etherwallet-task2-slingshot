import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { ScreenContext } from "./App";
var AES = require("crypto-js/aes");

const ImportWallet = () => {
  const { setScreen, setPassword, setError, setCurrentWalletAddress, error } =
    useContext(ScreenContext);
  const [pKey, setPkey] = useState();
  const [passwordKey, setPasswordKey] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
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
      }
    } catch (e) {
      console.error(e);
      setError("Invalid Private Key. Unable to load wallet");
    }
  };
  return (
    <Flex
      maxW="600"
      alignItems="center"
      direction="column"
      className="import-screen"
    >
      <Heading size="md" m="20px 0 30px">
        Import existing Wallet
      </Heading>

      <Text style={{ color: "red" }}>{error}</Text>

      <form onSubmit={handleFormSubmit}>
        <div className="input-holder">
          <Input
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
          <Input
            type="password"
            placeholder="Create a Password"
            name="passwordKey"
            value={passwordKey}
            required={true}
            onChange={(e) => setPasswordKey(e.target.value)}
          />
        </div>
        <Text className="helper-text">
          This password will be used to encrypt your keys. Please save it in a
          safe place
        </Text>
        <Button className="submit-button" type="submit">
          Import Wallet
        </Button>
      </form>
    </Flex>
  );
};

export default ImportWallet;
