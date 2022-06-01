<script>
  export let item;
  let perspective;
  let category;

  let content_tables = [7, 8, 9];
  let circles = [];

  function getTablePerspective(table) {
    let tableInt = parseInt(table)
    switch (tableInt) {
      case 7:
        return "perspective-street";
        break;
      case 8:
        return "perspective-system";
        break;
      case 9:
        return "perspective-outsider";
        break;
    }
  }

  perspective = getTablePerspective(item.table);

  item.relations.forEach((relation) => {
    if (relation.table == 10) {
      relation.keys.forEach((key) => {
        category = key.title;
      });
    } else if (content_tables.includes(relation.table)) {
      let circle = {}
      circle.perspective = getTablePerspective(relation.table)
      circle.amount = relation.keys.length;
      if(circle.amount > 0) {circles.push(circle)}
    }
  });
</script>

<div class="col" style="">
  <div class="card text-center h-100 text-white {perspective}">
    <div class="card-header bg-transparent border-0">
      {category.toUpperCase()}
    </div>

    <div class="card-body ">
      <!-- Title -->

      <h5 class="card-title">{item.title}</h5>

      <!-- Meta -->
    </div>

    <a
        style=""
        class="stretched-link"
        data-bs-dismiss="modal"
        data-bs-toggle="modal"
        data-bs-target="#relationModal"
        title={category}
        item={JSON.stringify(item)}
      />

      <!-- <a
      style=""
      class="stretched-link"
      data-bs-dismiss="modal"
      data-bs-toggle="modal"
      href="#relationModal"
    /> -->
    
{#if circles.length > 0}
    <div class="card-footer">
      {#each circles as circle}
      <div class="circle {circle.perspective} mx-1">{circle.amount}</div>
      {/each}
    </div>
    {/if}
  </div>
</div>
