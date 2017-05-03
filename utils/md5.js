/**
 * Created by memebox on 16/9/22.
 */
module.exports = function(data){
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex");
}
