/**
 * Created by pathfinder on 16. 4. 25.
 */

var mongoose = require('mongoose');

var CafeSchema = new mongoose.Schema({
    agree: [{ type: Boolean, default: false }],
    name: { type: String, default: '', required: true },
    detail: { type: String, default: ''},
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{4}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
        required: [true, 'User phone number required']
    },
    location: {
        latitude: { type: String, default: '0.0', required: true },
        longitude: { type: String, default: '0.0', required: true }
    },
    address: { type: String, default: '', required: true},
    detailAddress: { type: String, default: '' },
    images: [{ type: String, default: 'blank' }],
    likes: { type: Number, default: 0 },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }
},{
    timestamps: true
});

mongoose.model('Cafe', CafeSchema);