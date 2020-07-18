<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	// import { timelineEvents }  from './store.js';
	const dispatch = createEventDispatcher();

	let time_scale = "y";
	let expanded = false;
	let time_menu_expanded = false;
	let event_label = '';

	$: dispatch('time_label', {
			text: time_scale
		});

	const toggle_time_menu = (e) => {
		time_menu_expanded = !time_menu_expanded;
	}

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
			<button on:click={toggle_time_menu} transition:fly="{{ y: -50, duration: 700 }}">
				Edit timescale
			</button>
			{#if time_menu_expanded}
			<div >
				<select bind:value={time_scale}>
					<option value="y">Years</option>
					<option value="m">Months</option>
					<option value="w">weeks</option>
					<option value="d">days</option>
				</select>
			</div>
			{/if}
			{#if !time_menu_expanded}
			<input transition:fly="{{ y: -100, duration: 700 }}" on:keydown='{createNewEvent}' bind:value={event_label} placeholder="New Event Label" >
			<button transition:fly="{{ y: -150, duration: 700 }}">
				Add label
			</button>
			<button transition:fly="{{ y: -200, duration: 700 }}">
				Add interest calc
			</button>
			{/if}
		{/if}
	</div>
</div>