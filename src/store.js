import { writable } from 'svelte/store';

const createTimeline = () => {
	console.log("hi");
	
	const timeline = {
		timeunits: undefined,
		events: undefined,
		start_time: undefined,
		end_time: undefined,
		absolute_time: undefined
	}
	
	const { subscribe, set, update } = writable(timeline);
	
	const methods = {
		init () {
		console.log('*: timelineEvents-> init()')
		update(timeline => {
			timeline.timeunits = "years"
					timeline.events = []
					timeline.start_time = 2020
					timeline.end_time = 2030
					timeline.absolute_time = false
					timeline.steps_per_unit = 4;

			for (let i = 0; i < (timeline.end_time-timeline.start_time) * timeline.steps_per_unit; i++){
				const event = {
					label: "",
					timepoint: i/4
				}

				timeline.events.push(event)
			}
			return timeline
		})
		},
			
		addEvent (event) {
			console.log('*: timelineEvents-> addEvent()')
			update(timeline => {
				for (let i in timeline.events ) {
					console.log(timeline.events[i])
					if (timeline.events[i].label == '') {
						timeline.events[i].label = i;
						break;
					}
				}
				return timeline
			})
		},
		
		getEvents () {
			return timeline.events;
		}
						 
	};
	
	return {
    subscribe,
    set,
    update,
    ...methods
  }
}

export const timelineEvents = createTimeline();