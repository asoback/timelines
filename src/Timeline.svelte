<script>
    // import { spring } from 'svelte/motion';
    // import { flip } from 'svelte/animate';
    // import { dndzone } from 'svelte-dnd-action';
    import {tweened } from 'svelte/motion';
    import { draggable } from './draggable.js';
    import AddItem from './AddItem.svelte';
    import EditEvent from './EditEvent.svelte';
    import EditInterest from './EditInterest.svelte';

    let timeunits = "y";
    let time_len = 10;
    let items = [];
	let start_time = 0;
	let end_time = 10;
    let absolute_time = false;
    let steps_per_unit = 4;
    let time_points = [];
    let timeline_length_px = 2000;
    let edit_menu_expanded = false;
    let focused_event_id = -1;
    let interest_count = 0;
    let focused_interest_id = -1;

    const HandleCloseMenu = (e) => {
        edit_menu_expanded = e.detail.close_menu;
    }

    const HandleChangeElement = (e) => {
        if (e.detail.label != '') {
            items[focused_event_id].label = e.detail.label;
        }
        if (e.detail.color != undefined) {
             items[focused_event_id].color = e.detail.color;
        }
        items = items;
    }

    const HandleRemoveElement = (e) => {
        items.splice(focused_event_id, 1);
        for (let i = 0; i < items.length; i++) {
            items[i].id = i;
        }
        items=items;
    };

    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
            time_points[time_points.length] = {
                time_unit: i/4,
                interest_account: []
            };
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
            left_px: 100,
            color: "#000000"
        };
    }

    const handleUpdateTime = (e) => {
       timeunits = e.detail.text;
    }

    const handleUpdateTimeLen = (e) => {
        time_len = e.detail.text;
        
        if (time_points.length > time_len * 4) {
            time_points = time_points.slice(0, time_len * 4);
        } else {
            for (let i = time_points.length; i < time_len * 4; i++) {
                const new_time = time_points[time_points.length - 1].time_unit + 0.25;
                time_points.push({
                    time_unit: new_time,
                    interest_account: []
                });
                    
                time_points = time_points;
            }
        }
        end_time = time_len;
        timeline_length_px= time_points.length * 50;
    }

    const editInterest = (e) => {
        focused_interest_id = e.target.dataset.id;
    }

    const handleNewInterest = (e) => {
        let amount = e.detail.start_amount;
        const calc_finish = Math.min(e.detail.end_date, end_time - start_time);
        for (let i = e.detail.start_date* steps_per_unit; i < calc_finish * steps_per_unit; i++){
            if (i % steps_per_unit == 0 && i != e.detail.start_date* steps_per_unit) {
                amount = Math.trunc((amount + e.detail.yearly_addition) * (1 + e.detail.rate/100));
            }
            time_points[i].interest_account[time_points[i].interest_account.length] = {
                id: interest_count,
                label: e.detail.text,
                amount: amount,
                rate: e.detail.rate,
                addition: e.detail.yearly_addition
            }
        };
        time_points = time_points;
        interest_count++;
    }

	function handlePanMove(event) {
        const id = event.target.dataset["eventid"];
        items[id].left_px += event.detail.dx;
        items = items;
	}

    const focus_event =(e) => {
        edit_menu_expanded = true;
        focused_event_id = e.target.dataset.eventid;
        console.log(focused_event_id);
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
        z-index: 1;
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
        padding-top: 5px;
        width: 100%;
        padding-left: 4px;
    } 

   .timestamp:before {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0%;
        width: 0px;
        height: 50%;
        left: 0%;
        border-left: 2px solid #333333;
    } 

    .event_space {
        display :inline-block;
        position: absolute;
        height:100%;
        width:100%;
    }

    .small_label {
       display: inline-block;
        position: absolute;
        top: 0;
        width: 100%;
        height: 20%;
    }

    .small_label:before {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0%;
        width: 0px;
        height: 50%;
        left: 0%;
        border-left: 1px solid #444444;
        z-index: 0;
    } 

    .interest_element {
        border-bottom: 1px solid #AAAAAA;
        margin-top: 10px;
        display: block;
        position: relative;
        text-align: center;
        color: #555555;
    }

    .edit_menu {
        display: inline-block;
        position: relative;
    }
</style>


<AddItem on:message={handleAddEvent} on:time_label={handleUpdateTime} on:time_len={handleUpdateTimeLen} on:interest={handleNewInterest}/>

<div class='container'>
    <div class='timeline' style='width: {timeline_length_px}px;'> <!--use:dndzone={{items, flipDurationMs}} --> 
        <div class='event_space'>
            {#each items as item(item.id)}
                <div 
                    on:click={focus_event}
                    data-eventid="{item.id}"
                    use:draggable
                    on:panmove={handlePanMove}
                    style="transform:
                        translate({item.left_px}px, 0px)"
                    class='content {item.label === '' ? 'hidden' : ''}'>
                    <div class="avatar" style="color: {item.color}" data-eventid="{item.id}">{item.label}</div>
                </div>
            {/each}
        </div>
        {#each time_points as t(t.time_unit)}
        <div  class='event up'>
            <div class='timestamp { Number.isInteger(t) === false ? 'small_label' : ''}'>
                 {#if Number.isInteger(t.time_unit)}
                        <span>{t.time_unit}{timeunits}</span>
                        {#each t.interest_account as account(account.label)}
                        <div class="interest_element"  data-id="{account.id}" on:click={editInterest}>
                            <div data-id="{account.id}" >{account.label}</div>
                            <div data-id="{account.id}" >{account.amount}</div>
                        </div>
                        {/each}
                 {/if}
                 
            </div>
        </div>
        {/each} 
    </div>
</div>

{#if edit_menu_expanded}
    <div class="edit_menu">
        <EditEvent on:close_menu={HandleCloseMenu} on:change_element={HandleChangeElement} on:remove_element={HandleRemoveElement} />
    </div>
{/if}

{#if focused_interest_id >= 0}
    <EditInterest/>
{/if}