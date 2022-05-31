<script>
  export let item;
  let perspective;
  let category;

  switch (item.table) {
    case "7":
      perspective = "perspective-street";
      console.log("street");
      break;
    case "8":
      perspective = "perspective-system";
      break;
    case "9":
      perspective = "perspective-outsider";
      break;
  }

  item.relations.forEach(relation => {
    if(relation.table == 10) {
      relation.keys.forEach(key => {
        category = key.title;
      })
    }
  })

  console.log(item.table);
</script>

<div class="col">
  <div class="card text-center h-100 text-white {perspective}">
    <div class="card-header bg-transparent border-0">
      {category.toUpperCase()}
    </div>

    <div class="card-body ">
      <!-- Title -->

      <h5 class="card-title">{item.title}</h5>

      <!-- Meta -->
    </div>

    <div class="card-footer">
      <div class="circle {perspective}">1</div>
      <div class="circle {perspective}">3</div>
      <a
        href=""
        class="stretched-link"
        data-bs-toggle="modal"
        data-bs-target="#relationModal"
        title={category}
        id={item.id}
      />
    </div>
  </div>
</div>
