import { Button } from "@chakra-ui/button";
import { Divider, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { formatEther } from "@ethersproject/units";
import React, { Fragment, useContext } from "react";
import { ScreenContext } from "../App";

const GeneratedWallet = ({
  setProgress,
  wallets,
  generateNewWallet,
  inProgress,
  passwordKey,
}) => {
  const { setPassword, setCurrentWalletAddress, setScreen } =
    useContext(ScreenContext);

  const handleGenerateWallet = (e) => {
    e.preventDefault();
    setProgress(true);
    generateNewWallet(wallets.length);
  };

  const handleTransferFromWallet = async (e) => {
    e.preventDefault();
    await setPassword(passwordKey);
    await setCurrentWalletAddress(wallets[e.target.dataset.walletid].address);
    setScreen("wallet");
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
            <Flex p="20px 0" direction="row">
              <Stack>
                <Text>
                  <strong>Wallet Address: </strong>
                  {wallet.address}
                </Text>
                <Text>
                  <strong>Balance: </strong>
                  {formatEther(wallet.balance)} ETH
                </Text>
              </Stack>

              <Stack>
                <Button
                  onClick={handleTransferFromWallet}
                  data-walletid={w}
                  colorScheme="teal"
                >
                  Transfer ETH
                </Button>
              </Stack>
            </Flex>
            <Divider />
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default GeneratedWallet;
