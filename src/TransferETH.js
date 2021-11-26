import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { commify, formatUnits, parseEther } from "@ethersproject/units";
import { AES, enc, lib } from "crypto-js";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ScreenContext } from "./App";

const TransferETH = () => {
  const [successMsg, setSuccess] = useState();
  const { setError, error, currentWalletAddress, password } =
    useContext(ScreenContext);
  const [progress, setProgress] = useState(false);
  const [address, setAddress] = useState("");
  const [transferAmount, setTransferAmt] = useState(0);
  const [currentGasPrice, setCGP] = useState();
  const [wallet, setWallet] = useState();

  const startPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(true);
    try {
      if (transferAmount === 0)
        throw new Error("Transfer amount cannot be zero");

      if (!wallet._isSigner)
        throw new Error("Authorization Failed. Please try Again");

      let currentBalance = await wallet.getBalance();

      if (currentBalance.lte(parseEther(transferAmount)))
        throw new Error(
          "You do not sufficient ETH in your account to execute this transaction. Please try adding some. "
        );

      ethers.utils.getAddress(address);
      let tx = await wallet.sendTransaction({
        to: address,
        value: parseEther(transferAmount),
      });

      console.log(tx);
      setSuccess(
        `Transfer Completed successfully. Transaction hash: ${tx.hash}`
      );
      setAddress("");
      setTransferAmt(0);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setProgress(false);
    }
  };

  useEffect(() => {
    if (!wallet) {
      let provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );
      let nosalt = lib.WordArray.random(0);

      let pKeyEnc = localStorage.getItem(currentWalletAddress);
      let pKey = AES.decrypt(pKeyEnc, password, {
        salt: nosalt,
      }).toString(enc.Utf8);

      setWallet(new ethers.Wallet(pKey, provider));
    } else {
      async function setgasprice() {
        let ggp = await wallet.getGasPrice();
        setCGP(ggp);
      }
      setgasprice();
    }
  }, [currentWalletAddress, password, setWallet, wallet, setCGP]);

  return (
    <Flex direction="column" w="100%">
      <Flex alignItems="center" direction="row" justifyContent="space-between">
        <Heading size="md" m="20px 0">
          Transfer ETH
        </Heading>

        <Text>
          <strong>Current Gas Price: </strong>
          {!currentGasPrice
            ? "Loading..."
            : commify(formatUnits(currentGasPrice, "gwei")) + " Gwei"}
        </Text>
      </Flex>
      <form onSubmit={startPayment}>
        <Stack spacing={8}>
          <FormControl>
            <FormLabel htmlFor="recipient">Recipient Wallet Address</FormLabel>
            <Input
              placeholder="Starts with 0x...."
              type="text"
              name="recipient"
              id="recipient"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="ethValue">ETH Value to transfer</FormLabel>
            <Input
              placeholder="Tranfer Amount"
              type="number"
              name="ethValue"
              id="ethValue"
              value={transferAmount}
              onChange={(e) => setTransferAmt(e.target.value)}
            />
          </FormControl>
          <Button disabled={progress} type="submit">
            {progress ? "Processing...." : "Transfer"}
          </Button>
        </Stack>
        <Box m="20px 0">
          <Text color="green">{successMsg}</Text>
          <Text color="red">{error}</Text>
        </Box>
      </form>
    </Flex>
  );
};

export default TransferETH;
