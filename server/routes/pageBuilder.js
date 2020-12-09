import * as fs from "fs";


export const buildPage2 = async (receptor1, foodBankData, packageData, req, res, pageNum, shouldAppendFoodBank)  => {
    await fs.readFile("web/receptor2.htm", "utf8", (err, data) => {
        if (!err) {
            
            if (pageNum > -1) {
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
                pageString = pageString.replace("<!-- INSERT AT HERE -->",foodBankData);
                pageString = pageString.replace("<!-- INSERT BARCODE KEY !-->", process.env.barcode);
                pageString = pageString.replace("<-- MAPQUESTKEY -->", process.env.mapQuest_api);

                if (req.oidc.user != undefined) {
                    pageString = pageString.replace("<!-- Login -->", "Log Out");
                    pageString = pageString.replace("<!-- Login Code -->", "location.href='logout'");
                    pageString = pageString.replace("<!-- USER INFO -->", JSON.stringify(req.oidc.user));
                } else {
                    pageString = pageString.replace("<!-- Login -->", "Log In");
                    pageString = pageString.replace("<!-- Login Code -->", "location.href='login'");
                }

                if (foodBankData.length == 0) {
                    let pageString2 = pageString.substring(0,"<!-- START FOODBANK -->".length + pageString.indexOf("<!-- START FOODBANK -->"));
                    let pageString3 = pageString.substring(pageString.indexOf("<!-- END FOODBANK-->"));
                    pageString = pageString2 + pageString3;
                }

                res.status(200).send(pageString);
           
        } else {
            res.status(200).send(err);
        }
    });
};

export const middleWare = async (receptor1, packageData, req, res, pageNum, shouldAppendFoodBank)  => {
    if (shouldAppendFoodBank) {
        await fs.readFile("web/ViewFoodBank.htm", "utf8", (err, data) => {
            if (!err) {
                buildPage2(receptor1, data, packageData, req, res, pageNum, shouldAppendFoodBank);
            } else {
                res.status(200).send(err);
            }
        });
    } else {
        buildPage2(receptor1, "", packageData, req, res, pageNum, shouldAppendFoodBank);
    }
}

export const buildPage1 = async (packageData, req, res, pageNum, shouldAppendFoodBank)  => {
    await fs.readFile("web/receptor1.htm", "utf8", (err, data) => {
        if (!err) {
            middleWare(data, packageData, req, res, pageNum, shouldAppendFoodBank);
        } else {
            res.status(200).send(err);
        }
    });
};

export const buildPage = async (req, res, fileName, pageNum)  => {
    await fs.readFile("web/"+ fileName +'.htm', "utf8", (err, data) => {
        if (!err) {
            buildPage1(data, req, res, pageNum, false);
        } else {
            res.status(200).send(err);
        }
    });
};

export const buildPageWithFoodBank = async (req, res, fileName, pageNum)  => {
    await fs.readFile("web/"+ fileName +'.htm', "utf8", (err, data) => {
        if (!err) {
            buildPage1(data, req, res, pageNum, true);
        } else {
            res.status(200).send(err);
        }
    });
};

export const buildHome = async(req, res) => {
    await fs.readFile("web/home.htm", "utf8", (err, data) => {
        if (!err) {
            if (req.oidc.user != undefined) {
                let pageString = data.replace("<!-- Login -->", "Log Out");
                pageString = pageString.replace("<!-- Login Code -->", "location.href='logout'");
                pageString = pageString.replace("<!-- USER INFO -->", JSON.stringify(req.oidc.user));
                pageString = pageString.replace(/web-resources/g,"web/web-resources/")
                res.status(200).send(pageString);
            } else {
                let pageString = data.replace("<!-- Login -->", "Log In");
                pageString = pageString.replace("<!-- Login Code -->", "location.href='login'");
                res.status(200).send(pageString.replace(/web-resources/g,"web/web-resources/"));
            }
            
        } else {
            res.status(200).send(err);
        }
    });
}