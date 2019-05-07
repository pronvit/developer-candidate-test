import 'jquery';
import './jquery.ba-bbq';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { peopleFilters } from './filters';

var app = new Vue({
    el: '#app',
    delimiters: [ '[[', ']]' ],
    
    data: {
        error: null,
        people: [],
        filters: [],
        allFilters: peopleFilters,   
    },

    watch: {
        filters: {
            handler: function() {
                this.fetchPeople();
            },
            deep: true,
        }
    },

    filters: {
        json: function(v) {
            return JSON.stringify(v);
        },

        fieldOrSelf: function(v, f) {
            return (v instanceof Object ? v[f] : v);
        }
    },

    methods: {
    	fetchPeople: function() {
		    var app = this;

		    var qfilters = {};
            var sfilters = [];
		    for (let f of app.filters) {
		        if (f.type == 'single-select')
		            qfilters[f.field] = { type:'single', value: f.value };
		        else if (f.type == 'minmax-input' || f.type == 'minmax-select')
		            qfilters[f.field] = { id: f.id, type:'minmax', value: f.value };
		        else if (f.type == 'range')
		            qfilters[f.field] = { id: f.id, type:'minmax', value: f.value.split('-') };

                sfilters.push({ id: f.id, value: f.value });
		    }

			$.bbq.pushState({ filters:sfilters });

		    $.get('/api/people?' + $.param({ filters:qfilters }), function(data) {
		        if (data.ok) {
		            app.people = data.result;
                    app.error = null;
		        } else
		            app.error = 'Error fetching data';
		    }).fail(function() {
                app.error = 'Error fetching data';
            });
		},

		addFilter: function(filter) {
		    Vue.set(filter, 'value', filter.initValue());
            
            for (let j in this.filters) {
                if (filter.field == this.filters[j].field) {
                    //TODO: preserve values when changing to another filter for the same field
                    this.filters.splice(j, 1, filter)
                    return;
                }
            }

		    this.filters.push(filter);
		},

        clearFilters: function(filter) {
            this.filters = [];
        },

		restoreFilters: function() {
            var savedFilters = $.bbq.getState('filters');
            try {
                for (let f of Object.values(savedFilters)) {
                    for (let ft of this.allFilters) {
                        if (ft.id == f.id) {
                            Vue.set(ft, 'value', f.value);
                            this.filters.push(ft);
                            break;
                        }
                    }
                }
            } catch(e) {}
		},
    },

    mounted: function() {
    	this.restoreFilters();
        this.fetchPeople();
    }
});

$(window).bind('hashchange', function(e) {
    app.restoreFilters();
});