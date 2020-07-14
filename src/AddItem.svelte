<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	// import { timelineEvents }  from './store.js';
	const dispatch = createEventDispatcher();

	let expanded = false;
	let item_name = 0;
	let event_label = '';

	const toggle = () => {
		expanded = !expanded;
	}
	
	const createNewEvent = (e) => {
		if (e.key === "Enter") {
			expanded = false;
			dispatch('message', {
				text: event_label
			});
			event_label = '';
		}
	}
	
</script>

<style>
	div {
		float: right;
		z-index: 10;
	}
	
	button:hover {
		background-color: blue;
		color: white;
		transition: background-color .5s;
		transition: color .4s;
	}
	
	.container {
		display:grid;
		width: 15%;
		grid-template-columns:5em;
		grid-template-rows: 5em;
		grid-gap: 0.5em
	}
</style>

<div class="container">
	<div>
	{#if expanded}
		<button on:click={toggle}>
			-
		</button>
	{:else}
		<button on:click={toggle}>
			+
		</button>
	{/if}
	</div>

	<div class="container">
		{#if expanded}
			<button transition:fly="{{ y: -50, duration: 700 }}">
				Edit timescale
			</button>
			<input transition:fly="{{ y: -100, duration: 700 }}" on:keydown='{createNewEvent}' bind:value={event_label} placeholder="New Event Label" >
			<button transition:fly="{{ y: -150, duration: 700 }}">
				Add label
			</button>
			<button transition:fly="{{ y: -200, duration: 700 }}">
				Add interest calc
			</button>
		{/if}
	</div>
</div>