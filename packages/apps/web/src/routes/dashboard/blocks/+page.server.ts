import { AssertUnreachable } from '$lib/utils'
import type { PageServerLoad } from './$types'
import { api, utils } from '$lib/server/api'
import { ChainType } from '$lib/enums'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

const DEFAULT_BLOCK_LIMIT = 15

export const load: PageServerLoad = async (event) => {
	const { auth } = await event.parent()

	const qp = utils.safeParseQueryParams(
		event.url,
		z
			.object({
				datasourceId: z.string(),
				limit: z.number().int(),
			})
			.partial(),
	)

	if (qp.error != null) {
		return error(qp.error.status, {
			message: qp.error.message,
			metadata: qp.error.metadata,
		})
	}

	const datasources = api.datasources.list.handler(auth.session)
	const ds =
		qp.data.datasourceId == null
			? await api.datasources.getActive.handler(auth.session)
			: await api.datasources.getByID.handler(auth.session, { id: qp.data.datasourceId })

	if (ds == null) {
		return {
			datasources,
			datasource: undefined,
			starknet: Promise.resolve([]),
			solana: Promise.resolve([]),
			aptos: Promise.resolve([]),
			flow: Promise.resolve([]),
			tron: Promise.resolve([]),
			eth: Promise.resolve([]),
		}
	}

	const limit = qp.data.limit ?? DEFAULT_BLOCK_LIMIT
	switch (ds.chain) {
		case ChainType.STARKNET:
			return {
				datasources,
				datasource: ds,
				solana: Promise.resolve([]),
				aptos: Promise.resolve([]),
				flow: Promise.resolve([]),
				tron: Promise.resolve([]),
				eth: Promise.resolve([]),
				starknet: api.chains.starknet.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		case ChainType.SOLANA:
			return {
				datasources,
				datasource: ds,
				starknet: Promise.resolve([]),
				aptos: Promise.resolve([]),
				flow: Promise.resolve([]),
				tron: Promise.resolve([]),
				eth: Promise.resolve([]),
				solana: api.chains.solana.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		case ChainType.APTOS:
			return {
				datasources,
				datasource: ds,
				starknet: Promise.resolve([]),
				solana: Promise.resolve([]),
				flow: Promise.resolve([]),
				tron: Promise.resolve([]),
				eth: Promise.resolve([]),
				aptos: api.chains.aptos.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		case ChainType.FLOW:
			return {
				datasources,
				datasource: ds,
				starknet: Promise.resolve([]),
				solana: Promise.resolve([]),
				aptos: Promise.resolve([]),
				tron: Promise.resolve([]),
				eth: Promise.resolve([]),
				flow: api.chains.flow.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		case ChainType.TRON:
			return {
				datasources,
				datasource: ds,
				starknet: Promise.resolve([]),
				solana: Promise.resolve([]),
				aptos: Promise.resolve([]),
				flow: Promise.resolve([]),
				eth: Promise.resolve([]),
				tron: api.chains.tron.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		case ChainType.ETH:
			return {
				datasources,
				datasource: ds,
				starknet: Promise.resolve([]),
				solana: Promise.resolve([]),
				aptos: Promise.resolve([]),
				flow: Promise.resolve([]),
				tron: Promise.resolve([]),
				eth: api.chains.eth.blocks.list.handler(auth.session, {
					url: ds.url,
					limit,
				}),
			}
		default:
			return AssertUnreachable(ds.chain)
	}
}
