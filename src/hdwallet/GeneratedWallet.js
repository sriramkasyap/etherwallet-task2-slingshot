import { Button } from "@chakra-ui/button";
import { Divider, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { formatEther } from "@ethersproject/units";
import React, { Fragment } from "react";

const GeneratedWallet = ({
  setProgress,
  wallets,
  generateNewWallet,
  inProgress,
}) => {
  const handleGenerateWallet = (e) => {
    e.preventDefault();
    setProgress(true);
    generateNewWallet(wallets.length);
  };
  return (
    <Stack w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" m={0}>
          Your Wallets
        </Heading>
        <Button disabled={inProgress} onClick={handleGenerateWallet}>
          Create new Wallet
        </Button>
      </Flex>
      <Stack paddingTop={5} marginTop="40px">
        {wallets.map((wallet, w) => (
          <Fragment key={w}>
            <Flex p="20px 0" direction="column">
              <Text>
                <strong>Wallet Address: </strong>
                {wallet.address}
              </Text>
              <Text>
                <strong>Balance: </strong>
                {formatEther(wallet.balance)} ETH
              </Text>
            </Flex>
            <Divider />
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default GeneratedWallet;
