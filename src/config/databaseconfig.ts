import mongoose from "mongoose";
const uri: string = "mongodb+srv://rohanthakur89768:dvLTfVxMiUI43sgT@cluster0.cxmlf.mongodb.net/";

async function connectDatabase() {
  try {
    const response = await mongoose.connect("mongodb+srv://rohanthakur89768:dvLTfVxMiUI43sgT@cluster0.cxmlf.mongodb.net/");
    console.log(`database is connected with :${response.connection.host}`);
  } catch (error) {
    console.log(`failed to connect with database !`);
    process.exit(1);
  }
}
export default connectDatabase;
