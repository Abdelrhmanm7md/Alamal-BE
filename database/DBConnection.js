import mongoose from "mongoose";

const DBConnection = () => {
  const connectionString = "mongodb://localhost:27017/Alaml";

  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) =>
      console.log(`Database successfully connected on ${connectionString}`)
    )
    .catch((err) => console.error(`Database connection error: ${err.message}`));
};

export default DBConnection;
