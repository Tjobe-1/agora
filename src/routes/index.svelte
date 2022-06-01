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


    const urlObj = new URL(url)
    let params = new URLSearchParams(urlObj.hash.substring(1))

    let table = params.get("table")
    let id = params.get("id")
    let title = params.get("title")


    var myModal = new bootstrap.Modal(
      document.getElementById("relationModal"),
      ""
    );

    let modalTitle = relationModal.querySelector(".modal-title");
    let modalBody = relationModal.querySelector(".modal-body ");

    modalTitle.textContent = title;
    myModal.show();

    const item = await getRow(table, id)
    modalItem = await item;


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
    <div class="col-2 mh-100 h-100" id="menu">
      <object data={aroga_logo} width="100%" class="mt-2" />
      <div class="container menu-container">
        <h2 class="mt-2 text-center">Filter</h2>
        <div
          class="btn-toolbar mt-2"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          {#await categories}
            <p>waiting</p>
          {:then category}
            {#if category != undefined}
              {#each category as cat}
                <div
                  class="btn-group me-2 mb-2 flex-wrap"
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
        </div>
        <div
          class="btn-toolbar my-4"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          {#if perspectives != undefined}
            {#each perspectives as perspective}
              <div
                class="btn-group me-2 mb-2 flex-wrap"
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
      class="col-10 mh-100 pt-2 h-100"
      style="overflow-x:scroll; height: 100vh"
    >
      <div class="container-fluid d-flex flex-column" style="height:100%">
        <div class="row flex-nowrap h-100">
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
          {/if}
        {/await}
      </div>
    </div>
  </div>
</div>
