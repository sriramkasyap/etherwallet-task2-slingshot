import { Box, Divider, Flex, Heading, Text, Stack } from "@chakra-ui/layout";
import {
  Link,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
} from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { AES, enc, lib } from "crypto-js";
import { ethers, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { ScreenContext } from "../App";
import TransferETH from "./TransferETH";
import ERC721_ABI from "../ERC721_ABI";

const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const WalletScreen = () => {
  const [wallet, setWallet] = useState();
  const [error, setError] = useState();
  const [importing, setImporting] = useState();
  const [tokenAddress, setTokenAddress] = useState("");
  const [erc721tokenAddress, setERC721TokenAddress] = useState("");
  const { password, setScreen, currentWalletAddress } =
    useContext(ScreenContext);
  const [balance, setBalance] = useState(null);
  const [supportedTokens, setSupportedTokens] = useState([]);
  const [supportedNFTs, setSupportedNFTs] = useState([]);

  useEffect(() => {
    if (
      !(
        password &&
        password.length > 0 &&
        currentWalletAddress &&
        currentWalletAddress.length > 0
      )
    )
      setScreen("onboard");
  }, [password, setScreen, currentWalletAddress]);

  useEffect(() => {
    let nosalt = lib.WordArray.random(0);
    let pKeyEncrypted = localStorage.getItem(currentWalletAddress);
    let pKey = AES.decrypt(pKeyEncrypted, password, { salt: nosalt }).toString(
      enc.Utf8
    );
    setWallet(new ethers.Wallet(pKey));
  }, [setWallet, password, currentWalletAddress]);

  useEffect(() => {
    async function setwalletBalance() {
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );
      let balance = await provider.getBalance(wallet.address);
      setBalance(balance);
    }

    const getERC20Balances = async () => {
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );

      let tokens = JSON.parse(localStorage.getItem("SupportedTokens") || "[]");
      let tokensWithBalance = [];
      await Promise.all(
        tokens.map(async (token) => {
          let erc20Contract = new ethers.Contract(
            token.address,
            ERC20_ABI,
            provider
          );
          return erc20Contract
            .balanceOf(wallet.address)
            .then((curWalletBalance) => {
              if (curWalletBalance.gt(0)) {
                tokensWithBalance.push({
                  ...token,
                  balance: curWalletBalance,
                });
              }
            });
        })
      );
      setSupportedTokens(tokensWithBalance);
    };

    const getERC721Balances = async () => {
      setImporting(true);
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );

      let tokens = JSON.parse(localStorage.getItem("SupportedNFTs") || "[]");
      let tokensWithBalance = [];
      await Promise.all(
        tokens.map(async (token) => {
          let erc721contract = new ethers.Contract(
            token.address,
            ERC721_ABI,
            provider
          );
          return erc721contract
            .balanceOf(wallet.address)
            .then(async (curWalletBalance) => {
              if (curWalletBalance.gt(0)) {
                let nftokens = await getNFTList(
                  token.address,
                  curWalletBalance
                );
                tokensWithBalance.push({
                  ...token,
                  balance: curWalletBalance,
                  nftokens,
                });
              }
            });
        })
      );
      setSupportedNFTs(tokensWithBalance);
      setImporting(false);
    };

    if (wallet) {
      setwalletBalance();
      getERC20Balances();
      getERC721Balances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const refreshERC20Balances = async () => {
    setImporting(true);
    let tokens = JSON.parse(localStorage.getItem("SupportedTokens") || "[]");
    let tokensWithBalance = [];
    let provider = new providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
    );

    await Promise.all(
      tokens.map(async (token) => {
        let erc20Contract = new ethers.Contract(
          token.address,
          ERC20_ABI,
          provider
        );
        return erc20Contract
          .balanceOf(wallet.address)
          .then((curWalletBalance) => {
            if (curWalletBalance.gt(0)) {
              tokensWithBalance.push({
                ...token,
                balance: curWalletBalance,
              });
            }
          });
      })
    );
    setSupportedTokens(tokensWithBalance);
    setImporting(false);
  };

  const refreshERC721Balances = async () => {
    setImporting(true);
    let tokens = JSON.parse(localStorage.getItem("SupportedNFTs") || "[]");
    let tokensWithBalance = [];
    let provider = new providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
    );

    await Promise.all(
      tokens.map(async (token) => {
        let erc721Contract = new ethers.Contract(
          token.address,
          ERC721_ABI,
          provider
        );
        return erc721Contract
          .balanceOf(wallet.address)
          .then(async (curWalletBalance) => {
            if (curWalletBalance.gt(0)) {
              let nftokens = await getNFTList(token.address, curWalletBalance);
              tokensWithBalance.push({
                ...token,
                balance: curWalletBalance,
                nftokens,
              });
            }
          });
      })
    );
    setSupportedNFTs(tokensWithBalance);
    setImporting(false);
  };

  const handleTokenImport = async (e) => {
    e.preventDefault();
    setError("");
    setImporting(true);
    try {
      let address = getAddress(tokenAddress);
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );
      let erc20Contract = new ethers.Contract(address, ERC20_ABI, provider);

      let supToken = {
        symbol: await erc20Contract.symbol(),
        name: await erc20Contract.name(),
        address: erc20Contract.address,
      };

      let tokens = JSON.parse(localStorage.getItem("SupportedTokens") || "[]");

      let exists = tokens.filter(
        (token) => token.address === erc20Contract.address
      );
      if (!(exists.length > 0)) {
        tokens.push(supToken);
      }

      await localStorage.setItem("SupportedTokens", JSON.stringify(tokens));
      refreshERC20Balances();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleNFTImport = async (e) => {
    e.preventDefault();
    setError("");
    setImporting(true);
    try {
      let address = getAddress(erc721tokenAddress);
      let provider = new providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
      );
      let erc721Contract = new ethers.Contract(address, ERC721_ABI, provider);
      let supToken = {
        symbol: await erc721Contract.symbol(),
        name: await erc721Contract.name(),
        address: erc721Contract.address,
      };

      let tokens = JSON.parse(localStorage.getItem("SupportedNFTs") || "[]");

      let exists = tokens.filter(
        (token) => token.address === erc721Contract.address
      );
      if (!(exists.length > 0)) {
        tokens.push(supToken);
      }

      await localStorage.setItem("SupportedNFTs", JSON.stringify(tokens));
      refreshERC721Balances();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const getNFTList = async (address, balance) => {
    let provider = new providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
    );
    let erc721Contract = new ethers.Contract(address, ERC721_ABI, provider);
    let nftokens = [];
    for (let i = 0; i < balance; i++) {
      let nfttoken = await erc721Contract.tokenOfOwnerByIndex(
        wallet.address,
        i
      );
      nftokens.push(nfttoken.toString());
    }
    return nftokens;
  };

  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        className="wallet-screen"
        maxW={800}
        m="0 auto"
      >
        <Heading size="md" m="20px 0 40px">
          Your Saved Wallet
        </Heading>

        {wallet ? (
          <>
            <Box>
              <Text color={"red"}>{error}</Text>
              <Text flex={1} maxW={"50%```"} marginBottom="2">
                <strong>Selected Network:</strong>4
              </Text>
              <Text flex={1} maxW={"50%```"} marginBottom="2">
                <strong>Your Wallet Address:</strong> {wallet.address}
              </Text>
            </Box>
            <Divider m="20px 0" />
            <Flex mt={5} width={"100%"} pb={5}>
              <Box pb={7} flex={3} pr={7} borderRight={"1px solid #eee"}>
                <Flex mb={5} justifyContent={"space-between"}>
                  <Heading size={"sm"} mb={5}>
                    Wallet Balances
                  </Heading>
                  <Button
                    disabled={importing}
                    onClick={(e) => refreshERC20Balances()}
                    size={"xs"}
                  >
                    Refresh
                  </Button>
                </Flex>

                <Table variant="simple" size={"sm"}>
                  <Thead>
                    <Tr>
                      <Th>Token</Th>
                      <Th>Description</Th>
                      <Th isNumeric>Balance</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>ETH</Td>
                      <Td>Ether</Td>
                      <Td whiteSpace={"nowrap"} isNumeric>
                        {balance !== null ? formatEther(balance) : "---"} ETH
                      </Td>
                    </Tr>
                    {supportedTokens.length > 0
                      ? supportedTokens.map((token, t) => {
                          return (
                            <Tr key={t}>
                              <Td>{token.symbol}</Td>
                              <Td>{token.name}</Td>
                              <Td whiteSpace={"nowrap"} isNumeric>
                                {token.balance !== null &&
                                token.balance !== undefined
                                  ? formatEther(token.balance)
                                  : "---"}{" "}
                                {token.symbol}
                              </Td>
                            </Tr>
                          );
                        })
                      : "Loading..."}
                  </Tbody>
                </Table>
              </Box>
              <Box flex={2} pl={7}>
                <Heading mb={5} size={"sm"}>
                  Import Token
                </Heading>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Token Contract Address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      disabled={importing}
                      h="1.75rem"
                      size="sm"
                      onClick={handleTokenImport}
                    >
                      {importing ? "..." : "Import"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Flex>
            <Divider m="20px 0" />
            <Flex mt={5} width={"100%"} pb={5}>
              <Box flex={3} borderRight={"1px solid #eee"} pb={7} pr={7}>
                <Flex justifyContent={"space-between"}>
                  <Heading mb={5} size={"md"}>
                    NFTs Owned
                  </Heading>
                  <Button
                    disabled={importing}
                    onClick={(e) => refreshERC721Balances()}
                    size={"xs"}
                  >
                    Refresh
                  </Button>
                </Flex>
                <Stack>
                  {!importing && supportedNFTs.length === 0 ? (
                    <Text>No NFTs Found</Text>
                  ) : null}
                  {supportedNFTs.map((nft, n) => {
                    return (
                      <Fragment key={n}>
                        <Flex pt={3} pb={3} justifyContent={"space-between"}>
                          <Text size={"xs"}>
                            <strong>Collection</strong>: {nft.symbol} (
                            {nft.name})
                          </Text>
                          <Text size={"xs"}>
                            <strong>You Own: </strong>
                            {ethers.utils.formatUnits(nft.balance, "wei")} NFTs
                          </Text>
                        </Flex>
                        <Flex alignItems={"center"}>
                          <Heading size={"xs"} maxW={"25%"}>
                            List of {nft.symbol}s you own:
                          </Heading>
                          <Box ml={5} justifySelf={"flex-start"}>
                            {nft.nftokens.map((n) => (
                              <Tag mr={2}>{n}</Tag>
                            ))}
                          </Box>
                          <Link
                            target={"_blank"}
                            justifySelf={"flex-end"}
                            ml="auto"
                            href={`https://rinkeby.etherscan.io/address/${nft.address}`}
                          >
                            <Text
                              size={"xs"}
                              textDecor={"underline"}
                              fontSize={10}
                            >
                              View on Etherscan
                            </Text>
                          </Link>
                        </Flex>

                        <Divider m="20px 0" />
                      </Fragment>
                    );
                  })}
                </Stack>
              </Box>
              <Box flex={2} pl={7}>
                <Heading mb={5} size={"sm"}>
                  Import NFTs
                </Heading>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="NFT Contract Address"
                    value={erc721tokenAddress}
                    onChange={(e) => setERC721TokenAddress(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      disabled={importing}
                      h="1.75rem"
                      size="sm"
                      onClick={handleNFTImport}
                    >
                      {importing ? "..." : "Import"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Flex>
            <Divider m="20px 0" />
          </>
        ) : (
          <p>"Loading your wallet. Please wait..."</p>
        )}
      </Flex>
      <TransferETH setBalance={setBalance} />
    </>
  );
};

export default WalletScreen;
