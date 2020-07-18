<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	// import { timelineEvents }  from './store.js';
	const dispatch = createEventDispatcher();

	let time_scale = "y";
	let expanded = false;
	let time_menu_expanded = false;
	let event_label = '';
	let time_len = 10;
	let interest_menu_expanded = false;

	$: dispatch('time_label', {
			text: time_scale
		});

	$: dispatch('time_len', {
		text: time_len
	});

	const toggle_time_menu = (e) => {
		time_menu_expanded = !time_menu_expanded;
	}

	const toggle_interest_menu = (e) => {
		interest_menu_expanded = !interest_menu_expanded;
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
			{#if !interest_menu_expanded}
			<button on:click={toggle_time_menu} transition:fly="{{ y: -50, duration: 700 }}">
				Edit timescale
			</button>
			{/if}
			{#if time_menu_expanded && !interest_menu_expanded}
			<div >
				<select bind:value={time_scale}>
					<option value="y">Years</option>
					<option value="m">Months</option>
					<option value="w">weeks</option>
					<option value="d">days</option>
				</select>
			</div>
			<div>
				<input type=number min=3 max=20 bind:value={time_len}>Duration
			</div>
			{/if}
			{#if !time_menu_expanded && !interest_menu_expanded}
			<input transition:fly="{{ y: -100, duration: 700 }}" on:keydown='{createNewEvent}' bind:value={event_label} placeholder="New Event Label" >
			<!-- <button transition:fly="{{ y: -150, duration: 700 }}">
				Add label
			</button> -->
			<button transition:fly="{{ y: -200, duration: 700 }}" on:click={toggle_interest_menu}>
				Add interest calc
			</button>
			{/if}
			{#if interest_menu_expanded}
				<div transition:fly="{{ y: -100, duration: 700, delay: 600 }}">
					<input type=number>start date
					<input type=number>start amount
					<input type=number>rate of growth
					<input type=number>yearly growth
					<button>Submit</button>
				</div>
			{/if}
		{/if}
	</div>
</div>