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

    $: dispatch('change_element', {
		label: event_label,
        color: event_color
	});

    const DeleteItem = () => {
        dispatch('remove_element', {
            text: "remove"
        });
    };

</script>

<style>
    #event_color {
        padding: 0.1em;
    }
    
</style>


<div class="container menu">
    <label for="event_label">Title</label>
    <input name="event_label" type=text bind:value={event_label} placeholder="New Event Label">
    <label for="event_color">Event Color</label>
    <input id="event_color" name="event_color" type=color bind:value={event_color}>
    <button name="delete_event_button" on:click="{DeleteItem}">Delete</button>
    <button name="close_menu_button" on:click="{CloseMenu}">close</button>
</div>