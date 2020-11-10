import User from "../models/userModel.js";

//Create new user
export const newUser = async (req, res) => {

    if (!req.body || !req.body.email || !req.body.address || !req.body.longitude || !req.body.latitude ||!req.body.password) {
        
        if (!req.body) {
            return res.status(200).send({
            error: "Missing body in request body!",
            });
        } else  if (!req.body.email) {
            return res.status(200).send({
            error: "Missing email in request body!",
            });
        } else  if (!req.body.address) {
            return res.status(200).send({
            error: "Missing address in request body!",
            });
        } else  if (!req.body.longitude) {
            return res.status(200).send({
            error: "Missing longitude in request body!",
            });
        } else if (!req.body.latitude) {
            return res.status(200).send({
            error: "Missing latitude in request body!",
            });
        } else if (!req.body.password) {
            return res.status(200).send({
            error: "Missing password in request body!",
            });
        }
    }

    await FoodItem.findOne({ barcode: body.barcode}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });

          if (!data) {
                let userToAdd = new User({
                    email: req.body.email,
                    address: req.body.address,
                    password: req.body.password,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                }).save().then((addedUser) => {
                    console.log("\tAdded User: " + addedUser._id);
                    res.json(addedUser);
                });
          } else {
            return res.status(200).send({
                error: "User email already exists!",
            });
          }
    });

}
