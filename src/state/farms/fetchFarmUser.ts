import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'config/constants/types'
import { ChainId } from '../../../packages/swap-sdk/src/constants'

export const fetchFarmUserAllowances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
  proxyAddress?: string,
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses, chainId)
    return { address: lpContractAddress, name: 'allowance', params: [account, proxyAddress || masterChefAddress] }
  })

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls, chainId)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses, chainId)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })
  const rawStakedBalances = await multicall(masterchefABI, calls, chainId)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = chainId === ChainId.BSC_TESTNET ? farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingBull',
      params: [farm.pid, account],
    }
  }) : farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingCake',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls, chainId)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
