/**
 * Created by pathfinder on 16. 5. 20.
 */
const WAIT = 0;
const COMPLETE = 1;
const CANCEL   = 2;
const RECEIVE  = 4;

var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    order_idx: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    predictAt: { type: Date, default: Date.now },
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
            name: String,
            time: Number
        },
        options: [{
            _id: String,
            name: String
        }],
        cost: {type:Number, default:0},
        count: {type: Number, default:0}
    }],
    status: {type:Number, default:WAIT},
    rcv_point: {type:Number, default:2},
    cmt_point: {type:Number, default:2},
    comment: {type:String, default:""}
});

OrderSchema.methods.complete = function(cb){
    this.status = COMPLETE;
    this.save(cb);
};

OrderSchema.methods.cancel = function(cb){
    this.status = CANCEL;
    this.save(cb);
};

OrderSchema.methods.receive = function(rcv_point, cb){
    this.rcv_point = rcv_point;
    this.status = RECEIVE;
    this.save(cb);
};

OrderSchema.methods.message = function(cmt_point, comment, cb) {
    this.cmt_point = cmt_point;
    this.comment = comment;
    this.save(cb);
};

mongoose.model('Order', OrderSchema);