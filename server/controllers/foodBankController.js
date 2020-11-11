import FoodBank from "../models/foodBankModel.js";

//View all foodbanks
export const viewFoodBanks = async (req, res) => {
    await FoodBank.find({}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });
         res.json(data);
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