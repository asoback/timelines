<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let event_label = '';
    let event_color;
    let event_id = 0;
    let menu_expanded = false;

    const CloseMenu = () => {
        menu_expanded = false;
    };

    $: dispatch('close_menu', {
        close_menu: menu_expanded
    });

    // $: dispatch('change_element', {
	// 	label: event_label,
    //     color: event_color
	// });

</script>

<style>

</style>


<div class="container menu">
        Title<input type=text bind:value={event_label}>
        <input type=color bind:value={event_color}>
        <button on:click="{CloseMenu}">close</button>
</div>