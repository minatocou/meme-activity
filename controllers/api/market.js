/**
 * Created by Jesse on 16/12/27.
 */
// var express = require('express'),
//     app = require('../../app'),
//     router = express.Router(),
//     redshift = require('../../redshift'),
//     env = process.env.NODE_ENV||'development',
//     config = require('../../conf/config')[env];
// router.get('/market/history',function (req,res) {
//     var obj ={},limit = req.query.size||3,page = req.query.page||1;
//     redshift.history.findAndCountAll({
//         where:{
//             action_type:req.query.type,
//             related_id:req.query.id,
//         },
//         attributes:[
//           'user_name','action_time','action'
//         ],
//         order : 'action_time DESC',
//         limit:limit,
//         offset:(page - 1) * limit
//     }).then(function (result) {
//         obj.code=1;
//         obj.data = {
//             list:result.rows,
//             total:result.count
//         };
//         obj.msg='查询成功';
//         res.json(obj);
//     }).catch(function (err) {
//         res.json({
//             code:0,
//             msg:'查询失败',
//             data:{}
//         });
//         console.log('err:',err);
//     })
// });
// module.exports = router;