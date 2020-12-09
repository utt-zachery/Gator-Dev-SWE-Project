const path = require('path');
const image_file = path.join(__dirname, '..', 'images', 'codabar-text.png')

// Barcode
let Dynamsoft = require("dynamsoft-node-barcode");
// Get a free trial license from https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx
Dynamsoft.BarcodeReader.productKeys = '';
 
(async()=>{
    let reader = await Dynamsoft.BarcodeReader.createInstance();
    for(let result of await reader.decode(image_file)){
        console.log('Barcode result: ' + result.barcodeText);
    }
    reader.destroy();
    Dynamsoft.BarcodeReader._dbrWorker.terminate();
})();