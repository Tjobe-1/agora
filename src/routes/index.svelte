<script>
  import Masonry from "svelte-bricks";
  import Card from "./components/Card.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import aroga_logo from "./components/agora_logo.svg";
  import Contribute from "./contribute.svelte";

  let [minColWidth, maxColWidth, gap] = [250, 800, 20];
  let width, height;

  let content_tables = [7, 8, 9];
  let selected_content_tables = [];

  let phases_table = 11;
  let categories_table = 10;

  let perspectives = [
    {
      name: "Street",
      table: 7,
    },
    {
      name: "System",
      table: 8,
    },
    {
      name: "Outsider",
      table: 9,
    },
  ];

  let phases;
  let categories;
  let content_tables_fields;
  let allcards;

  let modalItems;
  let modalItem;
  let selectedCheckbox = [];

  let phasesFilter = [];

  $: {
    phasesFilter = [];
    if (selectedCheckbox.length > 0 && selectedCheckbox != undefined) {
      selectedCheckbox.forEach((selection) => {
        const obj = {};
        obj.field = "Rel_Category";
        obj.filter = "link_row_has=";
        obj.id = selection;
        phasesFilter.push(obj);
      });
    }
  }

  $: allcards = contentRelations(selected_content_tables, phasesFilter);
  $: allcards = contentRelations("", phasesFilter);

  onMount(() => {
    phases = getTableRows(phases_table, "");
    categories = getTableRows(categories_table, "");
    content_tables_fields = getFields(content_tables);
    allcards = contentRelations("", phasesFilter);

    if (browser) {
      if (window.location.hash.includes("#")) {
        assembleModal(window.location.href);
      }

      window.addEventListener("hashchange", (event) => {
        assembleModal(window.location.href);
      });

      window.addEventListener("hide.bs.modal", (event) => {
        window.location.hash = "#";
        const backdrop = document.querySelectorAll("div.modal-backdrop");
        if (backdrop.length > 0) {
          backdrop[0].parentElement.removeChild(backdrop[0]);
        }
      });
    }
  });

  async function get_field_id(table, field_name, fields) {
    let id;
    fields.forEach((i_table) => {
      if (i_table[0].table_id == table) {
        i_table.forEach((field) => {
          if (field.name == field_name) {
            id = field.id;
          }
        });
      }
    });
    return id;
  }

  async function assemble_filter(table, field_name, query) {
    let fields = await content_tables_fields;
    let thafield = await get_field_id(table, field_name, fields);
    let filter_string = "filter__field_" + thafield + "__" + query + "&";
    return filter_string;
  }

  async function getFields(table_array) {
    if (browser) {
      const result = await Promise.all(
        table_array.map(async (table) => {
          let params = new URLSearchParams();
          params.append("filter", "");
          params.append("type", "fields");
          params.append("table", table);
          var url = "/api/?";
          const relation = await fetch(url + params.toString());
          return await relation.json();
        })
      );
      return await result;
    }
  }

  async function rowRelations(relation_array, passed_filter) {
    if (browser) {
      const result = await Promise.all(
        relation_array.map(async (element) => {
          let params = new URLSearchParams();
          let table = element.table;
          params.append("filter", passed_filter);
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
        if (Array.isArray(item)) {
          item.forEach((subitem) => {
            relation_result.push(subitem);
          });
        } else {
          if (Object.keys(item).length > 0) {
            relation_result.push(item);
          }
        }
      });

      return relation_result;
    }
  }

  async function contentRelations(id, passed_filter) {
    if (browser) {
      let tables_to_check = [];
      if (selected_content_tables.length > 0) {
        tables_to_check = selected_content_tables;
      } else {
        tables_to_check = content_tables;
      }
      const result = await Promise.all(
        tables_to_check.map(async (table) => {
          let params = new URLSearchParams();
          let filter = "";

          if (Array.isArray(passed_filter) && passed_filter.length > 0) {
            for (var i = 0; i < passed_filter.length; i++) {
              filter += await assemble_filter(
                table,
                passed_filter[i].field,
                passed_filter[i].filter + passed_filter[i].id
              );
            }
            filter += "filter_type=OR";
          }

          params.append("filter", filter);
          params.append("type", "filter_rows");
          params.append("table", table);
          var url = "/api/?";
          const relation = await fetch(url + params.toString());
          return relation.json();
        })
      );
      const relation_result = [];

      result.map((item) => {
        if (Array.isArray(item)) {
          item.forEach((subitem) => {
            relation_result.push(subitem);
          });
        } else {
          if (Object.keys(item).length > 0) {
            relation_result.push(item);
          }
        }
      });

      return relation_result;
    }
  }

  async function getTableRows(table, passed_filter) {
    if (browser) {
      let params = new URLSearchParams();
      params.append("filter", passed_filter);
      params.append("type", "rows");
      params.append("table", table);

      var url = "/api/?";

      const res_promise = await fetch(url + params.toString());
      return await res_promise.json();
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

  function checkPhase(item, phase) {
    const rel = item.relations.find((element) => element.table == phases_table);
    let key;
    if (rel != undefined) {
      key = rel.keys.find((element) => element.id == phase);
    }
    if (key != undefined) {
      return true;
    } else {
      return false;
    }
  }

  async function assembleModal(url) {
    modalItems = undefined;
    modalItem = undefined;

    const urlObj = new URL(url);

    if (urlObj.hash == "") {
      return;
    }

    let params = new URLSearchParams(urlObj.hash.substring(1));

    let table = params.get("table");
    let id = params.get("id");

    var myModal = new bootstrap.Modal(
      document.getElementById("relationModal"),
      ""
    );

    const backdrop = document.querySelectorAll("div.modal-backdrop");
    let modalTitle = relationModal.querySelector(".modal-title");

    modalTitle.textContent = "Loading...";

    if (!myModal._isShown) {
      if (backdrop.length > 0) {
        backdrop[0].parentElement.removeChild(backdrop[0]);
      }
      myModal.show();
    }

    const item = await getRow(table, id);
    modalItem = await item;
    modalTitle.textContent = modalItem.title;

    let pushItems = [];

    for (var i = 0; i < item.relations.length; i++) {
      if (content_tables.includes(item.relations[i].table)) {
        for (var j = 0; j < item.relations[i].keys.length; j++) {
          pushItems.push(
            await getRow(item.relations[i].table, item.relations[i].keys[j].id)
          );
        }
      }
    }

    modalItems = pushItems;
  }
</script>


<div class="container-fluid vh-100 d-flex flex-column">
  <div class="row flex-nowrap h-100">
    <div class="col-8 col-sm-3 col-md-4 col-lg-2 mh-100 h-100 collapse show" id="menu">
      <object data={aroga_logo} width="100%" class="mt-2" title="Logo"/>
      <div class="container menu-container">
        <h2 class="mt-2 text-center">Filter</h2>

          {#await categories}
            <p>waiting</p>
          {:then category}
            {#if category != undefined}
              {#each category as cat}
                <div
                  class="btn-group me-1 mb-1 flex-wrap"
                  role="group"
                  aria-label="First group"
                >
                  <input
                    type="checkbox"
                    class="btn-check"
                    id={cat.title}
                    autocomplete="off"
                    bind:group={selectedCheckbox}
                    value={cat.tableid}
                  />
                  <label class="btn btn-menu" for={cat.title}>{cat.title}</label
                  >
                </div>
              {/each}
            {/if}
          {/await}

        <div
          class="btn-toolbar my-4"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          {#if perspectives != undefined}
            {#each perspectives as perspective}
              <div
                class="btn-group me-1 mb-1 flex-wrap"
                role="group"
                aria-label="Second group"
              >
                <input
                  type="checkbox"
                  class="btn-check"
                  id={perspective.name}
                  autocomplete="off"
                  bind:group={selected_content_tables}
                  value={perspective.table}
                />
                <label class="btn btn-menu" for={perspective.name}
                  >{perspective.name}</label
                >
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <div class="container my-4 menu-container">
        <h2 class="my-2 text-center">Pages</h2>
      </div>
    </div>

    <div
      class="col mh-100 pt-2 h-100"
      style="overflow-x:scroll; height: 100vh"
    >

<div style="position: fixed">
  <button
    class="btn"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#menu"
    aria-controls="navbarToggleExternalContent"
    aria-expanded="true"
    aria-label="Toggle navigation"
    style="border: 2px solid black; background-color: #fff9f3"
  ><i class="fa fa-bars"></i></button>
</div>
      <div class="container-fluid d-flex flex-column" style="height:100%">
        <div class="row flex-nowrap mx-4 h-100">
          {#await phases}
            <p>Waiting for data...</p>
          {:then results}
            {#if results != undefined}
              {#each results as phase}
                <!-- Create columns -->
                <div
                  class="col-12 col-md-10 col-lg-10 col-xl-8 mh-100 me-5"
                  style="overflow-y:hidden"
                >
                  <h1>{phase.title}</h1>
                  {#await allcards}
                    <p>Loading...</p>
                  {:then items}
                    {#if items != undefined}
                      <div
                        class="container-fluid p-0 pe-2"
                        style="height: 90%; width:100%; overflow-y:scroll; overflow-x:hidden;"
                      >
                        <div
                          class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-3 g-4"
                        >
                          {#each items as item}
                            {#if checkPhase(item, phase.tableid)}
                              <Card {item} />
                            {/if}
                          {/each}
                        </div>
                      </div>
                      <div
                        style="box-shadow: 0px -7px 7px -10px; position:relative; z-index: 1000; width:100%; min-height:10px; clear:both"
                      >
                        &nbsp;
                      </div>
                    {/if}
                  {/await}
                </div>
              {/each}
            {/if}
          {/await}
        </div>
      </div>
    </div>
  </div>
</div>

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
        {#await modalItem}
          <p>Loading...</p>
        {:then item}
          {#if item != undefined}
            {#if item.meta.length > 0}
              <div class="row">
                {#each item.meta as meta}
                  {#if meta.content != null}
                    <div class="col-auto">
                      <p>
                        <strong>{meta.name + ":" + " " + meta.content}</strong>
                      </p>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}

            <div class="row mb-3">
              <div class="col">
                <p>{item.text}</p>
              </div>
              <div class="col">
                {#if item.image != ""}
                  <img
                    src={item.image}
                    class="rounded"
                    alt="relation"
                    style="width: 100%; margin-right:10px"
                  />
                {/if}
              </div>
            </div>
            <hr />
          {/if}
        {/await}

        {#await modalItems}
          <p>Loading...</p>
        {:then items}
          {#if items != undefined}
            <div
              class="container-fluid p-0 pe-2"
              style="height: 90%; width:100%; overflow-y:scroll; overflow-x:hidden;"
            >
              <div class="row row-cols-1 row-cols-md-3 g-4">
                {#each items as item}
                  <Card {item} />
                {/each}
              </div>
            </div>
          {:else}
            <p class="text-center">Loading items...</p>
          {/if}
        {/await}
      </div>
    </div>
  </div>
</div>
