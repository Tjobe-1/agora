<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Masonry from 'svelte-bricks';

	let [minColWidth, maxColWidth, gap] = [300, 800, 20];
	let width, height;

	export let result: string;
	let items = [];
	$: items = JSON.parse(result);
</script>

<div bind:clientWidth={width} bind:clientHeight={height} />

<h1>Welcome to Agora!</h1>

<div class="btn-toolbar my-4" role="toolbar" aria-label="Toolbar with button groups">
	<div class="btn-group me-4 mb-2" role="group" aria-label="First group">
		<input
			type="radio"
			class="btn-check"
			name="btnradio"
			id="btnradio1"
			autocomplete="off"
			checked
		/>
		<label class="btn btn-outline-secondary" for="btnradio1">Take</label>

		<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
		<label class="btn btn-outline-secondary" for="btnradio2">Another</label>

		<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
		<label class="btn btn-outline-secondary" for="btnradio3">Perspective</label>
	</div>
	<div class="input-group me-4 mb-2">
		<div class="input-group-text" id="btnGroupAddon">@</div>
		<input
			type="text"
			class="form-control"
			placeholder="Participant #"
			aria-label="Input group example"
			aria-describedby="btnGroupAddon"
		/>
	</div>
</div>

<Masonry {items} {minColWidth} {maxColWidth} {gap} let:item bind:width bind:height>
	<div class="card">
		{#if item.content != undefined}
			{#each item.content as content}
				<img src={content.url} class="card-img-top" />
			{/each}
		{/if}
		<div class="card-body">
			<h5 class="card-title">{item.title}</h5>
			{#each item.links as link}
				{#if link != null}
					<a href="/#" class="card-link">{link}</a>
				{/if}
			{/each}
		</div>
	</div>
</Masonry>
