import pool from '../db.js';
import sql from 'mysql2';

export const getAllUser = async () =>{
    const [All]=await pool.query("SELECT * FROM User;");
    return All;
}
export const getSpecificUser= async (id) =>{
    const [user]=await pool.query("SELECT * FROM User WHERE Id=?",[id]);
    return user[0];
}
export const deleteUser=async(id)=>{
    const [user]=await pool.query("DELETE FROM User WHERE Id=?",[id]);
    return user;
}
export const addUser=async(email,pass)=>{
    const [user]= await pool.query( "INSERT INTO User (Email, Password) VALUES (?, ?)", 
            [email,pass]);
   return user;
}
export const putUpdateUser=async(id,email,password)=>{
    const update=await pool.query("UPDATE User SET Email=?,Password=? WHERE Id=?",[email,password,id]);
    return update;
}
export const patchfhUpdateUser=async(id,password)=>{
    const update=await pool.query("UPDATE User SET Password=? WHERE Id=?",[password,id]);
    return update;
}

