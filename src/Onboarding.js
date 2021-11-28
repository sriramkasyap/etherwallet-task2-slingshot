import { Button } from "@chakra-ui/button";
import { Divider, Flex, Heading, Stack } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { ScreenContext } from "./App";

const Onboarding = () => {
  const { setScreen } = useContext(ScreenContext);
  return (
    <Flex
      direction="row"
      alignItems="stretch"
      justifyContent="center"
      p="50px"
      flexWrap="wrap"
    >
      <Stack spacing={5} m="20px 40px" direction="column">
        <Heading size="md" textAlign="center">
          Externaly owned Wallet
        </Heading>
        <Button onClick={() => setScreen("create")}>Create New Wallet</Button>
        <Button onClick={() => setScreen("import")}>Import Wallet</Button>
      </Stack>
      <Divider orientation="vertical" />
      <Stack spacing={5} m="20px 40px" direction="column">
        <Heading size="md" textAlign="center">
          HD Wallet
        </Heading>
        <Button onClick={() => setScreen("create-hd")}>
          Create New Seed Phrase
        </Button>
        <Button onClick={() => setScreen("import-hd")}>
          Import wallets from Seed Phrase
        </Button>
      </Stack>
      <Flex flex="100%" mt="10" justifyContent="center">
        <Button onClick={() => setScreen("login")}>
          Login to saved wallet
        </Button>
      </Flex>
    </Flex>
  );
};

export default Onboarding;
