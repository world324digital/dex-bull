import orderBy from 'lodash/orderBy'
import { INFO_CLIENT, INFO_CLIENT_GOERLI } from 'config/constants/endpoints'
import { ONE_DAY_UNIX, ONE_HOUR_SECONDS } from 'config/constants/info'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { getUnixTime, startOfHour, sub } from 'date-fns'
import { Block } from 'state/info/types'
import { multiQuery } from 'views/Info/utils/infoQueryHelpers'
import { getDerivedPrices, getDerivedPricesQueryConstructor } from '../queries/getDerivedPrices'
import { PairDataTimeWindowEnum } from '../types'
import { ChainId, WNATIVE } from '../../../../packages/swap-sdk/src/constants'

const getTokenDerivedUsdPrices = async (tokenAddress: string, blocks: Block[], chainId: number) => {
  const infoClient = chainId === ChainId.BSC_TESTNET ? INFO_CLIENT_GOERLI : INFO_CLIENT
  const prices: any | undefined = await multiQuery(
    getDerivedPricesQueryConstructor,
    getDerivedPrices(tokenAddress, blocks),
    infoClient,
    200,
  )

  if (!prices) {
    console.error('Price data failed to load')
    return null
  }

  // format token BNB price results
  const tokenPrices: {
    tokenAddress: string
    timestamp: string
    derivedUSD: number
  }[] = []

  // Get Token prices in BNB
  Object.keys(prices).forEach((priceKey) => {
    const timestamp = priceKey.split('t')[1]
    if (timestamp) {
      tokenPrices.push({
        tokenAddress,
        timestamp,
        derivedUSD: prices[priceKey]?.derivedUSD ? parseFloat(prices[priceKey].derivedUSD) : 0,
      })
    }
  })

  return orderBy(tokenPrices, (tokenPrice) => parseInt(tokenPrice.timestamp, 10))
}

const getInterval = (timeWindow: PairDataTimeWindowEnum) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
      return ONE_HOUR_SECONDS
    case PairDataTimeWindowEnum.WEEK:
      return ONE_HOUR_SECONDS * 4
    case PairDataTimeWindowEnum.MONTH:
      return ONE_DAY_UNIX
    case PairDataTimeWindowEnum.YEAR:
      return ONE_DAY_UNIX * 15
    default:
      return ONE_HOUR_SECONDS * 4
  }
}

const getSkipDaysToStart = (timeWindow: PairDataTimeWindowEnum) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
      return 1
    case PairDataTimeWindowEnum.WEEK:
      return 7
    case PairDataTimeWindowEnum.MONTH:
      return 30
    case PairDataTimeWindowEnum.YEAR:
      return 365
    default:
      return 7
  }
}

// Fetches derivedBnb values for tokens to calculate derived price
// Used when no direct pool is available
const fetchDerivedPriceData = async (
  token0Address: string,
  token1Address: string,
  timeWindow: PairDataTimeWindowEnum,
  chainId: number
) => {
  let _token0Address = token0Address
  let _token1Address = token1Address
  if (typeof _token0Address === 'string' && _token0Address === 'eth') _token0Address = WNATIVE[chainId ?? ChainId.BSC].address.toLowerCase()
  if (typeof _token1Address === 'string' && _token1Address === 'eth') _token1Address = WNATIVE[chainId ?? ChainId.BSC].address.toLowerCase()
  const interval = getInterval(timeWindow)
  const endTimestamp = getUnixTime(new Date())
  const startTimestamp = getUnixTime(startOfHour(sub(endTimestamp * 1000, { days: getSkipDaysToStart(timeWindow) })))
  const timestamps = []
  let time = startTimestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
  }

  try {
    const blocks = await getBlocksFromTimestamps(timestamps, chainId, 'asc', 500)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks for timestamps', timestamps)
      return null
    }

    const [token0DerivedUsd, token1DerivedUsd] = await Promise.all([
      getTokenDerivedUsdPrices(_token0Address, blocks, chainId),
      getTokenDerivedUsdPrices(_token1Address, blocks, chainId),
    ])
    return { token0DerivedUsd, token1DerivedUsd }
  } catch (error) {
    console.error('Failed to fetched derived price data for chart', error)
    return null
  }
}

export default fetchDerivedPriceData
