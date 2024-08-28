import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
host:"localhost",
user:"postgres",
port:5432,
password:"postgres",
database:"postgres"
})

pool.connect();

// pool.query(`Select * from users`, (err,res)=>{
//     if(!err){
//         console.log("res",res.rows);
//     }
//     else{
//         console.log("error",err.message)
//     }
//     pool.end
// })

export default pool;
