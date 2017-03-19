/**
 * Created by yangw on 2017/3/10.
 */

// 用户数据处理模式
var User = require('../models/User.js');

function user(app) {

    // 获取登录页面
    app.get('/login', function (req, res) {

        res.render('user_login', {
            action: 'login',
            title: '用户登录',
            slogan: '带渔教育'
        });
    });

    // 登录
    app.post('/login', function (req, res) {

        var account = req.body.account,
            password = req.body.password;
        if(account && password){

            User.signin({
                account: account,
                password: password

            }, function (error, pass) {

                if(error){
                    return res.json( JSON.stringify({
                        isError: true,
                        error: error
                    }) );
                }
                if(pass){
                    // 成功登录
                    req.session.account = account;
                    res.json( JSON.stringify({
                        isError: false,
                        pass: true
                    }) );


                }else {
                    // 密码或账户有误
                    res.json( JSON.stringify({
                        isError: false,
                        pass: false
                    }) );
                }
            });

        }else {
            // 未获取到账户信息
            res.json( JSON.stringify({
                isError: true,
                error: new Error('账户信息有误！')
            }) );
        }
    });
    
    // 注销
    app.post('/logout', function (req, res) {
        req.session.account = undefined;
        res.json( JSON.stringify({
            isError: false
        }) );
    });

    // 获取注册页面
    app.get('/signup', function (req, res) {
        res.render('user_login', {
            action: 'signup',
            title: '用户注册',
            slogan: '带渔教育'
        });
    });

    // 注册
    app.post('/signup', function (req, res) {

        var account = req.body.account,
            nickName = req.body.nickName,
            password = req.body.password;

        // 新建用户对象
        var newUSer = new User({
            account: account,
            password: password,
            nickName: nickName,
            root: false
        });

        newUSer.save(function (err, pass) {

            //发生错误
            if(err){
                res.json( JSON.stringify({
                    isError: true,
                    error: err
                }) );
            }

            if(pass){
                req.session.account = account;
                // 注册成功
                res.json( JSON.stringify({
                    isError: false,
                    pass: true
                }) );

            }else {
                // 用户账户已经被占用
                res.json( JSON.stringify({
                    isError: false,
                    pass: false
                }) );
            }
        });

    });

    // 获取个人信息页面
    app.get('/userInfo', function (req, res) {

        // 用户已经登录
        if(req.session.account){
            res.render('user_info', {
                title: "个人信息",
                account: req.session.account
            });
        }else {
            // 未登录
            res.render('user_login', {
                title: "用户登录",
                action: "login",
                slogan: "带渔教育"
            });
        }
    });
    
    // 获取个人信息
    app.post('/userInfo', function (req, res) {

        if(req.session.account){

            User.getSelfinfo({
                account: req.session.account,
                select: req.body.select || null
            }, function (err, data) {

                if(err){
                    return res.json( JSON.stringify({
                        isError: true,
                        error: err
                    }) );
                }
                // 成功返回个人信息
                res.json( JSON.stringify({
                    isError: false,
                    selefInfo: data
                }) );
            });
        }else {
            res.json( JSON.stringify({
                isError: true,
                error: new Error('未登录任何账户！')
            }) );
        }
    });


}

module.exports = user;