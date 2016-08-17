/**
 * Created by pathfinder on 16. 5. 4.
 */

var mongoose = require('mongoose');

var OptionSchema = new mongoose.Schema({
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    name: { type: String, default: '', required: true },
    option: { type: mongoose.Schema.Types.ObjectId, ref: 'Option'},
    cost: { type: Number, default: 0, required: true },
    hasChild: { type: Boolean, default:false },
    options : [{
        name: { type: String, default: '', required: true },
        cost: { type: Number, default: 0, required: true }
    }]
});

mongoose.model('Option', OptionSchema);