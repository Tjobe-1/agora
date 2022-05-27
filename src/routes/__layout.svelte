<script lang="ts">
  let scrollable = false;
  let carousel;

  const wheel = (node, options) => {
    let { scrollable } = options;

    const handler = (e) => {
      carousel.scrollTo(carousel.scrollLeft + e.deltaY, 0);
      if (!scrollable) e.preventDefault();
    };

    node.addEventListener("wheel", handler, { passive: false });

    return {
      update(options) {
        scrollable = options.scrollable;
      },
      destroy() {
        node.removeEventListener("wheel", handler, { passive: false });
      },
    };
  };
</script>

<svelte:window use:wheel={{ scrollable }} />

<div class="container-fluid vh-100 d-flex flex-column">
  <div class="row flex-shrink-0">
    <div class="col-12">
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-2">
        <div class="container justify-content-center">
          <ul class="nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Data</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contribute">Contribute</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/documents">Documents</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
  <div
    class="row flex-nowrap"
    style="min-height:0;
    overflow-y: hidden;"
    bind:this={carousel}
  >
    <slot />
  </div>
  <div class="row flex-shrink-0">
    <div class="col-12 bg-primary">
      <figure class="text-center">
        <blockquote class="blockquote"><p>Footer</p></blockquote>
      </figure>
    </div>
  </div>
</div>
