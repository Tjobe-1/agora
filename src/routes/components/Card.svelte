<script>
    export let item;
</script>

<div class="card border-primary">
    <!-- Image -->
    {#if item.image != ""}
      <img
        class="card-img-top"
        src={item.image}
        alt="Here should be a pic"
      />
    {/if}
    <div class="card-body">
      <!-- Title -->
      <h5 class="card-title">{item.title}</h5>

      <!-- Meta -->
      {#each item.meta as meta}
        {meta.name}
        <a href="#" class="card-link">{meta.content}</a>
      {/each}

      {#if item.text != ""}
        <hr />
        <p>{item.text}</p>
      {/if}
    </div>

    <div class="card-footer">
      {#each item.relations as relation}
        {#if relation.table == 10}
          {#each relation.keys as key}
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#relationModal"
              table={relation.table}
              title={key.title}
              id={key.id}
            >
              {key.title}
            </button>
          {/each}
        {/if}
      {/each}
    </div>
  </div>