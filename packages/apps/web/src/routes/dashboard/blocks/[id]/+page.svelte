<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { PageProps } from './$types'
	const pageProps: PageProps = $props()
</script>

<div>
	{#await pageProps.data.starknet}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
	{#await pageProps.data.solana}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
	{#await pageProps.data.aptos}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
	{#await pageProps.data.tron}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
	{#await pageProps.data.flow}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
	{#await pageProps.data.eth}
		<Loading />
	{:then result}
		<pre>{JSON.stringify(result, null, 2)}</pre>
	{/await}
</div>
