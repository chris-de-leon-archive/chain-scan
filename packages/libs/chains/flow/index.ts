import { createGrpcWebTransport } from "@connectrpc/connect-node"
import { type Client, createClient } from "@connectrpc/connect"
import type { Block } from "./client/flow/entities/block_pb"
import { encoding } from "@chain-scan/encoding"
import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"
import * as fcl from "@onflow/fcl"
import {
  type TransactionResultResponse,
  AccessAPI,
} from "./client/flow/access/access_pb"

export interface SerializableEvent {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  data: JSON
}

export interface SerializableTransaction {
  blockHeight: string
  blockId: string
  transactionId: string
  collectionId: string
  computationUsage: string
  status: string
  events: SerializableEvent[]
}

export interface SerializableBlock {
  id: string
  timestamp: Date | undefined
  height: string
  parentId: string
}

// NOTE: https://developers.flow.com/tools/clients/fcl-js/api
// NOTE: https://developers.flow.com/networks/access-onchain-data
export class Flow implements Chain<SerializableBlock, SerializableTransaction> {
  private readonly client: Client<typeof AccessAPI>

  constructor(private readonly url: string) {
    this.client = createClient(
      AccessAPI,
      createGrpcWebTransport({
        baseUrl: url,
        httpVersion: "1.1",
      }),
    )
  }

  /**
   * https://developers.flow.com/networks/access-onchain-data#transaction-status
   */
  static interpretFlowTransactionStatus(status: number) {
    if (status === 0) {
      return "UNKNOWN"
    }
    if (status === 1) {
      return "PENDING"
    }
    if (status === 2) {
      return "FINALIZED"
    }
    if (status === 3) {
      return "EXECUTED"
    }
    if (status === 4) {
      return "SEALED"
    }
    if (status === 5) {
      return "EXPIRED"
    }
    return "N/A"
  }

  static toSerializableEvents = async (
    tx: TransactionResultResponse,
  ): Promise<SerializableEvent[]> => {
    const trnxnID = encoding.hex.toString(tx.transactionId).withPrefix()
    const blockID = encoding.hex.toString(tx.blockId).withPrefix()
    return await fcl
      .decode({
        tag: "GET_TRANSACTION_STATUS",
        transactionId: trnxnID,
        transactionStatus: {
          blockId: blockID,
          status: tx.status,
          statusString: "",
          statusCode: tx.statusCode,
          errorMessage: tx.errorMessage,
          events: tx.events.map((event, i) => {
            const payload = JSON.parse(
              Buffer.from(event.payload).toString("utf-8"),
            )
            return {
              type: event.type,
              transactionId: trnxnID,
              transactionIndex: event.transactionIndex,
              eventIndex: i,
              payload,
            }
          }),
        },
      })
      .then((result) => result.events)
  }

  static toSerializableTransaction = async (
    tx: TransactionResultResponse,
  ): Promise<SerializableTransaction> => {
    return {
      transactionId: encoding.hex.toString(tx.transactionId).withPrefix(),
      collectionId: encoding.hex.toString(tx.collectionId).withPrefix(),
      blockHeight: tx.blockHeight.toString(),
      blockId: encoding.hex.toString(tx.blockId).withPrefix(),
      computationUsage: tx.computationUsage.toString(),
      events: await Flow.toSerializableEvents(tx),
      status: Flow.interpretFlowTransactionStatus(tx.status),
    }
  }

  static toSerializableBlock = (block: Block): SerializableBlock => {
    let timestamp: Date | undefined = undefined
    if (block.timestamp != null) {
      const ms = block.timestamp.seconds * 1000n
      if (ms <= BigInt(Number.MAX_SAFE_INTEGER)) {
        timestamp = new Date(Number(ms))
      }
    }

    return {
      id: encoding.hex.toString(block.id).withPrefix(),
      parentId: encoding.hex.toString(block.parentId).withPrefix(),
      height: block.height.toString(),
      timestamp,
    }
  }

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Flow.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransactionResult({
      id: encoding.hex.toBuffer(id),
    })

    return await Flow.toSerializableTransaction(tx)
  }

  getLatestBlockNumber = async () => {
    return await this.getBlockByNumber()
      .asIs()
      .then((b) => BigInt(b.height))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async () => {
      if (num == null) {
        const { block } = await this.client.getLatestBlock({ isSealed: true })
        if (block == null) {
          throw new Error("failed to retrieve latest block")
        } else {
          return block
        }
      }

      const { block } = await this.client.getBlockByHeight({
        height: BigInt(num),
      })
      if (block == null) {
        throw new Error(`failed to retrieve block at height "${num}"`)
      } else {
        return block
      }
    }

    return {
      asIs: async () => await getBlock().then(Flow.toSerializableBlock),
      withTransactions: async () => {
        const block = await getBlock()
        const trxns = await this.client
          .getTransactionResultsByBlockID({ blockId: block.id })
          .then((res) => res.transactionResults)

        return {
          block: Flow.toSerializableBlock(block),
          transactions: await Promise.all(
            trxns.map(Flow.toSerializableTransaction),
          ),
        }
      },
    }
  }
}
