/**
 * Created by pathfinder on 16. 5. 20.
 */

var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    cost: {type: Number, default: 0},
    orders: [{
        menu: {type: mongoose.Schema.Types.ObjectId, ref: 'Menu'},
        options: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}],
        count: {type: Number, default:0}
    }]
});

mongoose.model('Order', OrderSchema);