<?php

/**
 * Connection class
 * use to determine the connection to the database
 *
 * @author ekarudianto
 */
class Connection {

    private $host;
    private $username;
    private $password;
    private $database;

    public function __construct($h, $u, $p, $d) {
        $this->host = $h;
        $this->username = $u;
        $this->password = $p;
        $this->database = $d;
    }

    /*
      used to build a connection
      ==========================
     */

    public function connect() {
        $connect = mysql_connect($this->host, $this->username, $this->password) or die("Couldn't connect to MySQL");
        mysql_select_db($this->database, $connect) or die("Couldn't select db");

        return $connect;
    }

    /*
     * used to close a connection
     * ==========================
     */

    public function closeConnection() {
        mysql_close();
    }
    
    /*
     * used to give a string output
     * ============================
     */

    public function __toString() {
        return "Host :" . $this->host .
                ", Username :" . $this->username .
                ", Password :" . $this->password .
                ", Database :" . $this->database;
    }

}

?>
