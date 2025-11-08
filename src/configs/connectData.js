import mysql from "mysql";
import { DB_CONFID } from "./db.config.js"

const connection = mysql.createConnection(DB_CONFID.mysql_connect);

connection.connect((err) => {
    if(err) {
        return;
    }
});

connection.commit(); 
export default connection;