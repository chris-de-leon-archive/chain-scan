import { AssertUnreachable } from '$lib/utils'
import type { PageServerLoad } from './$types'
import { api, utils } from '$lib/server/api'
import { ChainType } from '$lib/enums'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

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

	switch (ds.chain) {
		case ChainType.STARKNET:
			return {
				datasource: ds,
				solana: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				starknet: api.chains.starknet.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
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
				solana: api.chains.solana.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
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
				aptos: api.chains.aptos.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
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
				flow: api.chains.flow.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
				}),
			}
		case ChainType.TRON:
			return {
				datasource: ds,
				starknet: Promise.resolve(undefined),
				aptos: Promise.resolve(undefined),
				flow: Promise.resolve(undefined),
				tron: Promise.resolve(undefined),
				eth: Promise.resolve(undefined),
				solana: api.chains.tron.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
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
				eth: api.chains.eth.transactions.get.handler(auth.session, {
					url: ds.url,
					id: event.params.id,
				}),
			}
		default:
			return AssertUnreachable(ds.chain)
	}
}
