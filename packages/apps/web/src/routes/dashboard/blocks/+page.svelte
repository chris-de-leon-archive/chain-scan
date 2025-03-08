<script lang="ts">
	import { SearchIcon } from 'lucide-svelte'

	const tableData = [
		{ position: '0', name: 'Iron', symbol: 'Fe', atomic_no: '26' },
		{ position: '1', name: 'Rhodium', symbol: 'Rh', atomic_no: '45' },
		{ position: '2', name: 'Iodine', symbol: 'I', atomic_no: '53' },
		{ position: '3', name: 'Radon', symbol: 'Rn', atomic_no: '86' },
		{ position: '4', name: 'Technetium', symbol: 'Tc', atomic_no: '43' },
		{ position: '5', name: 'Hydrogen', symbol: 'H', atomic_no: '1' },
		{ position: '6', name: 'Oxygen', symbol: 'O', atomic_no: '8' },
		{ position: '7', name: 'Carbon', symbol: 'C', atomic_no: '6' },
		{ position: '8', name: 'Neon', symbol: 'Ne', atomic_no: '10' },
		{ position: '9', name: 'Gold', symbol: 'Au', atomic_no: '79' },
		{ position: '10', name: 'Silver', symbol: 'Ag', atomic_no: '47' },
		{ position: '11', name: 'Uranium', symbol: 'U', atomic_no: '92' },
		{ position: '12', name: 'Lithium', symbol: 'Li', atomic_no: '3' },
		{ position: '13', name: 'Helium', symbol: 'He', atomic_no: '2' },
		{ position: '14', name: 'Calcium', symbol: 'Ca', atomic_no: '20' },
		{ position: '15', name: 'Platinum', symbol: 'Pt', atomic_no: '78' },
	]
</script>

<div class="flex flex-col gap-y-12">
	<div class="grid grid-cols-4 gap-4">
		<div
			class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden border-[1px]"
		>
			<p>Card</p>
		</div>
		<div
			class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden border-[1px]"
		>
			<p>Card</p>
		</div>
		<div
			class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden border-[1px]"
		>
			<p>Card</p>
		</div>
		<div
			class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 block max-w-md divide-y overflow-hidden border-[1px]"
		>
			<p>Card</p>
		</div>
	</div>
	<div class="flex flex-row items-center">
		<form class="mx-auto w-full space-y-4">
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">
					<SearchIcon size={16} />
				</div>
				<input class="ig-input" type="search" placeholder="Search..." />
				<button
					class="ig-btn preset-filled-primary-500 hover:preset-filled-surface-50-950 transition ease-linear"
					>Submit</button
				>
			</div>
		</form>
	</div>
	<div class="table-wrap">
		<table class="table caption-bottom">
			<caption class="pt-4">A list of elements from the periodic table.</caption>
			<thead>
				<tr>
					<th>Position</th>
					<th>Symbol</th>
					<th>Name</th>
					<th class="!text-right">Weight</th>
				</tr>
			</thead>
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each tableData as row (row.name)}
					<tr>
						<td>{row.position}</td>
						<td>{row.symbol}</td>
						<td>{row.name}</td>
						<td class="text-right">{row.atomic_no}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3">Total</td>
					<td class="text-right">{tableData.length} Elements</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>
