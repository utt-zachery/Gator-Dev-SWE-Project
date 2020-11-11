import User from "../models/userModel.js";

//Create new user
export const newUser = async (req, res) => {

    if (!req.body || !req.body.email || !req.body.address || !req.body.longitude || !req.body.latitude ||!req.body.password || !req.body.name) {
        
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
        } else if (!req.body.name) {
            return res.status(200).send({
            error: "Missing name in request body!",
            });
        }
    }

    await User.findOne({ email: req.body.email}, (err, data) => {
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
                    latitude: req.body.latitude,
                    name: req.body.name
                }).save().then((addedUser) => {
                    console.log("\tAdded User: " + addedUser._id);
                    res.json(addedUser);
                }).catch((err) => {
                    res.status(200).send(err);
                  });
          } else {
            return res.status(200).send({
                error: "User email already exists!",
            });
          }
    });

}
