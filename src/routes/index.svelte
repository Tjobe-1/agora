<script>
  import Masonry from "svelte-bricks";
  import Card from "./components/Card.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores"
  import { browser } from "$app/env";

  let [minColWidth, maxColWidth, gap] = [250, 800, 20];
  let width, height;

  let current_filter = "";

  let content_tables = [7, 8, 9];
  let phases_table = 11;
  let categories_table = 10;

  let phases;



  page.subscribe(() => {
    console.log("oage")
    phases = getPhases(current_filter);
  })

  async function getRelations(relation_array) {
    if (browser) {
      const result = await Promise.all(
        relation_array.map(async (element) => {
          let params = new URLSearchParams();
          let table = element.table;
          params.append("type", "relations");
          params.append("table", table);
          element.keys.forEach((key) => {
            params.append("id", key.id);
          });
          var url = "/api/?";
          const relation = await fetch(url + params.toString());
          return relation.json();
        })
      );

      const relation_result = [];

      result.map((item) => {
        item.forEach((subitem) => {
          relation_result.push(subitem);
        });
      });

      return relation_result;
    }
  }

  async function getPhases(passed_filter) {
    if (browser) {
      let params = new URLSearchParams();
      params.append("filter", passed_filter);
      params.append("type", "rows");
      params.append("table", phases_table);

      var url = "/api/?";

      const phases_promise = await fetch(url + params.toString());
      return await phases_promise.json();
    }
  }

  async function getRow(table, id) {
    if (browser) {
      let params = new URLSearchParams();
      params.append("filter", "");
      params.append("type", "row");
      params.append("table", table);
      params.append("row", id);

      var url = "/api/?";

      const phases_promise = await fetch(url + params.toString());
      return await phases_promise.json();
    }
  }

  let items = [];

  if (browser) {
    let relationModal = document.getElementById("relationModal");

    if(relationModal != null) {
    relationModal.addEventListener("show.bs.modal", async function (event) {
      items = [];
      let button = event.relatedTarget;

      let table = button.getAttribute("table");
      let title = button.getAttribute("title");
      let id = button.getAttribute("id");

      let modalTitle = relationModal.querySelector(".modal-title");
      let modalBody = relationModal.querySelector(".modal-body ");

      modalTitle.textContent = title;

      const row = await getRow(table, id);
      const rel = await getRelations(row.relations);

      items = rel;

      //modalBody.innerHTML = "hi";
    });
  }
  }
</script>

{#await phases}
  <p>Waiting for data...</p>
{:then results}
  {#if results != undefined}
    {#each results as phase}
      <!-- Create columns -->
      <div class="col-5 mh-100" style="overflow-y: scroll;">
        <h1>{phase.title}</h1>
        {#await getRelations(phase.relations)}
          <p>Loading...</p>
        {:then items}
          {#if items != undefined}
            <Masonry
              {items}
              {minColWidth}
              {maxColWidth}
              {gap}
              let:item
              bind:width
              bind:height
            >
              <Card {item} />
            </Masonry>
          {/if}
        {/await}
      </div>
    {/each}
  {/if}
{/await}

<!-- Modal -->
<div
  class="modal fade"
  id="relationModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        {#if items != undefined && items.length > 0}
          <Masonry
            {items}
            {minColWidth}
            {maxColWidth}
            {gap}
            let:item
            bind:width
            bind:height
          >
            <Card {item} />
          </Masonry>
        {/if}
      </div>
    </div>
  </div>
</div>
