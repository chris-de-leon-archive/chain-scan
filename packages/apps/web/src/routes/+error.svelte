<script lang="ts">
	import { page } from '$app/state'
</script>

<section class="section">
	<div class="flex min-h-screen items-center justify-center">
		<h1>{page.status}: {page.error?.message ?? 'an unknown error occurred'}</h1>
	</div>
</section>
