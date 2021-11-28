import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/react";

const ImportSeed = ({
  mnemonic,
  setMnemonic,
  handleImportSeedPhrase,
  passwordKey,
  setPasswordKey,
  errorMessage,
  inProgress,
}) => {
  return (
    <Flex flexWrap="wrap">
      <Heading size="sm" m="10px 0">
        Your Seed Phrase
      </Heading>
      <form onSubmit={handleImportSeedPhrase}>
        <Box className="input-holder">
          <Textarea
            placeholder="Seed Phrase word list"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
        </Box>
        <Box className="input-holder">
          <Input
            type="password"
            placeholder="Create a Pass phrase"
            name="passwordKey"
            value={passwordKey}
            required={true}
            onChange={(e) => setPasswordKey(e.target.value)}
          />
        </Box>
        <Text className="helper-text" fontSize="14">
          This Passphrase will be used to encrypt and save your seed phrase.
          Please save it in a safe place
        </Text>
        <Button
          disabled={inProgress}
          className="submit-button"
          type="submit"
          colorScheme="teal"
        >
          Import
        </Button>
        <Text color="red">{errorMessage}</Text>
      </form>
    </Flex>
  );
};

export default ImportSeed;
