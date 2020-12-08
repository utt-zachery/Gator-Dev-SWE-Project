import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import mailgun from "mailgun-js";

export const doEmail = async(req, res, email, orderID, isLast) => {
    console.log("try");
    const DOMAIN = "sandboxa651d1324d5442afa29aa85b00fa0583.mailgun.org";
    const mg = mailgun({apiKey: "0d615ce4364ea0c76f454e9d6544c76d-4879ff27-2442fd64", domain: DOMAIN});
    const data = {
        from: "orders@sandbox.mgsend.net",
        to: email,
        subject: "Order Ready",
        text: "Greetings!<br/>Recently, you placed an order at the "
    };
    mg.messages().send(data, function (error, body) {
        if (!error) {
            Order.findByIdAndUpdate(orderID, {bagState: 3}, (err, data) => {
                if (err)
                    return res.status(200).json(err);
                if (isLast) {
                    return res.status(200).json({msg: "done"});
                }
            });
        }
        else {
            return res.status(200).json(error);
        }
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