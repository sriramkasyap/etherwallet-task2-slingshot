import { Flex, Heading, Text } from "@chakra-ui/layout";
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
    <Flex direction="column" alignItems="center" className="wallet-screen">
      <Heading size="md" m="20px 0 40px">
        Your Saved Wallet
      </Heading>

      {wallet ? (
        <>
          <Text marginBottom="2">
            <strong>Selected Network:</strong>4
          </Text>
          <Text marginBottom="2">
            <strong>Your Wallet Address:</strong>
            {wallet.address}
          </Text>
          <Text marginBottom="2">
            <strong>Your wallet Balance:</strong>
            {balance === null ? "Loading..." : formatEther(balance) + " ETH"}
          </Text>
        </>
      ) : (
        <p>"Loading your wallet. Please wait..."</p>
      )}
    </Flex>
  );
};

export default WalletScreen;
