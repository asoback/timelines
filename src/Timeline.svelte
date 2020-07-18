<script>
    // import { spring } from 'svelte/motion';
    // import { flip } from 'svelte/animate';
    // import { dndzone } from 'svelte-dnd-action';
    import {tweened } from 'svelte/motion';
    import { draggable } from './draggable.js';
    import AddItem from './AddItem.svelte';

    let timeunits = "years";
    let items = [];
	let start_time = 2020;
	let end_time = 2030;
    let absolute_time = false;
    let steps_per_unit = 4;
    let time_points = [];

    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
            time_points.push(i/4);
    }
    
    const flipDurationMs = 300;

    function handleSort(e) {
        items = e.detail.items;
        for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
            console.log(i)
            items[i].time_point = i/4;
        }
    }

    const handleAddEvent = (e) => {
        let new_id = 0;
        if (items.length > 0) {
            new_id = items[items.length - 1].id + 1;
        }
        items[items.length] = {
            id: new_id,
            label: e.detail.text,
            left_px: 100
        };
    }

    

	function handlePanMove(event) {
        const id = event.target.dataset["eventid"];
        items[id].left_px += event.detail.dx;
        items = items;
	}


</script>

<style>
    .container {
        display: inline-block;
        position: absolute;
        width: 80%;
        height: 300px;
        left: 10%;
		top: 20%;
        overflow-x: auto;
        white-space: nowrap;
        padding: 50px;
        border: 1px solid #9e9e9e;
    }

    .timeline {
        position: absolute;
        width: 2000px; /* TODO */
        height: 200px;
        margin: 0 0;
        margin-bottom: 10px;
        border-bottom: 6px solid #333333;
    }

    .event {
        display: inline-block;
        position: relative;
        height: 60%;
        width: 50px;
        top: 100%;
    }
 
    .content {
        display: block;
        position: absolute;
        height: 100px;
        width: 50px;
        bottom: 0;
    }

    .content:before {
        content: '';
        top: 80%;
        width: 00px;
        height: 100%;
        left: 50%;
        margin-left: -4px;
        position: relative;
        border-left: 4px solid #333333;
    }

    .hidden:before {
        border-left: none;
    }
    .hidden > .avatar {
        display: none;
    }

    .avatar {
        width: 30px;
        height: 30px;
        display: block;
        /* border-radius: 50%;
        border: 6px solid #BADA55; */
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        bottom: 20%;
        text-align: center;
        line-height: 30px;
        background: transparent;
        transform: rotate(-45deg);
    }

   .timestamp {
        display: inline-block;
        position: absolute;
        top: 5px;
        width: 100%;
    } 

    .event_space {
        display :inline-block;
        position: absolute;
        height:100%;
        width:100%;
    }

</style>


<AddItem on:message={handleAddEvent}/>

<div class='container'>
    <div class='timeline'> <!--use:dndzone={{items, flipDurationMs}} --> 
        <div class='event_space'>
            {#each items as item(item.id)}
                <div 
                    data-eventid="{item.id}"
                    use:draggable
                    on:panmove={handlePanMove}
                    style="transform:
                        translate({item.left_px}px, 0px)"
                    class='content {item.label === '' ? 'hidden' : ''}'>
                    <div class="avatar">{item.label}</div>
                </div>
            {/each}
        </div>
        {#each time_points as t}
        <div  class='event up'>
            <div class='timestamp'>
                 {#if Number.isInteger(t)}
                        <span>{t}</span>
                 {/if}
            </div>
        </div>
        {/each} 
    </div>
</div>