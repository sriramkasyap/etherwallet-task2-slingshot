import { Button } from "@chakra-ui/button";
import { Divider, Flex, Stack } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { ScreenContext } from "./App";

const Onboarding = () => {
  const { setScreen } = useContext(ScreenContext);
  return (
    <Flex direction="column" alignItems="center">
      <Divider marginTop={10} marginBottom={10} />
      <Stack direction="row">
        <Button onClick={() => setScreen("login")}>Login</Button>
        <Button onClick={() => setScreen("create")}>Create New Wallet</Button>
        <Button onClick={() => setScreen("import")}>Import Wallet</Button>
      </Stack>
    </Flex>
  );
};

export default Onboarding;
