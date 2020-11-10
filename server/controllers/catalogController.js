import FoodInventory from "../models/foodInventory.js"

export const viewCatalog = async (req, res) => {
    let now = Date.now();
    await FoodInventory.find({checkIn: true, expirationEpoch: {$gt:now }}).then((data) => {
        
        let productMap = new Map();
        console.log(now+" Query Length: " +data.length );
        for (let i=0; i < data.length; i++) {
            if (productMap.has(data[i].barcode)) {
                let wrapperObj = productMap.get(data[i].barcode);
                wrapperObj.quantity = wrapperObj.quantity + data[i].quantity;
                if (data[i].expirationEpoch < wrapperObj.expirationEpoch) {
                    wrapperObj.expirationEpoch = data[i].expirationEpoch;
                }
                wrapperObj.results.push(data[i]);
            } else {
                let toAdd = {
                    expirationEpoch: data[i].expirationEpoch,
                    barcode: data[i].barcode,
                    quantity: data[i].quantity,
                    results: [data[i]]
                };
                productMap.set(data[i].barcode, toAdd);
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