import { avalandche } from '@pancakeswap/wagmi'
import { mainnet, arbitrum, optimism, polygon } from 'wagmi/chains'

// Chain Id is defined by Stargate
const stargateNetowrk = [
  {
    chainId: 1,
    name: 'Ethereum',
    chain: mainnet,
  },
  {
    chainId: 9,
    name: 'Matic',
    chain: polygon,
  },
  {
    chainId: 6,
    name: 'Avalanche',
    chain: avalandche,
  },
  {
    chainId: 10,
    name: 'Arbitrum',
    chain: arbitrum,
  },
  {
    chainId: 11,
    name: 'Optimism',
    chain: optimism,
  },
]

export const findChainByStargateId = (chainId: number) => stargateNetowrk.find((s) => s.chainId === chainId)
