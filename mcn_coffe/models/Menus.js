/**
 * Created by pathfinder on 16. 5. 4.
 */

var mongoose = require('mongoose');

var MenuSchema = new mongoose.Schema({
    name: String,
    cost: {type: Number, default: 0},
    options : [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

mongoose.model('OptionGroup', MenuSchema);