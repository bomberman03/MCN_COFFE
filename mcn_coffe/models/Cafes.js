/**
 * Created by pathfinder on 16. 4. 25.
 */

var mongoose = require('mongoose');

var CafeSchema = new mongoose.Schema({
    name: String,
    detail: String,
    thumbnail: {type: String, default: 'blank'},
    likes: {type: Number, default: 0}
});

mongoose.model('Cafe', CafeSchema);