import Donation from '../models/donationModel.js'

export const viewDonations = async(req, res) => {
    if (!req.query || !req.query.userID) {
        if (!req.body) {
            return res.status(200).send({
                message:  "Please include a query string",
            });
        } else if (!req.body.userID) {
            return res.status(200).send({
                message:  "Please include a userID as a query element",
            });
        }
    }

    await Donation.find({userID: req.query.userID}).sort({"donationDate": -1}).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.status(200).send({
            message:  err
        });
    });
}