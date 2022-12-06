import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { BULL } from 'config/constants/tokens'
import { FAST_INTERVAL } from 'config/constants'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useSWR from 'swr'
import { BIG_ZERO } from 'utils/bigNumber'
import { ethRpcProvider } from 'utils/providers'
import { useTokenContract } from './useContract'
import { useSWRContract } from './useSWRContract'
import useActiveWeb3React from './useActiveWeb3React'

const useTokenBalance = (tokenAddress: string, forceBSC?: boolean) => {
  const { account } = useWeb3React()

  const contract = useTokenContract(tokenAddress, false)

  const key = useMemo(
    () =>
      account
        ? {
          contract: forceBSC ? contract.connect(ethRpcProvider) : contract,
          methodName: 'balanceOf',
          params: [account],
        }
        : null,
    [account, contract, forceBSC],
  )

  const { data, status, ...rest } = useSWRContract(key as any, {
    refreshInterval: FAST_INTERVAL,
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: data ? new BigNumber(data.toString()) : BIG_ZERO,
  }
}

export const useGetBnbBalance = () => {
  const { account } = useWeb3React()
  const { status, data, mutate } = useSWR([account, 'bnbBalance'], async () => {
    return ethRpcProvider.getBalance(account)
  })

  return { balance: data || Zero, fetchStatus: status, refresh: mutate }
}

export const useGetCakeBalance = () => {
  const { chainId } = useActiveWeb3React()
  const { balance, fetchStatus } = useTokenBalance(BULL[chainId]?.address || BULL[ChainId.BSC]?.address, false)

  // TODO: Remove ethers conversion once useTokenBalance is converted to ethers.BigNumber
  return { balance: EthersBigNumber.from(balance.toString()), fetchStatus }
}

export default useTokenBalance
