import { api, HttpCode, HttpStatus, utils } from '$lib/server/api'
import { AssertUnreachable } from '$lib/utils'
import type { PageServerLoad } from './$types'
import { ChainType } from '$lib/enums'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

export const load: PageServerLoad = async (event) => {
	const { auth } = await event.parent()
	if (Number.isInteger(event.params.id)) {
		return error(HttpStatus.BAD_REQUEST, {
			message: 'invalid ID',
			metadata: {
				message: 'ID must be an integer',
				code: HttpCode.BAD_REQUEST,
			},
		})
	}

	const qp = utils.safeParseQueryParams(event.url, z.object({ datasourceId: z.string() }).partial())
	if (qp.error != null) {
		return error(qp.error.status, {
			message: qp.error.message,
			metadata: qp.error.metadata,
		})
	}

	const ds =
		qp.data.datasourceId == null
			? await api.datasources.getActive.handler(auth.session)
			: await api.datasources.getByID.handler(auth.session, { id: qp.data.datasourceId })

	if (ds == null) {
		return {
			datasource: Promise.resolve(undefined),
			starknet: Promise.resolve(undefined),
			solana: Promise.resolve(undefined),
			aptos: Promise.resolve(undefined),
			flow: Promise.resolve(undefined),
			tron: Promise.resolve(undefined),
			eth: Promise.resolve(undefined),
		}
	}

	const id = BigInt(event.params.id)
	switch (ds.chain) {
		case ChainType.STARKNET:
			return {
				datasource: ds,
				solana: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				starknet: api.chains.starknet.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		case ChainType.SOLANA:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				solana: api.chains.solana.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		case ChainType.APTOS:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				solana: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				aptos: api.chains.aptos.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		case ChainType.FLOW:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				solana: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				flow: api.chains.flow.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		case ChainType.TRON:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				solana: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				tron: api.chains.tron.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		case ChainType.ETH:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				solana: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: api.chains.eth.blocks.get.handler(auth.session, {
					url: ds.url,
					id,
				}),
			}
		default:
			return AssertUnreachable(ds.chain)
	}
}
