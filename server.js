const express = require("express");

const dotenv = require("dotenv");
dotenv.config();



const router = require('./routes/contactRoutes');
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const app = express();
connectDb();

port = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/contacts",router);
app.use("/api/users",userRoutes);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`listening on the port ${port} `);
});