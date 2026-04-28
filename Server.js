import express from "express";
import 'dotenv/config'
import AllRouter from './Roouter/router.js';
const Server = express();
const Port=process.env.PORT || 3000;
Server.use(express.json());
Server.use('/myServer',AllRouter);


Server.listen(Port, () => console.log(`Server is Running On Port: ${Port}`));