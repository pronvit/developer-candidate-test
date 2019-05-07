module.exports = function(CT) {
	function filtersToQuery(filters) {
		var query = {};

		if (!filters)
			return query;

		try {
			for (let [field, filter] of Object.entries(filters)) {
				if (filter.type == 'single') {
					if (filter.value)
						query[field] = filter.value;
				
				} else if (filter.type == 'minmax') {
					let [ min, max ] = filter.value;

					if (min != '' && max != '')
						query[field] = { $gte:+min, $lt:+max };
					else if (min != '')
						query[field] = { $gte:+min };
					else if (max != '')
						query[field] = { $lt:+max };
				}
			}
		} catch (e) {
			CT.log.error(e, 'error building query from filters', filters);
		}

		return query;
	};

	CT.fetchPeople = function(filters, fields, cb) {
        var query = filtersToQuery(filters);

        CT.db.find(query).projection(fields).exec(function(err,docs) {
            cb(err, docs)
        });        
	};	
};