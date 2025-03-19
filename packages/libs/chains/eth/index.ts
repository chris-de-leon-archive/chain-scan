import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"
import { ethers } from "ethers"

export interface SerializableTransaction {
  maxPriorityFeePerGas: string | undefined
  maxFeePerBlobGas: string | undefined
  maxFeePerGas: string | undefined
  blockNumber: number | null
  blockHash: string | null
  gasLimit: string
  gasPrice: string
  chainId: string
  value: string
  index: number
  hash: string
  from: string
  to: string | null
}

export interface SerializableBlock {
  baseFeePerGas: string | undefined
  excessBlobGas: string | undefined
  blobGasUsed: string | undefined
  difficulty: string
  parentHash: string
  timestamp: number
  gasLimit: string
  gasUsed: string
  number: number
  hash: string | null
}

export class Eth implements Chain<SerializableBlock, SerializableTransaction> {
  private readonly client: ethers.JsonRpcProvider

  constructor(private readonly url: string) {
    this.client = new ethers.JsonRpcProvider(url)
  }

  static toSerializableTransaction = (
    tx: ethers.TransactionResponse,
  ): SerializableTransaction => {
    return {
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
      maxFeePerBlobGas: tx.maxFeePerBlobGas?.toString(),
      maxFeePerGas: tx.maxFeePerGas?.toString(),
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      gasLimit: tx.gasLimit.toString(),
      gasPrice: tx.gasPrice.toString(),
      chainId: tx.chainId.toString(),
      value: tx.value.toString(),
      index: tx.index,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
    }
  }

  static toSerializableBlock = (block: ethers.Block): SerializableBlock => {
    return {
      baseFeePerGas: block.baseFeePerGas?.toString(),
      excessBlobGas: block.excessBlobGas?.toString(),
      blobGasUsed: block.blobGasUsed?.toString(),
      difficulty: block.difficulty.toString(),
      parentHash: block.parentHash,
      gasLimit: block.gasLimit.toString(),
      gasUsed: block.gasUsed.toString(),
      timestamp: block.timestamp,
      number: block.number,
      hash: block.hash,
    }
  }

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Eth.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransaction(id)
    if (tx == null) {
      throw new Error(`transaction with ID "${id}" does not exist`)
    } else {
      return Eth.toSerializableTransaction(tx)
    }
  }

  getLatestBlockNumber = async () => {
    return await this.client.getBlockNumber().then((n) => BigInt(n))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async (withTransactions: boolean) => {
      const blockHeight = num != null ? num : await this.client.getBlockNumber()

      const block = await this.client.getBlock(blockHeight, withTransactions)
      if (block == null) {
        throw new Error(`block with number "${num}" does not exist`)
      } else {
        return block
      }
    }

    return {
      asIs: async () => await getBlock(false).then(Eth.toSerializableBlock),
      withTransactions: async () => {
        const block = await getBlock(true)
        const trxns = block.transactions.map((hash) =>
          block.getPrefetchedTransaction(hash),
        )

        return {
          block: Eth.toSerializableBlock(block),
          transactions: trxns.map(Eth.toSerializableTransaction),
        }
      },
    }
  }
}
