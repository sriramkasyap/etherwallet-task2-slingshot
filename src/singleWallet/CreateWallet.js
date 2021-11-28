import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Wallet } from "@ethersproject/wallet";
import { AES } from "crypto-js";
import React, { useContext, useState } from "react";
import { ScreenContext } from "../App";

const CreateWallet = () => {
  const { setPassword, setScreen, setCurrentWalletAddress } =
    useContext(ScreenContext);

  const [passwordKey, setPasswordKey] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let wallet = Wallet.createRandom();

    console.log(wallet.privateKey);

    let encrypted = AES.encrypt(wallet.privateKey, passwordKey).toString();
    console.log(encrypted);

    let existingWallets = localStorage.getItem("ss_saved_wallets");
    existingWallets = JSON.parse(existingWallets) || [];
    existingWallets.push(wallet.address);

    localStorage.setItem("ss_saved_wallets", JSON.stringify(existingWallets));

    localStorage.setItem(wallet.address, encrypted);
    setCurrentWalletAddress(wallet.address);
    setPassword(passwordKey);
    setScreen("wallet");
  };
  return (
    <Flex
      direction="column"
      maxW="600"
      m="0 auto"
      className="create-wallet-screen"
      alignItems="center"
    >
      <Heading size="md" m="20px 0 40px">
        Create a new Wallet
      </Heading>

      <form onSubmit={handleFormSubmit}>
        <Box className="input-holder">
          <Input
            type="password"
            placeholder="Create a Password"
            name="passwordKey"
            value={passwordKey}
            required={true}
            onChange={(e) => setPasswordKey(e.target.value)}
          />
        </Box>
        <Text className="helper-text">
          This password will be used to encrypt your keys. Please save it in a
          safe place
        </Text>
        <Button className="submit-button" type="submit">
          Create Wallet
        </Button>
      </form>
    </Flex>
  );
};

export default CreateWallet;
