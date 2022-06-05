<script>
  import aroga_logo from "./components/agora_logo.svg";
</script>

<div
  class="container-fluid vh-100 justify-content-center"
  style="overflow:hidden; position:relative"
>
  <div class="container" id="homeContainer">
    <div class="row mt-2 justify-content-center">
      <div class="col" style="text-align:center">
        <object data={aroga_logo} width="30%" title="Logo" />
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col">
        <h1 class="text-center">Welcome!</h1>

        <div class="position-relative">
          <div class="d-flex mb-2 justify-content-center">
            <a
              href="/opt-in"
              class="btn btn-menu mx-1"
              tabindex="-1"
              role="button"
              aria-disabled="true">Opt-in</a
            >
            <a
              href="/explore"
              class="btn btn-menu mx-1"
              tabindex="-1"
              role="button"
              aria-disabled="true">Explore</a
            >
            <a
              href="/"
              class="btn btn-menu mx-1"
              tabindex="-1"
              role="button"
              aria-disabled="true">About</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
