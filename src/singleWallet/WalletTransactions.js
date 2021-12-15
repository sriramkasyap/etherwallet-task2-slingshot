import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { getERC20TransactionsFilter } from "../ERC20EventFilters";

const WalletTransactions = ({ wallet, supportedTokens }) => {
  const [transactions, setTransactions] = useState([]);
  const [ERC20transactions, setERC20Transactions] = useState([]);

  const refreshTransactions = async () => {
    let provider = new ethers.providers.EtherscanProvider(
      "rinkeby",
      "U8QD8TJTGES2BTISEJKZZPR3QHC5N54H17"
    );

    let txs = await provider.getHistory(wallet.address);

    txs = txs.sort((a, b) => b.timestamp - a.timestamp);
    setTransactions(txs);
  };

  const refreshERC20Transactions = async () => {
    let erc20txs = await Promise.all(
      supportedTokens.map((token) => {
        return getERC20TransactionsFilter(wallet.address, token.address);
      })
    ).then((logs) => {
      return logs.reduce((agg, log) => [...agg, ...log], []);
    });
    setERC20Transactions(erc20txs);
  };

  useEffect(() => {
    const getTransactions = async () => {
      let provider = new ethers.providers.EtherscanProvider(
        "rinkeby",
        "U8QD8TJTGES2BTISEJKZZPR3QHC5N54H17"
      );

      let txs = await provider.getHistory(wallet.address);
      txs = txs.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txs);
    };
    getTransactions();

    const getERC20Transactions = async () => {
      let erc20txs = await Promise.all(
        supportedTokens.map((token) => {
          return getERC20TransactionsFilter(wallet.address, token.address);
        })
      ).then((logs) => {
        return logs.reduce((agg, log) => [...agg, ...log], []);
      });
      setERC20Transactions(erc20txs);
    };

    getERC20Transactions();
  }, [wallet.address, supportedTokens]);

  if (wallet && wallet.address)
    return (
      <Box p={5} maxW={1040} m="20px auto">
        <Flex direction={"row"} justifyContent={"space-between"}>
          <Heading size={"lg"} textAlign={"center"}>
            ERC20 Token Transactions
          </Heading>
          <Button
            onClick={(e) => [refreshTransactions(), refreshERC20Transactions()]}
            size={"xs"}
          >
            Refresh
          </Button>
        </Flex>

        <Stack m={"30px 0"}>
          {ERC20transactions.map((tx, x) => (
            <TransactionDetail
              wallet={wallet}
              supportedTokens={supportedTokens}
              key={x}
              tx={tx}
            />
          ))}
        </Stack>
      </Box>
    );
};

const TransactionDetail = ({ tx, supportedTokens, wallet }) => {
  const [txUpdating, setTxUpdating] = useState(false);

  const openOnEtherscan = (hash, type = "tx") => {
    window.open(`https://rinkeby.etherscan.io/${type}/${hash}`, "_blank");
  };

  const { src, dst, val } = tx.args;

  const tokenName = supportedTokens.filter(
    (token) => token.address === tx.address
  )[0].symbol;

  return (
    <Flex borderBottom="1px solid #1a202c22" p="20px 15px" direction="row">
      <Stack flex="3">
        <Heading colorScheme={"teal"} size={"sm"}>
          {dst === wallet.address ? "Minted" : "Token Tansfer"} - {tokenName}
        </Heading>
        <Text fontSize={14}>
          <strong>Transaction Hash: </strong>
          {tx.transactionHash}
        </Text>
        {val.gt(0) ? (
          <Text fontSize={14}>
            <strong>Value: </strong>
            {formatEther(val || 0)} {tokenName}
          </Text>
        ) : (
          <></>
        )}
        {dst ? (
          <Text fontSize={14}>
            <strong>Sent to: </strong>
            {dst}
          </Text>
        ) : (
          <></>
        )}
      </Stack>
      <Stack flex="1" spacing={3} pl={10}>
        {/* <Text fontSize={14}>
            <strong>Gas Used: </strong>
            {tx.gasUsed.toString()}
          </Text>
          <Text fontSize={14}>
            <strong>Gas Price: </strong>
            {formatUnits(tx.effectiveGasPrice, "gwei")} Gwei
          </Text>
          <Text fontSize={14}>
            <strong>Gas Fee: </strong>
            {formatUnits(tx.cumulativeGasUsed, "gwei")} Gwei
          </Text> */}
        <Button
          disabled={txUpdating}
          size="sm"
          onClick={(e) => openOnEtherscan(tx.hash)}
        >
          View on Etherscan
        </Button>
        {tx.creates ? (
          <Button
            size="sm"
            colorScheme="teal"
            onClick={(e) => openOnEtherscan(tx.creates, "address")}
          >
            View Contract on Etherscan
          </Button>
        ) : (
          <></>
        )}
      </Stack>
    </Flex>
  );
};

export default WalletTransactions;
