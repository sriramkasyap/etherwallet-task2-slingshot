import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Code, Flex, Heading, Text } from "@chakra-ui/layout";

const GenerateSeed = ({
  mnemonic,
  handleFormSubmit,
  passwordKey,
  setPasswordKey,
  errorMessage,
}) => {
  return (
    <Flex flexWrap="wrap">
      <Heading size="sm" m="10px 0">
        Your Seed Phrase
      </Heading>
      <Code mb="5px" p="10px 20px" border="1px solid #ccc" borderRadius={5}>
        {mnemonic}
      </Code>
      <Text className="helper-text" fontSize="14">
        This Seed phrase can be used to generate your wallets in future. Please
        save it in a safe place
      </Text>
      <form onSubmit={handleFormSubmit}>
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
          This Passphrase will be used to generate and encrypt your seed phrase.
          Please save it in a safe place
        </Text>
        <Button className="submit-button" type="submit" colorScheme="teal">
          Save
        </Button>
        <Text color="red">{errorMessage}</Text>
      </form>
    </Flex>
  );
};

export default GenerateSeed;
