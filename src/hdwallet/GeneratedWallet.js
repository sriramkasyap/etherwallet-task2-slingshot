import { Button } from "@chakra-ui/button";
import { Divider, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import React, { Fragment } from "react";

const GeneratedWallet = ({ wallets, generateNewWallet }) => {
  const handleGenerateWallet = (e) => {
    e.preventDefault();
    generateNewWallet(wallets.length);
  };
  return (
    <Stack w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md" m={0}>
          Your Wallets
        </Heading>
        <Button onClick={handleGenerateWallet}>Create new Wallet</Button>
      </Flex>
      <Stack>
        {wallets.map((wallet, w) => (
          <Fragment key={w}>
            <Flex p="20px 0">
              <Text>
                <strong>Wallet Address: </strong>
                {wallet.address}
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
