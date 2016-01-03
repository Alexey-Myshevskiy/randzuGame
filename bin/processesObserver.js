/**
 * Created by alexey on 03.01.16.
 */
module.exports = function logger(req,res,next){
    console.log(new Date(), req.method, req.url);
    next();
};