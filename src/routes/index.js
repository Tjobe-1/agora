import Airtable from 'airtable';

/** @type {import('./index').RequestHandler} */
export async function get({ params }) {

    let result = await Raw();

    return {
        body: {
            result
        }
    };
}



function Raw() {
    var base = new Airtable({ apiKey: 'keyv8ZrQslj0bVOKL' }).base('appj4sYc35Y9KX05n');

	let items = [];
    
    return new Promise(function(resolve, reject) {
        base('Raw data')
		.select({
			// Selecting the first 3 records in Grid view:
			maxRecords: 100,
			view: 'Grid view'
		})
		.eachPage(
			function page(records, fetchNextPage) {
				// This function (`page`) will get called for each page of records.

				records.forEach(function (record) {

		

                    let item = {
                        "id": record.id,
                        "title": record.get('Name'),
                        "metadata": [record.get('Participant'), record.get('Analysis')],
                        "content": record.get('Attachments'),
                        "analysis": record.get('Analysis'),
						"links": []
                    }

					items.push(item);
				});

				// To fetch the next page of records, call `fetchNextPage`.
				// If there are more records, `page` will get called again.
				// If there are no more records, `done` will get called.
				fetchNextPage();
			},
			function done(err) {

				items.forEach(function(item){
					var relations = [];

					var links = item.analysis;
					if(links != undefined && links.length > 0) {
						links.forEach(function (element) {
							item.links.push('hi');
							base('Analysis').find(element, function(err, record) {
								if (err) { console.log('err'); return; }
								item.links.push(record.get('Name'))
								relations.push(record.get('Name'))
							})
						})
					}

				});

				

                resolve(JSON.stringify(items));

				if (err) {
					console.error(err);
					reject(Error("broke"));
				}
			}
		);

    });
}
