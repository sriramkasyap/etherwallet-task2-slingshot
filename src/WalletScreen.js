import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/layout";
import { formatEther } from "@ethersproject/units";
import { AES, enc, lib } from "crypto-js";
import { ethers, providers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ScreenContext } from "./App";
import TransferETH from "./TransferETH";

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
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );
      let balance = await provider.getBalance(wallet.address);
      setBalance(balance);
    }

    if (wallet) {
      setwalletBalance();
    }
  }, [wallet]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      className="wallet-screen"
      maxW={600}
      m="0 auto"
    >
      <Heading size="md" m="20px 0 40px">
        Your Saved Wallet
      </Heading>

      {wallet ? (
        <>
          <Box>
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
          </Box>
          <Divider m="20px 0" />
          <TransferETH />
        </>
      ) : (
        <p>"Loading your wallet. Please wait..."</p>
      )}
    </Flex>
  );
};

export default WalletScreen;
