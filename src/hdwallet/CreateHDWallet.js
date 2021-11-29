import { Button } from "@chakra-ui/button";
import { Flex, Heading } from "@chakra-ui/layout";
import React, { useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { hdkey } from "ethereumjs-wallet";
import { encrypt } from "crypto-js/aes";
import GenerateSeed from "./GenerateSeed";
import GeneratedWallet from "./GeneratedWallet";
import { providers } from "ethers";
import ImportSeed from "./ImportSeed";

const CreateHDWallet = ({ isCreateView }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordKey, setPasswordKey] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [seed, setseed] = useState();
  const [wallets, setWallets] = useState([]);
  const [inProgress, setProgress] = useState(false);

  const addWallet = (wallet) => {
    setWallets([
      ...wallets.filter((w) => w.address !== wallet.address),
      wallet,
    ]);
  };

  const createMnemonic = async (e) => {
    e.preventDefault();
    setMnemonic(generateMnemonic());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!(passwordKey && passwordKey.length > 0)) {
      setErrorMessage("Please enter a passphrase");
      return;
    }
    setProgress(true);
    let encrypted = encrypt(mnemonic, passwordKey).toString();
    localStorage.setItem("hd_xpriv_encrypted", encrypted);

    let xPriv = await mnemonicToSeed(mnemonic);
    await setseed(xPriv);

    generateNewWallet(0, xPriv);
  };

  const handleImportSeedPhrase = async (e) => {
    e.preventDefault();

    if (!(passwordKey && passwordKey.length > 0)) {
      setErrorMessage("Please enter a passphrase");
      return;
    }

    if (!(mnemonic && mnemonic.trim().split(/\s+/g).length === 12)) {
      setErrorMessage("Please enter a valid seed phrase");
      return;
    }

    setProgress(true);
    let encrypted = encrypt(mnemonic, passwordKey).toString();
    localStorage.setItem("hd_xpriv_encrypted", encrypted);

    let xPriv = await mnemonicToSeed(mnemonic);
    await setseed(xPriv);

    generateNewWallet(0, xPriv);
  };

  const generateNewWallet = async (index = 0, xPrivKey = seed) => {
    const hdwallet = hdkey.fromMasterSeed(xPrivKey);
    const path = "m/44'/60'/0'/0";
    const wallet = hdwallet.derivePath(path).deriveChild(index).getWallet();

    let provider = new providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
    );

    let address = wallet.getAddressString();
    let balance = await provider.getBalance(address);
    let privateKey = wallet.getPrivateKeyString();

    addWallet({
      address,
      publicKey: wallet.getPublicKeyString(),
      privateKey,
      balance,
    });
    localStorage.setItem("hd_wallet_count", index + 1);
    let privateKeyEnc = encrypt(
      privateKey.substring(2),
      passwordKey
    ).toString();
    localStorage.setItem(address, privateKeyEnc);

    setProgress(false);
  };

  return (
    <Flex
      direction="column"
      maxW="600"
      m="0 auto"
      className="create-wallet-screen"
      alignItems="center"
    >
      <Heading size="md" m="20px 0 40px">
        HD Wallet
      </Heading>

      {isCreateView ? (
        <>
          {mnemonic && mnemonic.length > 0 ? (
            wallets && wallets.length > 0 ? (
              <>
                <GeneratedWallet
                  wallets={wallets}
                  generateNewWallet={generateNewWallet}
                  setProgress={setProgress}
                  inProgress={inProgress}
                />
              </>
            ) : (
              <GenerateSeed
                mnemonic={mnemonic}
                handleFormSubmit={handleFormSubmit}
                passwordKey={passwordKey}
                setPasswordKey={setPasswordKey}
                errorMessage={errorMessage}
                inProgress={inProgress}
              />
            )
          ) : (
            <>
              <Flex>
                <Button colorScheme="teal" onClick={createMnemonic}>
                  Generate Seed phrase
                </Button>
              </Flex>
            </>
          )}
        </>
      ) : wallets && wallets.length > 0 ? (
        <>
          <GeneratedWallet
            wallets={wallets}
            generateNewWallet={generateNewWallet}
            setProgress={setProgress}
            inProgress={inProgress}
            passwordKey={passwordKey}
          />
        </>
      ) : (
        <ImportSeed
          setMnemonic={setMnemonic}
          mnemonic={mnemonic}
          handleImportSeedPhrase={handleImportSeedPhrase}
          passwordKey={passwordKey}
          setPasswordKey={setPasswordKey}
          errorMessage={errorMessage}
          inProgress={inProgress}
        />
      )}

      {}
    </Flex>
  );
};

export default CreateHDWallet;
