import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { serializeTokens } from 'utils/serializeTokens'
import { ethTokens, ethTokensGoerli } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens(ethTokens)
const serializedTokensTestnet = serializeTokens(ethTokensGoerli)

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto BULL</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/testnet/${ethTokensGoerli.bull.address}.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake BULL</Trans>,
    description: <Trans>Lock to earn BULL</Trans>,
    autoCompoundFrequency: 13000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/testnet/${ethTokensGoerli.bull.address}.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeFlexibleSideVault]: {
    name: <Trans>Stake BULL</Trans>,
    description: <Trans>Flexible staking to earn BULL</Trans>,
    autoCompoundFrequency: 13000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/testnet/${ethTokensGoerli.bull.address}.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO BULL',
    description: <Trans>Stake BULL to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${ethTokens.bull.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

export const livePools: SerializedPoolConfig[] = [

  {
    sousId: 0,
    stakingToken: serializedTokens.bull,
    earningToken: serializedTokens.bull,
    contractAddress: {
      5: '',
      1: '0x565aAA93a6586e3637AE1C5ECe989913072cF22C',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.25',
    isFinished: false,
  },
  // {
  //   sousId: 1,
  //   stakingToken: serializedTokens.gold,
  //   earningToken: serializedTokens.bull,
  //   contractAddress: {
  //     5: '',
  //     1: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '0.05',
  //   isFinished: false,
  // },
]

export const livePoolsTestnet: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: serializedTokensTestnet.bull,
    earningToken: serializedTokensTestnet.bull,
    contractAddress: {
      5: '0x8D2EdBf067ba5164b6884dE70b41802A111f6Dce',
      1: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.25',
    isFinished: false,
  },
  {
    sousId: 2,
    stakingToken: serializedTokensTestnet.gold,
    earningToken: serializedTokensTestnet.bull,
    contractAddress: {
      5: '0xd338C5A08F20442518758E45b0E54b8cCdC32dBC',
      1: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.05',
    isFinished: false,
  },
]

export const finishedPoolsTestnet: SerializedPoolConfig[] = [
  {
    sousId: 1,
    stakingToken: serializedTokensTestnet.gold,
    earningToken: serializedTokensTestnet.bull,
    contractAddress: {
      5: '0xCddA4A00b194c9FA16c88E7Ecb6408170f9Dd514',
      1: '',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.05',
    isFinished: true,
  },
]
// known finished pools
const finishedPools = [
].map((p) => ({ ...p, isFinished: true }))

export const poolsTestnet = [...livePoolsTestnet, ...finishedPoolsTestnet]

export default [...livePools, ...finishedPools]
