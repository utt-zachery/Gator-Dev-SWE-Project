import FoodBank from '../models/foodBankModel.js'
import User from '../models/userModel.js'

    /*

         Distance calculation code is taken from https://www.geodatasource.com/developers/javascript

    */

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit == "mi") {dist = dist * 1.609344 * 0.621371};
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

export const findUserLocation = async(data, req, res) => {
    await User.findById(req.query.userID).then((user) => {
        if (user) {
            let distanceArray = [];
           
            for (let i=0; i < data.length; i++) {
                let quickDist = distance(data[i].latitude, data[i].longitude, user.latitude, user.longitude, "mi");
               
                distanceArray.push({
                    dist: quickDist,
                    foodBank: data[i]
                });
            
            }
            distanceArray.sort((a,b) => (a.dist < b.dist ? -1 : 1));

            let toReturn = [];

            if (!req.query.perPage) {
                if (req.query.page) {
                    toReturn =distanceArray.slice(req.query.page*50,req.query.page*50+50);
                } else {
                    toReturn =distanceArray.slice(0,50);
                }
            }  else {
                if (req.query.page) {
                    toReturn =distanceArray.slice(req.query.page*req.query.perPage,req.query.page*req.query.perPage+req.query.perPage);
                } else {
                    toReturn =distanceArray.slice(0,req.query.perPage);
                }
            }

            res.json(toReturn);

        } else {
            return res.status(200).send({
                message:  "User not found!"
            });
        }
    }).catch((err) => {
        return res.status(200).send(err);
    });
}

export const viewFoodBanks = async(req, res) => {
    if (!req.query || !req.query.userID) {
        return res.status(200).send({
            message:  "Request must include a userID query string"
        });
    }

    await FoodBank.find({}).then((data) => {
        findUserLocation(data, req, res);
    }).catch((err) => {
        return res.status(200).send(err);
    });

}