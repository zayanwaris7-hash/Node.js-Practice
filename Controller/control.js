import * as Module from '../Models/userModel.js';

export const handleGetApi=async(req,res)=>{
    try {
        const resul=await Module.getAllUser();
        if(resul.length>0){
            res.status(200).send(resul);
        }else{
            res.status(500).json({err:"server issue"});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export const handleGetIdApi=async(req,res)=>{
    try {
        const id=Number(req.params.id);
        const resul=await Module.getSpecificUser(id);
        if(resul){
            res.status(200).send(resul);
        }else{
            res.status(500).json({err:"server issue"});
        }
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export const handlePostIdApi=async(req,res)=>{
    try {
        
        const {Email,Password}=req.body;
        if(!Email || !Password){
            res.status(400).json({err : "Email And Password Required Nigga!"})
        }else{
            const resul=await Module.addUser(Email,Password);
            if(resul){
                res.status(200).send(resul);
            }else{
                res.status(500).json({err:"server issue"});
            }
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        
    }
}
export const handleDeleteIdApi=async(req,res)=>{
    try {
       const id=Number(req.params.id);
        const result=await Module.deleteUser(Id);
        if(result){
            res.status(200).send( "Inse4rted Id :",result.insertId);
        }else{
        res.status(500).json({err:"server issue"});
        }
    } catch (error) {
        res.status(500).send(error.message);
        
    }
}
export const handlePutIdApi=async(req,res)=>{
    try {
        const id=Number(req.params.id);
        const {Email,Password}=req.body;
        if(!Email || !Password){
            res.status(400).json({err : "Email And Password Required Nigga!"})
        }else{
            const resul=await Module.putUpdateUser(id,Email,Password);
            if(resul){
                res.status(200).send(resul);
            }else{
                res.status(500).json({err:"server issue"});
            }
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        
    }
}
export const handlePatchIdApi=async(req,res)=>{
    try {
        const id=Number(req.params.id);
        const {Password}=req.body;
        if(!Password){
            res.status(400).json({err : "Password Required Nigga!"})
        }else{
            const resul=await Module.patchfhUpdateUser(id,Password);
            if(resul){
                res.status(200).send(resul);
            }else{
                res.status(500).json({err:"server issue"});
            }
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        
    }
}
export const handleGet=async(req,res)=>{
    try {
        
        const resul=await Module.getAllUser();
        //console.log("this is",resul);
        if(resul.length>0){
            const RowsHTML = resul.map(u => `
                    <tr>
                        <td>${u.Id}</td>
                        <td>${u.Email}</td>
                        <td>${u.Password}</td>
                    </tr>
                `).join('');
    
                const Res = `
                <html>
                    <head>
                        <title>User Directory</title>
                        <style>
                            table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
                            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            tr:hover { background-color: #f5f5f5; }
                        </style>
                    </head>
                    <body>
                        <h1>Registered Users from MySQL</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${RowsHTML}
                            </tbody>
                        </table>
                    </body>
                </html>`;
    
            res.status(200).send(Res);
        }else{
            res.status(500).json({err:"server issue"});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}