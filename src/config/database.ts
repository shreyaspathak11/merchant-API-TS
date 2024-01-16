import mongoose from 'mongoose';


// Function to connect to MongoDB
export const connectDB = (uri: string) => {
    mongoose
      .connect(uri, {
        dbName: 'merchantdb',
      })
      .then((c) => console.log(`We got Connected to DB: ${c.connection.host}`))
      .catch((e) => console.log(e));
  };

// Exporting the connectDB function which will be imported in server.ts
export default connectDB;
