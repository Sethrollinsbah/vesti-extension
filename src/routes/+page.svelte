<script>
	import { onMount } from 'svelte';

	let imageSrc = '';

	onMount(async () => {
		// Get the last clicked image src from the background script
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		chrome.runtime.sendMessage({ action: 'getLastImageSrc' }, (response) => {
			imageSrc = response.src;
		});
		// chrome.runtime.sendMessage({ action: 'openPopup' });
	});
</script>

<main>
	<h1>Image Preview</h1>
	{#if imageSrc}
		<img src={imageSrc} alt="Selected Image" style="max-width: 100%; max-height: 200px;" />
	{:else}
		<p>No image selected yet.</p>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1rem;
	}
</style>
