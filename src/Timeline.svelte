<script>
    import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
    import AddItem from './AddItem.svelte';

    let timeunits = "years";
    let items = [];
	let start_time = 2020;
	let end_time = 2030;
    let absolute_time = false;
    let steps_per_unit = 4;
    
    const flipDurationMs = 300;

    function handleSort(e) {
        items = e.detail.items;
        for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
            console.log(i)
            items[i].time_point = i/4;
        }
    }
    

    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
        const event = {
            id: i,
            time_point: i/4,
            label: ''
        }

        items.push(event)
    }

    const handleAddEvent = (e) => {
        console.log(e.detail.text)
        for (let i = items.length -1; i >= 0; i--) {
            if (items[i].label == '') {
               items[i].label = e.detail.text;
                break;
            }
        }

    }
</script>

<style>
    .container {
        position: absolute;
        width: 80%;
        left: 10%;
		top: 30%;
        overflow-x: auto;
        white-space: nowrap;
        padding: 50px;
        border: 1px solid #9e9e9e;
    }

    .timeline {
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
        top: 60%;
    }
 
    .content {
        display: block;
        height: 100px;
        width: 50px;
    }

    .content:before {
        content: '';
        top: 60%;
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
        text-align: center;
        line-height: 30px;
        background: white;
        transform: rotate(-45deg);
    }

   .timestamp {
        display: inline-block;
        position: relative;
        bottom: 0;
        width: 100%;
    } 

</style>


<AddItem on:message={handleAddEvent}/>

<div class='container'>
    <div class='timeline' use:dndzone={{items, flipDurationMs}} on:consider={handleSort} on:finalize={handleSort} >
    {#each items as item(item.id)}
        <div  class='event up' animate:flip={{duration:flipDurationMs}}>
            <div class='content {item.label === '' ? 'hidden' : ''}'>
                <div class="avatar">{item.label}</div>
            </div>
                <div class='timestamp'>
                {#if Number.isInteger(item.time_point)}
                    <span>{item.time_point}</span>
                {/if}
                </div>
        </div>
    {/each}
    </div>
</div>