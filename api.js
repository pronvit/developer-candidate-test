module.exports = function(CT) {
	const app = CT.app;

	CT.app.get('/api/people', function(req,res) {
		console.log(req.query);
		var filters = req.query.filters;

		CT.fetchPeople(filters, function(err, docs) {
			if (err) {
				CT.log.error(err, 'error fetching people with filters', filters);
				res.send({ ok:false, error:err.message });
				return;
			}

			var result = docs.map(function(d) {
				return { name:d.name, age:d.age };
			});
	
			res.send({ ok:true, result });
		});
	});
};
