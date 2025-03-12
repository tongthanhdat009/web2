<?php
class DatabaseConfig {
    protected $host = 'localhost';
    protected $username = 'root';
    protected $password = '';
    protected $database = 'ql_cuahangdungcu';
    
    protected $conn;

    public function __construct()
    {
        $this->connect();
    }

    public function connect()
    {
        if (!$this->conn) {
            $this->conn = mysqli_connect($this->host, $this->username, $this->password, $this->database);
            mysqli_set_charset($this->conn, "utf8");
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function disConnect()
    {
        if ($this->conn) {
            mysqli_close($this->conn);
        }
    }
}
?>