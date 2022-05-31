<script lang="ts">
  let scrollable = false;
  let carousel;

  // const wheel = (node, options) => {
  //   let { scrollable } = options;

  //   const handler = (e) => {
  //     carousel.scrollTo(carousel.scrollLeft + e.deltaY, 0);
  //     if (!scrollable) e.preventDefault();
  //   };

  //   node.addEventListener("wheel", handler, { passive: false });

  //   return {
  //     update(options) {
  //       scrollable = options.scrollable;
  //     },
  //     destroy() {
  //       node.removeEventListener("wheel", handler, { passive: false });
  //     },
  //   };
  // };
</script>

<svelte:window />


    <slot />
