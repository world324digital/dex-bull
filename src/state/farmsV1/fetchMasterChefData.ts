import masterchefABIV1 from 'config/abi/masterchefV1.json'
import chunk from 'lodash/chunk'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getMasterChefV1Address } from '../../utils/addressHelpers'
import { getMasterchefV1Contract } from '../../utils/contractHelpers'


export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  const masterChefContract = getMasterchefV1Contract(chainId)
  const poolLength = await masterChefContract.poolLength()
  return poolLength
}

const masterChefFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const masterChefAddress = getMasterChefV1Address(chainId)
  const { v1pid } = farm
  return v1pid || v1pid === 0
    ? [
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [v1pid],
      },
      {
        address: masterChefAddress,
        name: 'totalAllocPoint',
      },
    ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, chainId))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
  const masterChefMultiCallResult = await multicallv2(masterchefABIV1, masterChefAggregatedCalls)
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)
  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
