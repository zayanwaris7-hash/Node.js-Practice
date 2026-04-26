import mysql from 'mysql2/promise' ;
const pool=mysql.createPool(
    {
        host:"localhost",
        user:"root",
        password:"Zw12345678.",
        database:"bank",
        multipleStatements:true
    }
);
//UPDATE table_name
//SET column_name = 'new_value'
//WHERE unique_id = 1;
const [result]=await pool.query("USE bank;UPDATE acc SET Status='Active' WHERE AccId=201;SELECT * FROM acc;");
console.log(result[2]);
 