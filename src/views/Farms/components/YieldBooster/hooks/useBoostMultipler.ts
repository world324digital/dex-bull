import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeFarmBoosterContract, useMasterchef } from 'hooks/useContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import masterChefAbi from 'config/abi/masterchef.json'
import { FixedNumber } from '@ethersproject/bignumber'
import { multicallv2 } from 'utils/multicall'
import { useCallback } from 'react'
import useSWR from 'swr'
import _toNumber from 'lodash/toNumber'
import { YieldBoosterState } from './useYieldBoosterState'

const PRECISION_FACTOR = FixedNumber.from('1000000000000') // 1e12

async function getPublicMultipler({ farmBoosterContract, chainId }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'cA',
    },
    {
      address: farmBoosterContract.address,
      name: 'CA_PRECISION',
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv2(farmBoosterAbi, calls, { chainId })

  if (!data) return 0

  const [[cA], [CA_PRECISION], [BOOST_PRECISION]] = data

  const MAX_BOOST_PRECISION = FixedNumber.from(CA_PRECISION)
    .divUnsafe(FixedNumber.from(cA))
    .mulUnsafe(PRECISION_FACTOR)
    .subUnsafe(FixedNumber.from(BOOST_PRECISION))

  const boostPercent = PRECISION_FACTOR.addUnsafe(MAX_BOOST_PRECISION).divUnsafe(PRECISION_FACTOR)

  return _toNumber(boostPercent.round(3).toString())
}

async function getUserMultipler({ farmBoosterContract, account, pid, chainId }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'getUserMultiplier',
      params: [account, pid],
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv2(farmBoosterAbi, calls, { chainId })

  if (!data) return 0

  const [[multipler], [BOOST_PRECISION]] = data

  return _toNumber(
    PRECISION_FACTOR.addUnsafe(FixedNumber.from(multipler))
      .subUnsafe(FixedNumber.from(BOOST_PRECISION))
      .divUnsafe(PRECISION_FACTOR)
      .round(3)
      .toString(),
  )
}

async function getMultiplerFromMC({ pid, proxyAddress, masterChefContract, chainId }): Promise<number> {
  const calls = [
    {
      address: masterChefContract.address,
      name: 'getBoostMultiplier',
      params: [proxyAddress, pid],
    },
  ]

  const data = await multicallv2(masterChefAbi, calls, { chainId })

  if (!data?.length) return 0

  const [[boostMultiplier]] = data

  return _toNumber(FixedNumber.from(boostMultiplier).divUnsafe(PRECISION_FACTOR).round(3).toString())
}

export default function useBoostMultipler({ pid, boosterState, proxyAddress }): number {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const masterChefContract = useMasterchef()

  const { chainId, account } = useActiveWeb3React()

  const shouldGetFromSC = [YieldBoosterState.DEACTIVE, YieldBoosterState.ACTIVE, YieldBoosterState.MAX].includes(
    boosterState,
  )
  const should1X = [YieldBoosterState.LOCKED_END].includes(boosterState)

  const getMultipler = useCallback(async () => {
    if (shouldGetFromSC) {
      return getMultiplerFromMC({ pid, masterChefContract, proxyAddress, chainId })
    }

    return should1X
      ? getUserMultipler({ farmBoosterContract, pid, account, chainId })
      : getPublicMultipler({
        farmBoosterContract,
        chainId
      })
  }, [farmBoosterContract, masterChefContract, should1X, shouldGetFromSC, pid, account, proxyAddress, chainId])

  const { data } = useSWR(['boostMultipler', should1X ? `user${pid}` : 'public'], getMultipler)

  return data || 0
}
