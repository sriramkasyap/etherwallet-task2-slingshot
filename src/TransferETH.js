import { Button, ButtonGroup } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import {
  commify,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "@ethersproject/units";
import { AES, enc, lib } from "crypto-js";
import { ethers, BigNumber } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ScreenContext } from "./App";
import Common, { Chain, Hardfork } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import TxDisplay from "./TxDisplay";

const TransferContext = React.createContext();

const TransferETH = ({ setBalance }) => {
  const [successMsg, setSuccess] = useState();
  const { setError, error, currentWalletAddress, password } =
    useContext(ScreenContext);
  const [progress, setProgress] = useState(false);
  const [address, setAddress] = useState("");
  const [transferAmount, setTransferAmt] = useState(0);
  const [currentGasPrice, setCGP] = useState();
  const [provider, setProvider] = useState();
  const [completedTxns, setCompletedTxns] = useState([]);
  const [activeTxs, setActiveTxs] = useState([]);
  const [customGasPrice, setCustomGP] = useState(0);
  const [gasLimit, setGasLimit] = useState(21004);

  const SpeedupTransaction = (tx) => {
    let nosalt = lib.WordArray.random(0);

    let pKeyEnc = localStorage.getItem(currentWalletAddress);

    let pKey = AES.decrypt(pKeyEnc, password, {
      salt: nosalt,
    }).toString(enc.Utf8);

    const common = new Common({
      chain: Chain.Rinkeby,
      hardfork: Hardfork.London,
    });

    const newTxGasPrice = tx.gasPrice.add(tx.gasPrice.div(5));

    let txData = {
      nonce: tx.nonce,
      to: tx.to,
      value: tx.value._hex,
      gasPrice: newTxGasPrice._hex,
      gasLimit: tx.gasLimit._hex,
      data: tx.data,
    };

    let newtx = Transaction.fromTxData(txData, { common });
    newtx = newtx.sign(Buffer.from(pKey, "hex"));

    let newtxhex = newtx.serialize().toString("hex");

    return provider.sendTransaction("0x" + newtxhex).then((ptx) => {
      handlePostSendTransaction(ptx);
      setProgress(false);
    });
  };
  const CancelTransaction = (tx) => {
    let nosalt = lib.WordArray.random(0);

    let pKeyEnc = localStorage.getItem(currentWalletAddress);

    let pKey = AES.decrypt(pKeyEnc, password, {
      salt: nosalt,
    }).toString(enc.Utf8);

    const common = new Common({
      chain: Chain.Rinkeby,
      hardfork: Hardfork.London,
    });

    const newTxGasPrice = tx.gasPrice.add(tx.gasPrice.div(5));

    let txData = {
      nonce: tx.nonce,
      to: tx.to,
      value: BigNumber.from(0)._hex,
      gasPrice: newTxGasPrice._hex,
      gasLimit: tx.gasLimit._hex,
      data: tx.data,
    };

    let newtx = Transaction.fromTxData(txData, { common });
    newtx = newtx.sign(Buffer.from(pKey, "hex"));

    let newtxhex = newtx.serialize().toString("hex");

    return provider.sendTransaction("0x" + newtxhex).then((ptx) => {
      handlePostSendTransaction(ptx);
      setProgress(false);
    });
  };

  const startPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(true);
    try {
      if (transferAmount === 0)
        throw new Error("Transfer amount cannot be zero");

      let currentBalance = await provider.getBalance(currentWalletAddress);

      if (currentBalance.lte(parseEther(transferAmount)))
        throw new Error(
          "You do not sufficient ETH in your account to execute this transaction. Please try adding some. "
        );

      ethers.utils.getAddress(address);

      let nosalt = lib.WordArray.random(0);

      let pKeyEnc = localStorage.getItem(currentWalletAddress);

      let pKey = AES.decrypt(pKeyEnc, password, {
        salt: nosalt,
      }).toString(enc.Utf8);

      let prevTransactionCount = await provider.getTransactionCount(
        currentWalletAddress
      );

      const common = new Common({
        chain: Chain.Rinkeby,
        hardfork: Hardfork.London,
      });

      let txData = {
        nonce: BigNumber.from(prevTransactionCount)._hex,
        to: address,
        value: parseEther(transferAmount)._hex,
        gasPrice: parseUnits(customGasPrice, "gwei")._hex,
        gasLimit: BigNumber.from(gasLimit)._hex,
        data: "0x00",
      };

      let tx = Transaction.fromTxData(txData, { common });
      tx = tx.sign(Buffer.from(pKey, "hex"));

      let txhex = tx.serialize().toString("hex");

      provider.sendTransaction("0x" + txhex).then((ptx) => {
        handlePostSendTransaction(ptx);
        setProgress(false);
        setAddress("");
        setTransferAmt(0);
      });

      // setSuccess(
      //   `Transfer Completed successfully. Transaction hash: ${ptx.transactionHash}`
      // );
    } catch (error) {
      console.error(error);
      setError(error.message);
      setProgress(false);
    }
  };

  const handlePostSendTransaction = (tx) => {
    let newtxs = activeTxs.filter((at) => {
      return at.nonce !== tx.nonce;
    });
    setActiveTxs([...newtxs, tx]);
    provider.waitForTransaction(tx.hash).then((result) => {
      handleCompleteTransaction(tx, result);
    });
  };

  const handleCompleteTransaction = async (tx, result) => {
    setCompletedTxns([
      ...completedTxns,
      {
        ...tx,
        result,
      },
    ]);

    let newtxs = activeTxs.filter((at) => {
      return at.nonce !== tx.nonce;
    });
    setActiveTxs(newtxs);
    setBalance(await provider.getBalance(currentWalletAddress));
  };

  useEffect(() => {
    if (!provider) {
      setProvider(
        new ethers.providers.JsonRpcProvider(
          "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
        )
      );
    } else {
      async function setgasprice() {
        let ggp = await provider.getGasPrice();
        setCGP(ggp);
        setCustomGP(formatUnits(ggp, "gwei"));
      }
      setgasprice();
    }
  }, [setCGP, setProvider, provider]);

  const handleSendMaxEther = async (e) => {
    e.preventDefault();

    setProgress(true);

    setCGP(await provider.getGasPrice());
    let curBalance = await provider.getBalance(currentWalletAddress);

    if (curBalance.lte(0)) {
      setError("You do not have any ETH to transfer");
      setProgress(false);
      return;
    }

    let gasFee = parseUnits(customGasPrice, "gwei").mul(gasLimit);

    let transferrable = curBalance.sub(gasFee);

    setTransferAmt(formatEther(transferrable));
    setProgress(false);
  };

  return (
    <TransferContext.Provider
      value={{
        successMsg,
        progress,
        setProgress,
        address,
        transferAmount,
        currentGasPrice,
        provider,
        activeTxs,
        customGasPrice,
        gasLimit,
        completedTxns,
        SpeedupTransaction,
        CancelTransaction,
      }}
    >
      <Flex direction="column" w="100%" m="auto" maxW="800">
        <Flex
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
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
            <Flex direction="row">
              <FormControl mr={2}>
                <FormLabel htmlFor="recipient">
                  Recipient Wallet Address
                </FormLabel>
                <Input
                  required
                  placeholder="Starts with 0x...."
                  type="text"
                  name="recipient"
                  id="recipient"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormControl>
              <FormControl ml={2}>
                <FormLabel htmlFor="customGasPrice">
                  Custom Gas Price (Gwei)
                </FormLabel>
                <Input
                  required
                  placeholder=""
                  type="number"
                  name="customGasPrice"
                  id="customGasPrice"
                  value={customGasPrice}
                  onChange={(e) => setCustomGP(e.target.value)}
                />
              </FormControl>
            </Flex>
            <Flex direction="row">
              <FormControl mr={2}>
                <FormLabel htmlFor="gasLimit">Gas Limit</FormLabel>
                <Input
                  required
                  placeholder="Max gas to spend for a transaction"
                  type="number"
                  name="gasLimit"
                  id="gasLimit"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                />
              </FormControl>
              <FormControl ml={2}>
                <FormLabel htmlFor="ethValue">ETH Value to transfer</FormLabel>
                <Input
                  required
                  placeholder="Transfer Amount"
                  type="number"
                  name="ethValue"
                  id="ethValue"
                  value={transferAmount}
                  onChange={(e) => setTransferAmt(e.target.value)}
                />
              </FormControl>
            </Flex>
            <Flex justifyContent="flex-end">
              <ButtonGroup>
                <Button
                  disabled={progress || !currentGasPrice}
                  type="button"
                  onClick={handleSendMaxEther}
                >
                  {progress ? "Calculating...." : "Set Max Ether"}
                </Button>
                <Button
                  disabled={progress || !currentGasPrice}
                  type="submit"
                  colorScheme="green"
                >
                  {progress ? "Processing...." : "Transfer"}
                </Button>
              </ButtonGroup>
            </Flex>
          </Stack>
          <Box m="20px 0">
            <Text color="green">{successMsg}</Text>
            <Text color="red">{error}</Text>
          </Box>
        </form>
        <Divider m="30px 0" />
        <TxDisplay />
      </Flex>
    </TransferContext.Provider>
  );
};

export default TransferETH;

export { TransferContext };
