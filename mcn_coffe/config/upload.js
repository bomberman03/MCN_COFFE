/**
 * Created by pathFinder on 2016-08-14.
 */
var path = require('path');

var root = {
    userImage: path.join(__dirname, '../public/image/user'),
    cafeImage: path.join(__dirname, '../public/image/cafe'),
    menuImage: path.join(__dirname, '../public/image/menu')
};

module.exports = root;