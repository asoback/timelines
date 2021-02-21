<script>
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  let interest_label = "";
	let interest_start_date = 0;
	let interest_start_amount = 0;
	let interest_rate = 0;
	let interest_yearly_addition = 0;
  let interest_end_date = 100;
  
  $: dispatch('interest_label', {
    text: interest_label
  });
  
  $: dispatch('interest_start_date', {
    interest_start_date: interest_start_date
  });

  $: dispatch('interest_start_amount', {
    interest_start_amount: interest_start_amount
  });

  $: dispatch('interest_rate', {
    interest_rate: interest_rate
  });

  $: dispatch('interest_yearly_addition', {
    interest_yearly_addition: interest_yearly_addition
  });

  $: if (interest_start_date > interest_end_date) {
    interest_end_date = interest_start_date + 10;
    dispatch('interest_end_date', {
      interest_end_date: interest_end_date
    });
  };

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

<style>
  .interest_menu {
    display: inline-block;
    position: relative;
    width: 100%;
  }

  label {
    display: inline;
    position: relative;
  }

  input {
    display: inline;
    position: relative;
  }
</style>

<div class="interest_menu" transition:fly="{{ y: -100, duration: 700, delay: 600 }}">
  <label>Label</label><input bind:value={interest_label} type=text placeholder="New Label">
  <label>start date</label><input bind:value={interest_start_date} type=number>
  <label>start amount</label><input bind:value={interest_start_amount} type=number>
  <label>rate of growth</label><input bind:value={interest_rate} type=number>
  <label>yearly addition</label><input bind:value={interest_yearly_addition} type=number>
  <!-- <label>end date</label><input bind:value={interest_end_date} type=number> -->
  <button on:click={DeleteInterest}><label>Delete</label></button>
  <button on:click={closeInterestMenu}><label>Close</label></button>
</div>
