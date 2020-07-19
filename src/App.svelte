

<script>
	import Navbar from './navbar.svelte';
	import Timeline from './Timeline.svelte';
</script>

<style>
	.app {
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.app-top {
		display: inline-block;
		position: relative;
		width: 100%;
		height: 5%;
	}

	.app-mid {
		display: inline-block;
		position: relative;
		width: 100%;
		height: 95%;
	}

	:global(body) {
		padding: 0;
	}

</style>


<div class="app">
	<div class="app-top">
		<Navbar/>
	</div>
	<div class="app-mid">
		<Timeline/>
	</div>
	<div class="app-bottom">
	
	</div>
</div>
	
