const  express = require('express');
const router = express.Router();
const Order = require('../models/order');
const nodeMailer = require('nodemailer');

// router.post('/save', (req,res)=>{
//     //console.log(req.body.email)
//     const data = new Order({
//         name: req.body.user,
//         address: req.body.address,
//         note: req.body.note,
//         number_phone: req.body.phone,
//         products: req.body.products
//     })
//     data.save((err ,result) => {
//        if(err) throw err;
//         send_mail(req.body.email);
//        res.json(result);
//    })
// })

router.post('/save', (req,res)=>{
    const { user, note } = req.body;

    const convertPrd = req.body.product?.map(item => ({ ...item, _id: item.id }))

    const data = new Order({
        name: user,
        note,
        email: req.body.email,
        address: req.body.address,
        number_phone: req.body.phone,
        products: convertPrd,
        total: req.body.total
    })
    data.save((err ,result) => {
       if(err) throw err;
    //    if(req.body.email) send_mail(req.body.email);
       res.json({
           success: true,
           data: result
        });
   })
})

// router.get('/', (req,res)=>{
//     Order.find({})
//         // .populate({path: 'products'})
//         .exec(function(err,doc) {
//             if(err) res.json(err)
//             res.json(doc);
//         })
// })
router.get('/:id', (req,res)=>{
    console.log('req.params', req.params);

    Order.findById(req.params.id)
        .exec(function(err,doc) {
            if(err) res.json(err)
            res.json(doc);
        })
})

router.get('/', (req,res)=>{
    console.log('aaaa', req.query.email);

    Order.find({ email: req.query.email })
        .exec(function(err,doc) {
            if(err) res.json(err)
            res.json(doc);
        })
})

router.get('/user', (req,res)=>{
    Order.findOne({ email: req.body.email })
        .exec(function(err,doc) {
            if(err) res.json(err)
            res.json(doc);
        })
})
router.put('/', (req,res) => {
    const { _id } = req.body;
    Order.findByIdAndUpdate({ _id }, { status:true }, {new: true}, (err) => {
        if(err) res.status(200).json({ message: 'Something when wrong'});
        res.status(200).json({ message: 'Update status success'});
    })
})
function send_mail(email) {
    // let { to } = req.body;

    let transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: 'outking18@gmail.com',
            pass: 'vanhungpm2010'
        }
    });
    let mailOptions = {
        from: 'outking18@gmail.com', // sender address
        //to: "hungnv1097@gmail.com", // list of receivers
        to: email,
        subject: "Order in The Cake Tea", // Subject line
        text: "You recieved message from The Cake Tea", // plain text body
        html: '<p>Cám ơn bạn đã order tại The Cake Tea</b><ul><li>Username:' 
        // + req.body.name + '</li><li>Email:' 
        // + req.body.email + '</li><li>Username:' 
        // + req.body.message + '</li></ul>' // html body
    };
    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log(err);
            // res.redirect('/');
        } else {
            console.log('Message sent: ' +  info.response);
            // res.redirect('/');
        }
    });
}
module.exports = router;