import FoodBank from "../models/foodBankModel.js";
import User from "../models/userModel.js"

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

export const getUser = async(req, res, foodBankData) => {
  await User.findById(req.query.userID, (err, data) => {
      let trackDistance = distance(foodBankData.latitude, foodBankData.longitude, data.latitude, data.longitude, "mi");
      let toReteurn = {
        distance: trackDistance,
        foodBankData
      };
      res.json(toReteurn);
  });
}


export const viewFoodBanks = async (req, res) => {

  if (!req.query || req.query == "" || !req.query.foodBankID || req.query.foodBankID == "" ||  req.query.foodBankID == null || req.query.userID == "" ||  req.query.userID == null) {
    return res.status(200).send({
      message: "Must have foodBankID and userID in query",
    });
  }

    await FoodBank.findById(req.query.foodBankID, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });

         if (data)
         getUser(req, res, data);
         else
         res.send("No Data Found");
         console.log(data._id);
      });
};

const executeAddItem = async (foundBank, req, res) => {
  if (foundBank.length == 0) {

      const newTuple = new FoodBank({
        name: req.body.name,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
      });

      await new FoodBank(newTuple).save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(200).send(err);
      });
  } else {
    res.status(200).send("Foodbank Already Exists!");
  }
}

//Create a foodBank
export const addFoodBank = async (req, res) => {
    const foodBankData = req.body;

    if (!foodBankData) {
        return res.status(200).send({
          error: "Request data not found",
        });
      }
    
      if (!req.body.name || !req.body.address || !req.body.longitude || !req.body.latitude) {
        return res.status(200).send({
          error: "Insufficent data in body! Requires {name, address, longitude, latitude}",
        });
      }
      
    console.log({ name: req.body.name,
      address: req.body.address});

    await FoodBank.find({
      name: req.body.name,
      address: req.body.address
    }).then( foodBank => executeAddItem(foodBank, req, res));
    
}