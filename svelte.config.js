/** @type {import('@sveltejs/kit').Config} */

import node from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';


const config = {
	preprocess: preprocess({
		kit: {
			// hydrate the <div id="svelte"> element in src/app.html
			adapter: node()
		}
	})
	
};

export default config;