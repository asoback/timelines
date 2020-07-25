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

	let interest_label = "";
	let interest_start_date = 0;
	let interest_start_amount = 0;
	let interest_rate = 0;
	let interest_yearly_addition = 0;
	let interest_end_date = 0;

	$: dispatch('time_label', {
			text: time_scale
		});

	$: dispatch('time_len', {
		text: time_len
	});

	$: if (interest_start_date > interest_end_date) {
		interest_end_date = interest_start_date + 10;
	}

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

	const createNewInterest = (e) => {
		dispatch('interest', {
				text: interest_label,
				start_date: interest_start_date,
				start_amount: interest_start_amount,
				rate: interest_rate,
				yearly_addition: interest_yearly_addition,
				end_date: interest_end_date
		});
		interest_menu_expanded = !interest_menu_expanded;
	};

	const closeInterestMenu = () => {
		interest_menu_expanded = false;
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
		display: flexbox;
		position: relative;
		float: right;
		top: 5;
		margin-top: 3px;
		/*
		display: grid;
		 width: 15%;
		grid-template-columns:5em;
		grid-template-rows: 5em;
		grid-gap: 0.5em */
	}

	.main_menu {
		display: flexbox;
		position: relative;
		float: left;
		margin-right: 50px;
		border: 1px solid #CCCCCC;
		background-color: aliceblue;
	}

	.main_menu>button {
		margin:3px;
	}

	.main_menu>input {
		margin:3px;
	}

	.interest_menu {
		border: 1px solid #CCCCCC;
		background-color: aliceblue;
	}

	.interest_menu>button {
		margin:3px;
	}
	.interest_menu>input {
		margin:3px;
	}

	label {
		display:inline;
		position: relative;
		margin-right: 10px;
		margin-right: 2px;
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

	<div class="main_menu">
		{#if expanded}
			{#if !time_menu_expanded && !interest_menu_expanded}
			<input transition:fly="{{ y: -50, duration: 700 }}" on:keydown='{createNewEvent}' bind:value={event_label} placeholder="New Event Label" >
			<!-- <button transition:fly="{{ y: -150, duration: 700 }}">
				Add label
			</button> -->
			<button transition:fly="{{ y: -50, duration: 700 }}" on:click={toggle_interest_menu}>
				Add interest calc
			</button>
			{/if}
			{#if interest_menu_expanded}
				<div class="interest_menu" transition:fly="{{ y: -100, duration: 700, delay: 600 }}">
					<label>Label</label><input bind:value={interest_label} type=text>
					<label>start date</label><input bind:value={interest_start_date} type=number>
					<label>start amount</label><input bind:value={interest_start_amount} type=number>
					<label>rate of growth</label><input bind:value={interest_rate} type=number>
					<label>yearly addition</label><input bind:value={interest_yearly_addition} type=number>
					<label>end date</label><input bind:value={interest_end_date} type=number>
					<button on:click={createNewInterest}><label>Submit</button>
					<button on:click={closeInterestMenu}><label>Cancel</button>
				</div>
			{/if}
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
		{/if}
	</div>
</div>