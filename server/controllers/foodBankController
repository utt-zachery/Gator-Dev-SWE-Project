import FoodBank from "../models/foodBankModel.js";

//View all foodbanks
export const viewFoodBanks = async (req, res) => {
    await FoodBank.find({}, (err, data) => {
        if (err)
          return res.status(200).send({
            message: err.message || "An unknown error occurred",
          });
        res.json(data);
      });
};

//Create a foodBank
export const addFoodBank = async (req, res) => {
    const foodBankData = req.body;

    if (!foodBankData) {
        return res.status(200).send({
          error: "FootballClub not found",
        });
      }
      
    await new FootballClub(footballClub).save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(200).send(err);
    });
}