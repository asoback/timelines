<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let interest_label = "";
	let interest_start_date = 0;
	let interest_start_amount = 0;
	let interest_rate = 0;
	let interest_yearly_addition = 0;
    let interest_end_date = 10;
    
    $: dispatch('interest_label', {
		text: interest_label
	});


    const DeleteInterest = () => {
        dispatch('delete_interest', {
	    	text: "delete"
    	});
    }

    const closeInterestMenu = () => {
        dispatch('close_edit_interest_menu', {
	    	text: "close"
    	});
    }

</script>



<div class="interest_menu" transition:fly="{{ y: -100, duration: 700, delay: 600 }}">
    <label>Label</label><input bind:value={interest_label} type=text>
    <label>start date</label><input bind:value={interest_start_date} type=number>
    <label>start amount</label><input bind:value={interest_start_amount} type=number>
    <label>rate of growth</label><input bind:value={interest_rate} type=number>
    <label>yearly addition</label><input bind:value={interest_yearly_addition} type=number>
    <label>end date</label><input bind:value={interest_end_date} type=number>
    <button on:click={DeleteInterest}><label>Delete</button>
    <button on:click={closeInterestMenu}><label>Close</button>
</div>