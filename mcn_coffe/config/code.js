/**
 * Created by pathFinder on 2016-08-07.
 */
// resource code
var resource = {
    USER: 0,
    CAFE: 1,
    MENU: 2,
    OPTION: 3
};

var method = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3
};

var result = {
    SUCCESS: 0,
    AUTH: 1,
    PARAM_REQ: 2,
    PARAM_FORMAT: 3,
    SERVER_ERR: 4
};

var code = {
    resource: resource,
    method: method,
    result: result
};

module.exports = code;