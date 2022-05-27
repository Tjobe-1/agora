<script context="module">
  export const prerender = true;

  export async function load({ fetch }) {
    const res = await fetch("/api");

    if (res.ok) return { props: { cards: await res.json() } };
    return {
      status: res.status,
      error: new Error(),
    };
  }
</script>

<script lang="ts">
  import Masonry from "svelte-bricks";

  let [minColWidth, maxColWidth, gap] = [250, 800, 20];
  let width, height;

  export let cards;

  let items = [];
  $: items = cards;

</script>



    <div class="col-3 mh-100">
      <div
        class="btn-toolbar my-4 sticky-top sticky-offset"
        role="toolbar"
        aria-label="Toolbar with button groups"
      >
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

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio2"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="btnradio2"
            >Another</label
          >

          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="btnradio3"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="btnradio3"
            >Perspective</label
          >
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
    </div>

    <div class="col-5 mh-100" style="overflow-y: scroll;">
      <Masonry
        {items}
        {minColWidth}
        {maxColWidth}
        {gap}
        let:item
        bind:width
        bind:height
      >
        <div class="card">
          <!-- Image -->
          {#if item.image != ""}
          <img class="card-img-top" src={item.image} alt="Here should be a pic">
          {/if}
          <div class="card-body">
            <!-- Title -->
            <h5 class="card-title">{item.title}</h5>

            <!-- Meta -->
            {#each item.meta as meta}
            {meta.name}
            <a href="#" class="card-link">{meta.content}</a>
            {/each}
          </div>
        </div>
      </Masonry>
    </div> 

    <div class="col-9 mh-100">
      <h1>This is another column</h1>
    </div>
