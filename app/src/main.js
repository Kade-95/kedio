const { IndexedLibrary } = require('./../../browser');
let db = IndexedLibrary('Kedio');

db.save({ collection: 'pages', query: { name: 'ken', _id: 'kgs66m5bxqp9ae4fs2zof0bj81989' }, check: { name: 'ken', _id: 'kgs66m5bxqp9ae4fs2zof0bj81989' } }).then(console.log)

db.save({ collection: 'openpages', query: { name: 'ken', _id: 'kgs66m5bxqp9ae4fs2zof0bj81989' }, check: { _id: 'kgs66m5bxqp9ae4fs2zof0bj81989' } }).then(console.log)