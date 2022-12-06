import orderBy from 'lodash/orderBy'
import { gql } from 'graphql-request'
import { Block } from '../state/info/types'
import { multiQuery } from '../views/Info/utils/infoQueryHelpers'
import { BLOCKS_CLIENT, BLOCKS_CLIENT_GOERLI } from '../config/constants/endpoints'
import { ChainId } from '../../packages/swap-sdk/src/constants'

const getBlockSubqueries = (timestamps: number[]) =>
  timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
      } }) {
      number
    }`
  })

const blocksQueryConstructor = (subqueries: string[]) => {
  return gql`query blocks {
    ${subqueries}
  }`
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @param {Array} timestamps
 */
export const getBlocksFromTimestamps = async (
  timestamps: number[],
  chainId: number,
  sortDirection: 'asc' | 'desc' = 'desc',
  skipCount = 500
): Promise<Block[]> => {
  if (timestamps?.length === 0) {
    return []
  }
  const blocksClient = chainId === ChainId.BSC_TESTNET ? BLOCKS_CLIENT_GOERLI : BLOCKS_CLIENT

  const fetchedData: any = await multiQuery(
    blocksQueryConstructor,
    getBlockSubqueries(timestamps),
    blocksClient,
    skipCount,
  )

  const blocks: Block[] = []
  if (fetchedData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(fetchedData)) {
      if (fetchedData[key].length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: parseInt(fetchedData[key][0].number, 10),
        })
      }
    }
    // graphql-request does not guarantee same ordering of batched requests subqueries, hence manual sorting
    return orderBy(blocks, (block) => block.number, sortDirection)
  }
  return blocks
}
