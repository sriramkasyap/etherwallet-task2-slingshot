import { Button, ButtonGroup } from "@chakra-ui/button";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { formatEther, formatUnits } from "@ethersproject/units";
import React, { useContext, useState } from "react";
import { TransferContext } from "./TransferETH";

const TxDisplay = () => {
  const { activeTxs, completedTxns } = useContext(TransferContext);
  return (
    <>
      {activeTxs && activeTxs.length > 0 ? (
        <Box m="20px 0">
          <Heading size="md" textAlign="center">
            Active Transactions
          </Heading>
          <Stack spacing={3} m="30px 0">
            {activeTxs.map((tx, t) => {
              if (tx) {
                return <TxRow key={t} tx={tx} status={"pending"} />;
              }
            })}
          </Stack>
        </Box>
      ) : (
        <></>
      )}
      <Divider m="30px 0" />
      {completedTxns.length > 0 ? (
        <Box m="20px 0">
          <Heading size="md" textAlign="center">
            Completed Transactions
          </Heading>
          <Stack spacing={3} m="30px 0">
            {completedTxns.map((tx, t) => {
              return <TxRow key={t} tx={tx} status={"completed"} />;
            })}
          </Stack>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

const TxRow = ({ tx, status }) => {
  const [txUpdating, setTxUpdating] = useState(false);
  const { SpeedupTransaction, CancelTransaction, setProgress } =
    useContext(TransferContext);

  const handleSpeedupTransaction = async (e) => {
    e.preventDefault();
    setProgress(true);
    setTxUpdating(true);
    SpeedupTransaction(tx).then((r) => {
      setTxUpdating(false);
    });
  };
  const handleCancelTransaction = (e) => {
    e.preventDefault();

    CancelTransaction(tx);
  };

  const openOnEtherscan = (e) => {
    e.preventDefault();
    window.open(`https://rinkeby.etherscan.io/tx/${tx.hash}`, "_blank");
  };

  return (
    <Flex
      borderBottom="1px solid #1a202c22"
      //   borderTop="1px solid #1a202c22"
      p="15px"
      direction="row"
    >
      <Stack flex="50%" maxW="50%">
        <Text fontSize={14}>
          <strong>Transaction Hash: </strong>
          {tx.hash}
        </Text>
        <Text fontSize={14}>
          <strong>Tx Value: </strong>
          {formatEther(tx.value || 0)} ETH
        </Text>
        <Text fontSize={14}>
          <strong>Sent to: </strong>
          {tx.to}
        </Text>
      </Stack>
      {status === "pending" ? (
        <Stack flex="50%" spacing={3} pl={10}>
          <Text fontSize={14}>
            <strong>Gas Limit: </strong>
            {tx.gasLimit.toString()}
          </Text>
          <Text fontSize={14}>
            <strong>Gas Price: </strong>
            {formatUnits(tx.gasPrice, "gwei")} Gwei
          </Text>
          <Text fontSize={14}>
            <strong>Nonce: </strong>
            {tx.nonce}
          </Text>
          <ButtonGroup justifyContent="space-between" spacing="3">
            <Button disabled={txUpdating} size="sm" onClick={openOnEtherscan}>
              View on Etherscan
            </Button>
            <Button
              disabled={txUpdating}
              size="sm"
              onClick={handleSpeedupTransaction}
              colorScheme="teal"
            >
              Speed Up
            </Button>
            <Button
              disabled={txUpdating}
              size="sm"
              colorScheme="red"
              onClick={handleCancelTransaction}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      ) : (
        <Stack flex="50%" spacing={3} pl={10}>
          <Text fontSize={14}>
            <strong>Gas Used: </strong>
            {tx.result.gasUsed.toString()}
          </Text>
          <Text fontSize={14}>
            <strong>Gas Price: </strong>
            {formatUnits(tx.result.effectiveGasPrice, "gwei")} Gwei
          </Text>
          <Text fontSize={14}>
            <strong>Gas Fee: </strong>
            {formatUnits(tx.result.cumulativeGasUsed, "gwei")} Gwei
          </Text>
        </Stack>
      )}
    </Flex>
  );
};

export default TxDisplay;
