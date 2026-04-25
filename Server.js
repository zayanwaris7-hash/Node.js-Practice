import express from "express";
import {User} from '../Data.js';
import fs from 'fs'


const Server=express();
const Port=3000;
//Higher order function (clososur concept);
Server.use(express.json());
//Routes
//Server Side Rendering 
Server.get("/User",(req,res)=>{
    const Rows=User.map(User=>` <tr><td>${User.id}</td><td>${User.name}</td><td>${User.job_title}</td></tr>`).join('');
    const Res=`
    <html>
            <head>
                <title>User Directory</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2 f2 f2; }
                </style>
            </head>
            <body>
                <h1>100 Registered Users</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Job Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Rows}
                    </tbody>
                </table>
            </body>
        </html>
    `;
    res.set('Content-Type', 'text/html');
    res.status(200).send(Res);
})


Server.get('/Api/User',(req,res)=>{
    res.set('Content-Type', 'text/json');
    res.status(200).send(User);
});

Server.get('/Api/User/:id',(req,res)=>{
    const Id=Number(req.params.id);
    const Res =User.find((a)=>a.id===Id);
    if(!Res){
        res.status(404).json({status:"failed",msg:"Id not found"});
    }else{
    res.send(Res);
    }

});
Server
    .route('/Api/User/:id')
    .post((req, res) => {
        const newUser = req.body;
        const id = User.length > 0 ? User[User.length - 1].id + 1 : 1;
        const userToAdd = { ...newUser, id };
        User.push(userToAdd);
        fs.writeFileSync('Data.js',`export const User = ${JSON.stringify(User ,null, 2)}`);
        res.status(201).json({ status: "Success", id: userToAdd.id });
    })
    .put((req, res) => {
        const userId = Number(req.params.id);
        const updatedData = req.body;
        const index = User.findIndex((u) => u.id === userId);
        
        if (index !== -1) {
            User[index] = { ...updatedData, id: userId }; // Keep the URL ID consistent
            fs.writeFileSync('Data.js',`export const User = ${JSON.stringify(User, null, 2)}`);
            res.json({ status: "Success", id: userId });
        } else {
            res.status(404).json({ status: "Failed", message: "User not found" });
        }
    })
    .patch((req, res) => {
        const userId = Number(req.params.id);
        const updates = req.body;
        const index = User.findIndex((u) => u.id === userId);
        
        if (index !== -1) {
            // Only update the fields provided in req.body
            User[index] = { ...User[index], ...updates };
            fs.writeFileSync('Data.js',`export const User = ${JSON.stringify(User, null, 2)}`);
            res.json({ status: "Success", userUpdated: userId });
        } else {
            res.status(404).json({ status: "Failed" });
        }
    })
    .delete((req, res) => {
        const userId = Number(req.params.id);
        const index = User.findIndex((u) => u.id === userId);
        
        if (index !== -1) {
            User.splice(index, 1); // Remove 1 element at the found index
            fs.writeFileSync('Data.js',`export const User = ${JSON.stringify(User, null, 2)}`);
            res.json({ status: "Success", deletedId: userId });
        } else {
            res.status(404).json({ status: "Failed", message: "User not found" });
        }
    });

Server.listen(Port, () => console.log(`Server is Running On Port: ${Port}`));