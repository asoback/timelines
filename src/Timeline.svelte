<script>
  import { draggable } from './draggable.js';
  import AddItem from './AddItem.svelte';
  import EditEvent from './EditEvent.svelte';
  import EditInterest from './EditInterest.svelte';

  // Variables in use

  // Start and end of gradient
  let today_px = 0;
  let yesterday_px = 0;
  // Timeline
  let timeunits = "y";
  let time_len = 5.25;
	let start_time = 0;
	let end_time = 5.25;
  let steps_per_unit = 4; // tick marks
  let timeline_length_px = 75*20;
  let time_points = [];
  // Events
  let items = [];
  let focused_event_id = -1;
  let focused_event_label = "";
  let focused_event_color; 
  // Interest  
  let interest_count = 0;
  let focused_interest_id = -1;
  // Menu
  let edit_menu_expanded = false;
  let date_display = "";
  let new_date = new Date();
  const current_year_label = new_date.getFullYear();

  // Functions section

  // Events functions
  const HandleRemoveElement = (e) => {
    items.splice(focused_event_id, 1);
    for (let i = 0; i < items.length; i++) {
      items[i].id = i;
    }
    items=items;
  };

  const handleAddEvent = (e) => {
    let new_id = 0;
    if (items.length > 0) {
      new_id = items[items.length - 1].id + 1;
    }
    items[items.length] = {
      id: new_id,
      label: e.detail.text,
      left_px: 0,
      date: convert_place_to_date(0),
      color: "#000000"
    };
    focused_interest_id = -1;
    focused_event_id = new_id;
    edit_menu_expanded = true;
    focused_event_label = items[focused_event_id].label;
    focused_event_color = items[focused_event_id].color;
  }

  function handlePanMove(event) {
    const id = event.target.dataset["eventid"];
    const element_width = getComputedStyle(event.target).width.replace(/\D+/g, '');
    items[id].left_px += event.detail.dx;
    items[id].date = convert_place_to_date(items[id].left_px - (element_width/2));
    items = items;
    date_display = items[id].date;
	}

  function handlePanEnd(event) {
    date_display = "";
  }

  const focus_event =(e) => {
    edit_menu_expanded = true;
    focused_event_id = e.target.dataset.eventid;
    focused_event_label = items[focused_event_id].label;
    focused_event_color = items[focused_event_id].color;
  }

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

  // Timeline functions
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
    today_px = get_today_in_px();
    yesterday_px = Math.max(today_px - 30, 0);
  }

  const get_today_in_px = () => {
    const current_time = new Date(Date.now());

    const month = current_time.getMonth();
    const day = current_time.getDate();
    const days_ahead = month * 30 + day; // TODO (close enough)

    const total_days = time_len * 365; // days in a year
    const fraction = days_ahead/total_days;

    return Math.floor(timeline_length_px * fraction);
  }

  const convert_place_to_date = (px) => {
    const total_days = time_len * 365; // days in a year
    const fraction_per_day = 1/total_days;
    const fraction_at_px = px/timeline_length_px;
    const number_of_days_since_start = fraction_at_px / fraction_per_day;
    const milli_since_start = number_of_days_since_start * 24 * 60 * 60 * 1000;
    const new_time = new Date(Date.now() + milli_since_start);
    let options = {month: 'long'};
    const output_month = new Intl.DateTimeFormat('en-US', options).format(new_time);
    const output_date = new_time.getDate();
    const output_year = new_time.getFullYear();
    return `${output_month}, ${output_date} ${output_year}`;
  }

  // Interest functions
  const editInterest = (e) => {
    focused_interest_id = e.target.dataset.id;
  }

  const handleNewInterest = (e) => {
    let amount = e.detail.start_amount;
    const calc_finish = Math.min(e.detail.end_date, end_time - start_time);
    const idx = interest_count;
    for (let i = e.detail.start_date* steps_per_unit; i < calc_finish * steps_per_unit; i++){
      if (i % steps_per_unit == 0 && i != e.detail.start_date* steps_per_unit) {
        amount = Math.trunc((amount + e.detail.yearly_addition) * (1 + e.detail.rate/100));
      }
      time_points[i].interest_account[idx] = {
        id: idx,
        label: e.detail.text,
        amount: amount,
        rate: e.detail.rate,
        addition: e.detail.yearly_addition,
        start_amount:  e.detail.start_amount,
        start_date: e.detail.start_date
      }
    };
    interest_count++;
    time_points = time_points;
  }

  const HandleDeleteInterest = (e) => {
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
      for (let j = 0; j < time_points[i].interest_account.length; j++) {
        if (time_points[i].interest_account[j].id = focused_interest_id) {
          time_points[i].interest_account.splice(j, 1);
        }
      }
    }
    time_points = time_points;
    focused_interest_id =  -1;
  };

  const CloseInterestMenu = (e) => {
    focused_interest_id =  -1;
  }

  const HandleEditLabelInterest = (e) => {
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
      for (let j = 0; j < time_points[i].interest_account.length; j++) {
        if (time_points[i].interest_account[j].id = focused_interest_id) {
          time_points[i].interest_account[j].label = e.detail.text;
        }
      }
    }
    time_points = time_points;
  }

  const HandleEditStartDateInterest = (e) => {
    let start = false;
    let amount = 0;
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++) {
      if (i % steps_per_unit == 0) {
        if (i/steps_per_unit < e.detail.interest_start_date) {
          time_points[i].interest_account[focused_interest_id].amount = 0.0;
        } else if (!start) {
          amount = time_points[i].interest_account[focused_interest_id].start_amount;
          time_points[i].interest_account[focused_interest_id].amount = amount;
          start = true;
        } else {
          time_points[i].interest_account[focused_interest_id].amount =
            Math.trunc(
              (amount *  (1 + time_points[i].interest_account[focused_interest_id].rate/100)) +
              time_points[i].interest_account[focused_interest_id].addition);
          amount = time_points[i].interest_account[focused_interest_id].amount;
        }
        time_points[i].interest_account[focused_interest_id].start_date =
          e.detail.interest_start_date;
      }
    }
  }

  const HandleEditStartAmountInterest = (e) => {
    let start = false;
    let amount = 0;
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++) {
      if (i % steps_per_unit == 0) {
        if (i/steps_per_unit < time_points[i].interest_account[focused_interest_id].start_date) {
          time_points[i].interest_account[focused_interest_id].amount = 0.0;
        } else if (!start) {
          amount = e.detail.interest_start_amount;
          time_points[i].interest_account[focused_interest_id].amount = amount;
          start = true;
        } else {
          time_points[i].interest_account[focused_interest_id].amount =
            Math.trunc(
              (amount *  (1 + time_points[i].interest_account[focused_interest_id].rate/100)) +
              time_points[i].interest_account[focused_interest_id].addition);
          amount = time_points[i].interest_account[focused_interest_id].amount;
        }
         time_points[i].interest_account[focused_interest_id].start_amount =
          e.detail.interest_start_amount;
      }
    }
  }

  const HandleEditRateInterest = (e) => {
    let start = false;
    let amount = 0;
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++) {
      if (i % steps_per_unit == 0) {
        if (i/steps_per_unit < time_points[i].interest_account[focused_interest_id].start_date) {
          time_points[i].interest_account[focused_interest_id].amount = 0.0;
        } else if (!start) {
          amount = time_points[i].interest_account[focused_interest_id].start_amount;
          time_points[i].interest_account[focused_interest_id].amount = amount;
          start = true;
        } else {
          time_points[i].interest_account[focused_interest_id].amount =
            Math.trunc(
              (amount *  (1 +  e.detail.interest_rate/100)) +
              time_points[i].interest_account[focused_interest_id].addition);
          amount = time_points[i].interest_account[focused_interest_id].amount;
        }
         time_points[i].interest_account[focused_interest_id].rate =
          e.detail.interest_rate;
      }
    }
  }

  const HandleEditYearlyAdditionInterest = (e) => {
    let start = false;
    let amount = 0;
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++) {
      if (i % steps_per_unit == 0) {
        if (i/steps_per_unit < time_points[i].interest_account[focused_interest_id].start_date) {
          time_points[i].interest_account[focused_interest_id].amount = 0.0;
        } else if (!start) {
          amount = time_points[i].interest_account[focused_interest_id].start_amount;
          time_points[i].interest_account[focused_interest_id].amount = amount;
          start = true;
        } else {
          time_points[i].interest_account[focused_interest_id].amount =
            Math.trunc(
              (amount *  (1 + time_points[i].interest_account[focused_interest_id].rate/100)) +
              e.detail.interest_yearly_addition);
          amount = time_points[i].interest_account[focused_interest_id].amount;
        }
         time_points[i].interest_account[focused_interest_id].addition =
          e.detail.interest_yearly_addition;
      }
    }
  }
  
  const HandleEditEndDateInterest = (e) => {
    // TODO, nothing saves the other changes from overwriting this.
    // Not finished as this feature is currently hidden. Is it useful?
    for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++) {
      if (i % steps_per_unit == 0) {
        if (i/steps_per_unit > e.detail.interest_end_date) {
          time_points[i].interest_account[focused_interest_id].amount = 0.0;
        } 
      }
    }
  }

  // Init
  today_px = get_today_in_px();
  yesterday_px = Math.max(today_px - 30, 0);

  for (let i = 0; i < (end_time - start_time) * steps_per_unit; i++){
    time_points[time_points.length] = {
      time_unit: i/4,
      interest_account: []
    };
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
    width: 100%; /* TODO */
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
    width: 75px;
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

  .date_display {
    position: absolute;
    left: 30%;
    bottom: 0%;
    z-index: 1000;
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
    height: 100%;
    width:100%;
    
    background-image: linear-gradient(to right,rgb(165, 165, 165) var(--yesterday-px), rgba(0,0,0,0) var(--today-px));
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

  .timeline_full_container {
    
  }
</style>


                 
<div class='timeline_full_container'>
  {#if focused_interest_id < 0}
    <AddItem
      on:message={handleAddEvent}
      on:time_label={handleUpdateTime}
      on:time_len={handleUpdateTimeLen}
      on:interest={handleNewInterest}/>
  {/if}

  <div class='container'>
      <div class='timeline' style='width: {timeline_length_px}px;'>
          <div class='event_space' style="--today-px: {today_px}px; --yesterday-px: {yesterday_px}px;">
              {#each items as item(item.id)}
                  <div 
                      on:click={focus_event}
                      data-eventid="{item.id}"
                      use:draggable
                      on:panmove={handlePanMove}
                      on:panend={handlePanEnd}
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
                          <span>{t.time_unit + current_year_label}</span>
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
      <div class="date_display">
        <span>{date_display}</span>
      </div>
  </div>

  {#if edit_menu_expanded && focused_interest_id < 0}
    <div class="edit_menu">
      <EditEvent
        event_label={focused_event_label}
        event_color={focused_event_color}
        on:close_menu={HandleCloseMenu}
        on:change_element={HandleChangeElement}
        on:remove_element={HandleRemoveElement} />
    </div>
  {/if}

  {#if focused_interest_id >= 0}
    <EditInterest
      interest_label={time_points[0].interest_account[focused_interest_id].label}
      interest_start_date={time_points[0].interest_account[focused_interest_id].start_date}
      interest_start_amount={time_points[0].interest_account[focused_interest_id].start_amount}
      interest_rate={time_points[0].interest_account[focused_interest_id].rate}
      interest_yearly_addition={time_points[0].interest_account[focused_interest_id].addition}
      on:delete_interest={HandleDeleteInterest} 
      on:close_edit_interest_menu={CloseInterestMenu}
      on:interest_label={HandleEditLabelInterest}
      on:interest_start_date={HandleEditStartDateInterest}
      on:interest_start_amount={HandleEditStartAmountInterest}
      on:interest_rate={HandleEditRateInterest}
      on:interest_yearly_addition={HandleEditYearlyAdditionInterest}
      on:interest_end_date={HandleEditEndDateInterest}
    />
  {/if}
</div>
