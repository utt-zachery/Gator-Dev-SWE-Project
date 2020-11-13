"use strict";

/*import all libraries */
import mongoose from "mongoose";
async function getUri() {
  return import("../config/config.js")
     .then(config => config.default.db.uri)
     .catch(process.env.uri)
}
const link = await getUri();
/* Connect to your database using mongoose */
const connectToDatabase = () => {
  //see https://mongoosejs.com/docs/connections.html
  //See https://docs.atlas.mongodb.com/driver-connection/
  mongoose
    .connect(link, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.error(error));
  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);
  return mongoose.connection;
};

export { connectToDatabase };
