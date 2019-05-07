module.exports = function(CT) {
	const app = CT.app;

	CT.app.get('/api/people', function(req,res) {
		var filters = req.query.filters;

		CT.fetchPeople(filters, { name:1, age:1 }, function(err, docs) {
			if (err) {
				CT.log.error(err, 'error fetching people with filters', filters);
				res.send({ ok:false, error:err.message });
				return;
			}

			res.send({ ok:true, result:docs });
		});
	});
};
