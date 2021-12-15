import { Contract, providers } from "ethers";

export const getERC20TransactionsFilter = async (
  walletAddress,
  tokenAddress
) => {
  const abi = [
    "event Transfer(address indexed src, address indexed dst, uint val)",
  ];

  let provider = new providers.JsonRpcProvider(
    "https://rinkeby.infura.io/v3/a610e824d6bc4bef94728de6b76a098f"
  );

  const contract = new Contract(tokenAddress, abi, provider);

  // List all token transfers *from* walletAddress
  const fromfilter = contract.filters.Transfer(walletAddress);
  const tofilter = contract.filters.Transfer(null, walletAddress);

  return [
    ...(await contract.queryFilter(fromfilter)),
    ...(await contract.queryFilter(tofilter)),
  ];
  // {
  //   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  //   topics: [
  //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
  //   ]
  // }

  // List all token transfers *to* walletAddress:
  //   contract.filters.Transfer(null, walletAddress);
  //   // {
  //   //   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  //   //   topics: [
  //   //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //   //     null,
  //   //     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72'
  //   //   ]
  //   // }

  //   // List all token transfers *from* walletAddress *to* walletAddress:
  //   contract.filters.Transfer(walletAddress, walletAddress);
  //   // {
  //   //   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  //   //   topics: [
  //   //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //   //     '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
  //   //     '0x000000000000000000000000ea517d5a070e6705cc5467858681ed953d285eb9'
  //   //   ]
  //   // }

  //   // List all token transfers *to* walletAddress OR walletAddress:
  //   contract.filters.Transfer(null, [walletAddress, walletAddress]);
  // {
  //   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  //   topics: [
  //     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //     null,
  //     [
  //       '0x0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72',
  //       '0x000000000000000000000000ea517d5a070e6705cc5467858681ed953d285eb9'
  //     ]
  //   ]
  // }
};
