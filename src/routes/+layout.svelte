<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="size-96 overflow-clip bg-black/40">
	{@render children()}
</div>
