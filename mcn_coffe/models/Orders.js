/**
 * Created by pathfinder on 16. 5. 20.
 */
const WAIT = 0;
const COMPLETE = 1;
const CANCEL   = 2;
const RECEIVE  = 4;

var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    cafe: {
        _id: String,
        name: String,
        detail: String
    },
    user: {
        _id: String,
        username: String,
        name: String,
        email: String,
        phone: String
    },
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
    }],
    status: {type:Number, default:WAIT}
});

OrderSchema.methods.complete = function(cb){
    this.status = COMPLETE;
    this.save(cb);
};

OrderSchema.methods.cancel = function(cb){
    this.status = CANCEL;
    this.save(cb);
};

OrderSchema.methods.receive = function(cb){
    this.status = RECEIVE;
    this.save(cb);
};

mongoose.model('Order', OrderSchema);