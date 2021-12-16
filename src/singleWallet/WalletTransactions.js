import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { getERC20TransactionsFilter } from "../ERC20EventFilters";
import { getERC721TransactionsFilter } from "../ERC721EventFilters";

const WalletTransactions = ({ wallet, supportedTokens, supportedNFTs }) => {
  const [ERC20transactions, setERC20Transactions] = useState([]);
  const [ERC721transactions, setERC721Transactions] = useState([]);

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

  const refreshERC721Transactions = async () => {
    let erc721txs = await Promise.all(
      supportedNFTs.map((token) => {
        return getERC721TransactionsFilter(wallet.address, token.address);
      })
    ).then((logs) => {
      return logs.reduce((agg, log) => [...agg, ...log], []);
    });
    setERC721Transactions(erc721txs);
  };

  useEffect(() => {
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

    const getERC721Transactions = async () => {
      let erc721txs = await Promise.all(
        supportedNFTs.map((token) => {
          return getERC721TransactionsFilter(wallet.address, token.address);
        })
      ).then((logs) => {
        return logs.reduce((agg, log) => [...agg, ...log], []);
      });
      setERC721Transactions(erc721txs);
    };
    getERC721Transactions();
    getERC20Transactions();
  }, [wallet.address, supportedTokens, supportedNFTs]);

  if (wallet && wallet.address)
    return (
      <Box p={5} maxW={1040} m="20px auto">
        <Flex direction={"row"} justifyContent={"space-between"}>
          <Heading size={"lg"} textAlign={"center"}>
            ERC20 Token Transactions
          </Heading>
          <Button
            onClick={(e) => [
              refreshERC20Transactions(),
              refreshERC721Transactions(),
            ]}
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
        <Divider m="50px 0" />
        <Flex direction={"row"} justifyContent={"space-between"}>
          <Heading size={"lg"} textAlign={"center"}>
            ERC721 Token Transactions
          </Heading>
          <Button
            onClick={(e) => [
              refreshERC20Transactions(),
              refreshERC721Transactions(),
            ]}
            size={"xs"}
          >
            Refresh
          </Button>
        </Flex>

        <Stack m={"30px 0"}>
          {ERC721transactions.map((tx, x) => (
            <TransactionDetail721
              wallet={wallet}
              supportedNFTs={supportedNFTs}
              key={x}
              tx={tx}
            />
          ))}
        </Stack>
      </Box>
    );
};

const TransactionDetail = ({ tx, supportedTokens, wallet }) => {
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
          {src === "0x0000000000000000000000000000000000000000"
            ? "Minted"
            : "Token Tansfer"}{" "}
          - {tokenName}
        </Heading>

        {val.gt(0) ? (
          <Text fontSize={14}>
            <strong>Value: </strong>
            {formatEther(val || 0)} {tokenName}
          </Text>
        ) : (
          <></>
        )}
        {src === "0x0000000000000000000000000000000000000000" ? (
          <></>
        ) : dst === wallet.address ? (
          <Text fontSize={14}>
            <strong>Received from: </strong>
            {src}
          </Text>
        ) : (
          <Text fontSize={14}>
            <strong>Sent to: </strong>
            {dst}
          </Text>
        )}
        <Text fontSize={14}>
          <strong>Transaction Hash: </strong>
          {tx.transactionHash}
        </Text>
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
        <Button size="sm" onClick={(e) => openOnEtherscan(tx.transactionHash)}>
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

const TransactionDetail721 = ({ tx, supportedNFTs, wallet }) => {
  const openOnEtherscan = (hash, type = "tx") => {
    window.open(`https://rinkeby.etherscan.io/${type}/${hash}`, "_blank");
  };

  const [d, src, dst] = tx.topics;

  const tokenName = supportedNFTs.filter(
    (token) => token.address === tx.address
  )[0].symbol;

  return (
    <Flex borderBottom="1px solid #1a202c22" p="20px 15px" direction="row">
      <Stack flex="3">
        <Heading colorScheme={"teal"} size={"sm"}>
          {src ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
            ? "Minted"
            : "Token Tansfer"}{" "}
          - {tokenName}
        </Heading>
        {src ===
        "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
          <></>
        ) : dst === wallet.address ? (
          <Text fontSize={14}>
            <strong>Received from: </strong>
            {src}
          </Text>
        ) : (
          <Text fontSize={14}>
            <strong>Sent to: </strong>
            {dst}
          </Text>
        )}
        <Text fontSize={14}>
          <strong>Transaction Hash: </strong>
          {tx.transactionHash}
        </Text>
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
        <Button size="sm" onClick={(e) => openOnEtherscan(tx.transactionHash)}>
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
