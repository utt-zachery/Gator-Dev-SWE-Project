import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import * as Config from "../../config/config.js"
import nodemailer from "nodemailer"

export const doEmail = async(req, res, email, orderID, isLast) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: Config.default.Gmail.address, // generated ethereal user
            pass: Config.default.Gmail.password, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'orders.PassItOn@gmail.com', // sender address
        to: "utt.zachery@ufl.edu", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    }, (response) => {
        console.log(response);
        Order.findByIdAndUpdate(orderID, {bagState: 3}, (err, data) => {
            if (err)
                return res.status(200).json(err);
            if (isLast) {
                return res.status(200).json({msg: "done"});
            }
        });
    });
}

export const resolveEmail = async(req, res, orderData) => {
    for (var i=0; i < orderData.length; i++) {
        await User.findById(orderData[i].placedBy, (err, data) => {
           
            if (!data) {
                return res.status(200).json({msg: "couldn't find user with ID " + orderData[i].placedBy});
            }
            if (!err) {
                doEmail(req, res, data.email, orderData[i]._id, i==orderData.length-1);
            }
            else
                return res.status(200).json(err);
        });
    }
}

export const processEmails = async(req, res) => {
    await Order.find({bagState: 2}, (err, data) => {
        if (!data || data.length ==0) {
            return res.status(200).json({msg: "done"});
        }

        if (!err)
             resolveEmail(req, res, data);
        else
            return res.status(200).json(err);
    });
}