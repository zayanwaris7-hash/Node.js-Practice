import express from "express";
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { constrainedMemory } from "node:process";

const pool = mysql.createPool({
    host: process.env.HOST.trim(),
    user: process.env.USER.trim(),
    password: process.env.PASSWORD, // Usually empty for root/localhost
    database: process.env.DATABASE.trim(),
    multipleStatements: process.env.MULTISTATMENTS === 'true'
});

const Server = express();
const Port = 3000;

Server.use(express.json());

Server.get("/User", async (req, res) => {
    try {
        // 1. Get the rows. 'rows' is the array of data.
        const [rows] = await pool.query("SELECT * FROM User;");

        // 2. Check if rows exist
        if (rows && rows.length > 0) {
            // 3. Map through data using the ACTUAL column names from your DB (Email, Password)
            const RowsHTML = rows.map(u => `
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

            res.send(Res);
        } else {
            res.status(404).send("<h1>No users found in database</h1>");
        }
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).send("Internal Server Error");
    }
});


Server.get('/Api/User', async (req, res) => {
    const [User] = await pool.query("SELECT * FROM User ;");
    if (User && User.length > 0) {
        res.set('Content-Type', 'text/json');
        res.status(200).send(User);
    } else {
        res.status(404).json({ Status: FAILED });
    }
});

Server.get('/Api/User/:id', async (req, res) => {
    try{
    const Id = Number(req.params.id);
    const [Res] = await pool.query("SELECT * FROM User WHERE Id = ? ;", [Id]);
    if (Res.length > 0) {
        res.status(200).send(Res[0]);
    } else {
        res.status(404).json({ status: "failed", msg: "Id not found" });
    }
    }catch{
        res.status(500).json({status: Failed});
    }

});

Server.post('/Api/User', async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Email & Password Required!" });
    }

    try {
        // Use auto-increment in DB if possible, otherwise keep your logic
        // Note: Removed quotes from ?
        
        const [User]= await pool.query("SELECT * FROM User;");
        const id = User.length > 0 ? User.length + 1 : 1;
        const [result] = await pool.query(
            "INSERT INTO User (Id,Email, Password) VALUES (?,?, ?)", 
            [id,Email, Password]
        );

        res.status(201).json({ 
            status: "Success", 
            AddedId: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ msg: "Server issue", error: err.message });
    }
});

Server
    .route('/Api/User/:id')
    .put(async(req, res) => {
        const userId = Number(req.params.id);
        const Update = req.body;
        const [User]=await pool.query("UPDATE User SET Email=?,Password=? WHERE ID =? ",[Update.Email,Update.Password,userId]);

        if (User) {
           const  msg= { ...updatedData, id: userId };
            res.json({ status: "Success", Updateinfo: msg});
        } else {
            res.status(404).json({ status: "Failed", message: "User not found" });
        }
    })
    .patch(async (req, res) => {
       const userId = Number(req.params.id);
        const Update = req.body;
        const [User]=await pool.query("UPDATE User SET Password=? WHERE Id = ? ",[Update.Password,userId]);

        if (User) {
           const  msg= { ...updatedData, id: userId };
            res.json({ status: "Success", Updateinfo: msg});
        } else {
            res.status(404).json({ status: "Failed", message: "User not found" });
        }
    })
    .delete(async(req, res) => {
        const userId = Number(req.params.id);
        const [User]=await pool.query("DELETE FROM User WHERE Id=? ",[userId]);

        if (User) {
           const  msg= { ...updatedData, id: userId };
            res.json({ status: "Success", Updateinfo: msg});
        } else {
            res.status(404).json({ status: "Failed", message: "User not found" });
        }
    });

Server.listen(Port, () => console.log(`Server is Running On Port: ${Port}`));