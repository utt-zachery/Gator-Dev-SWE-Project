import FoodInventory from "../models/foodInventory.js"

export const viewCatalog = async (req, res) => {
    let now = Date.now();
    await FoodInventory.find({checkIn: true, expirationEpoch: {$gt:now }}).then((data) => {
        
        let productMap = new Map();
        let expirationMap = new Map();
        console.log(now+" Query Length: " +data.length );
        for (let i=0; i < data.length; i++) {
            if (expirationMap.has(data[i].foodItemID)) {
                if (data[i].expirationEpoch < expirationMap[data[i].foodItemID]) {
                    expirationMap[data[i].foodItemID] = data[i].expirationEpoch;
                }
            } else {
                expirationMap[data[i].foodItemID] = data[i].expirationEpoch;
            }

            if (productMap.has(data[i].foodItemID)) {
                productMap[data[i].foodItemID] = productMap[data[i].foodItemID]  + data[i].quantity;
            } else {
                productMap[data[i].foodItemID] = data[i].quantity;
            }
        }

        var keys = Object.expirationMap(cust);
        keys.forEach(key=>{
        console.log(key + '|' + cust[key]);
        });
        console.log(" \t\t----");
        keys = productMap.expirationMap(cust);
        keys.forEach(key=>{
        console.log(key + '|' + cust[key]);
        });

        let toReturn = ([...expirationMap].sort((a, b) => {
            // Some sort function comparing keys with a[0] b[0] or values with a[1] b[1]
            // Be sure to return -1 if lower and, if comparing values, return 0 if equal

            a.quantity = productMap[a.foodItemID];

            if (expirationMap[a] < expirationMap[b]) {
                return -1;
            } else if (expirationMap[a] > expirationMap[b]) {
                return 1;
            } else {
                return 0;
            }

        }));

        res.json(toReturn);

    }).catch((err) => {
            res.status(200).send(err);
    });
}