/**
 * Created by pathfinder on 16. 5. 4.
 */

var mongoose = require('mongoose');

var MenuSchema = new mongoose.Schema({
    cafe: {type: mongoose.Schema.Types.ObjectId, ref: 'Cafe'},
    category: { type:String, default:'', required:true },
    name: { type: String, default: '', required: true },
    detail: { type: String, default: '' },
    cost: { type: Number, default: 0, required: true },
    image: { type: String, default: 'blank' },
    options : [{
        order: {type: Number, default: 0, required: true },
        name: { type: String, default: '', required: true },
        cost: { type: Number, default: 0, required: true },
        options : [{
            order: {type: Number, default: 0, required: true },
            name: { type: String, default: '', required: true },
            cost: { type: Number, default: 0, required: true }
        }]
    }]
},{
    timestamps: true
});

mongoose.model('Menu', MenuSchema);