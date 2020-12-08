import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import * as Config from "../../config/config.js"
import nodemailer from "nodemailer"
import ItemOrder from "../models/itemOrder.js"
import FoodBank from '../models/foodBankModel.js'
import FoodItem from "../models/foodModel.js"

export const doEmail = async(req, res, email, order, isLast,itemsOrdered, foodBank) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport( {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: Config.default.mailer.address, // generated ethereal user
            pass: Config.default.mailer.password, // generated ethereal password
        },
    });

    // send mail with defined transport object

    let msg = "Good news, " + email.name + "!<br/><br/>Recently, you placed an order at " + foodBank.name + " through PassItOn. We are writing today to inform you that your order has been processed and is ready for pickup at <b>" + foodBank.address + "</b><br/><br/>Here are the contents of your order:<br/><ul>";
    
    for (var i=0; i < itemsOrdered.length; i++) {
        msg=msg+"<li>"+itemsOrdered[i]+"</li>";
    }
    msg+= "</ul><br/><br/>Please come pick up your order within <b>2 buisiness days</b> of receiving this message. We can't wait to see you!<br/><br/>Best,<br/><br/>PassItOn Team";

    let info = await transporter.sendMail({
        from: 'orders.PassItOn@gmail.com', // sender address
        to: email.email, // list of receivers
        subject: "Food Bank Order Ready", // Subject line
        html: msg, // html body
    }, (error, response) => {
        if (!error) {
            Order.findByIdAndUpdate(order._id, {bagState: 3}, (err, data) => {
                if (err && res != null) 
                    return res.status(200).json(err);
                if (isLast && res != null) {
                    return res.status(200).json({msg: "done"});
                }
            });
        }
        
    });


}

export const resolveFoodItem = async(req, res, email, order, isLast,itemsOrdered, foodBank) => {
    for (var i=0;i<itemsOrdered.length; i++) {
        await FoodItem.findById(itemsOrdered[i].foodItemID, (err, data) => {
            if (!data && res != null) {
                return res.status(200).json({msg: "couldn't find FoodBank with ID " + order.foodBankID});
            }
            if (!err) {
                itemsOrdered[i] = itemsOrdered[i].quantity+ "x " + data.itemName;
                if (i==itemsOrdered.length -1) {
                    doEmail(req, res, email, order, isLast,itemsOrdered, foodBank);
                }
            }
            else {
                if (res != null)
                    return res.status(200).json(err);
            }
            
        });
    }
}
export const resolveFoodBank = async(req, res, email, order, isLast, itemsOrdered) => {
    await FoodBank.findById(order.foodBankID, (err, data) => {
        if (!data && res != null) {
            return res.status(200).json({msg: "couldn't find FoodBank with ID " + order.foodBankID});
        }
        if (!err) {
            resolveFoodItem(req, res,email, order,isLast,itemsOrdered,data);
        }
        else if (res != null)
                return res.status(200).json(err);
    })
}

export const resolveOrder = async(req, res, email, order, isLast) => {
    await ItemOrder.find({"orderModelID": order._id}, (err, data) => {
        if (!data && res != null) {
            return res.status(200).json({msg: "couldn't find an items with with ID " + order._id});
        }
        if (!err) {
            resolveFoodBank(req, res, email, order,isLast,data);
        }
        else if (res != null)
                return res.status(200).json(err);
    })
}

export const resolveEmail = async(req, res, orderData) => {
    for (var i=0; i < orderData.length; i++) {
        await User.findById(orderData[i].placedBy, (err, data) => {
           
            if (!data && res != null) {
                return res.status(200).json({msg: "couldn't find user with ID " + orderData[i].placedBy});
            }
            if (!err) {
                resolveOrder(req, res, data,  orderData[i], i==orderData.length-1);
            }
            else if (res != null)
                return res.status(200).json(err);
        });
    }
}

export const processEmails = async(req, res) => {
    await Order.find({bagState: 2}, (err, data) => {
        if ((!data || data.length ==0) && res != null) {
            return res.status(200).json({msg: "done"});
        }

        if (!err)
             resolveEmail(req, res, data);
        else if (res != null)
            return res.status(200).json(err);
    });
}