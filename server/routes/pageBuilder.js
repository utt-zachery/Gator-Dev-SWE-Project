import * as fs from "fs";

export const buildPage2 = async (receptor1, packageData, req, res, pageNum)  => {
    await fs.readFile("web/receptor2.htm", "utf8", (err, data) => {
        if (!err) {
            
            if (pageNum >-1) {
                let inter = receptor1.split('class="nav-item"');
                receptor1 = "";
                
                for (var i=0; i < inter.length; i++) {
                    
                    if (i == pageNum)
                        receptor1 = receptor1 + inter[i] + 'class="nav-item active"';
                    else if (i != inter.length-1)
                        receptor1 = receptor1 + inter[i] + 'class="nav-item"';
                    else
                        receptor1 = receptor1 + inter[i];
                }
            }
            let pageString = receptor1.replace(/web-resources/g,"web/web-resources/") + packageData + data.replace(/web-resources/g,"web/web-resources/");

            res.status(200).send(pageString);
        } else {
            res.status(200).send(err);
        }
    });
};

export const buildPage1 = async (packageData, req, res, pageNum)  => {
    await fs.readFile("web/receptor1.htm", "utf8", (err, data) => {
        if (!err) {
            buildPage2(data, packageData, req, res, pageNum);
        } else {
            res.status(200).send(err);
        }
    });
};

export const buildPage = async (req, res, fileName, pageNum)  => {
    await fs.readFile("web/"+ fileName +'.htm', "utf8", (err, data) => {
        if (!err) {
            buildPage1(data, req, res, pageNum);
        } else {
            res.status(200).send(err);
        }
    });
};