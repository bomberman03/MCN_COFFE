/**
 * Created by pathfinder on 16. 5. 20.
 */

var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    cafe: {type: mongoose.Schema.Types.ObjectId, ref: 'Cafe'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cost: {type: Number, default: 0},
    orders: [{
        menu: {
            _id: String,
            name: String
        },
        options: [{
            _id: String,
            name: String
        }],
        cost: {type:Number, default:0},
        count: {type: Number, default:0}
    }]
});

mongoose.model('Order', OrderSchema);