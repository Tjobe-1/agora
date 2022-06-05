<script>
    import Typeform from 'svelte-typeform-embed';
    function submitted () {
        window.location.href = '/';
    }
</script>

<div class="container">
    <Typeform url="https://ttvbussel.typeform.com/to/OGYV2t9Q" onSubmit={submitted}/>
</div>
