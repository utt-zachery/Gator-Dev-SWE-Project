import FoodInventory from "../models/foodInventory.js"

export const viewCatalog = async (req, res) => {
    let now = Date.now();
    await FoodInventory.find({checkIn: true, expirationEpoch: {$gt:now }}).then((data) => {
        
        let productMap = new Map();
        console.log(now+" Query Length: " +data.length );
        for (let i=0; i < data.length; i++) {
            if (productMap.has(data[i].foodItemID)) {
                let wrapperObj = productMap.get(data[i].foodItemID);
                wrapperObj.quantity = wrapperObj.quantity + data[i].quantity;
                if (data[i].expirationEpoch < wrapperObj.expirationEpoch) {
                    wrapperObj.expirationEpoch = data[i].expirationEpoch;
                }
                wrapperObj.results.push(data[i]);
            } else {
                let toAdd = {
                    expirationEpoch: data[i].expirationEpoch,
                    foodItemID: data[i].foodItemID,
                    quantity: data[i].quantity,
                    results: [data[i]]
                };
                productMap.set(data[i].foodItemID, toAdd);
            }
        }

        let array = Array.from(productMap, ([name, value]) => ({value }));
        array.sort((a,b) => (a.expirationEpoch > b.expirationEpoch ? -1 : 1));

        res.json(array);
    }).catch((err) => {
            res.status(200).send(err);
    });
}