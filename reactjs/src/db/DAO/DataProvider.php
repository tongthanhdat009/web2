<?php
class DataProvider
{
	private $connection;
	public static function executeQuery($sql){
		include ('ketnoi.php');
		$connection = mysqli_connect($host,$user,$pass,$db);
		$result = mysqli_query($connection,$sql);
		if(str_contains($sql,"Insert")||str_contains($sql,"Delete")) {
			return $result;
		}
		//2. Thiet lap font Unicode
		if (!(mysqli_query($connection,"set names 'utf8'")))
			echo "Khong the set utf8";
		$stmt = $connection->prepare($sql);

		if ($stmt === false) {
			die('Prepare failed: ' . $connection->error);
		}
		try {
			$stmt->execute();
			$result = $stmt->get_result();
		}
		catch(Exception $e){
			echo $e->getMessage();
		}
		finally{
			$stmt->close();
		}
	
		return $result;
	}
	public function Close(){
		if ($this->connection !== null && !$this->connection->isClosed()) {
			mysqli_close($this->connection);
			$this->connection = null;
		}
    }
	/**
    * Select * From Table Where Condition Order by OderBy 
	* If null skip
    * @throws Exception 
    */
    public function Select($TableName, $Condition = null, $OrderBy = null){
        // khai báo biến StringBuilder để tạo chuỗi Select
        $query = "SELECT * FROM ".$TableName;
        // Đưa câu lệnh điều kiện vaò câu query
		if($Condition!="")
        $query=$query." WHERE ".$Condition;
        // Đưa câu lệnh Order vào query
		if($OrderBy!="")
		$query=$query."  ORDER BY  ".$OrderBy;
        // chèn ký tự ; vào cuối các câu lệnh
		$query=$query.";";
        echo "<script>console.log('".$query."')</script>";
        // thực thi câu lệnh query và trả kết quả
        return $this->executeQuery($query);
    }
	public function Insert($TableName, $ColumnValues)  {
        // Khai báo biến StringBuilder để tạo chuỗi Select
        $query = "Insert Into " . $TableName;
        // khai báo biến StringBuilder để tạo chuỗi Column Values
		$valueInsert="";
        $query.=" ( ";
        // Duyệt và đưa thông tin tên cột và giá tri values vào
        foreach ($ColumnValues as $key=>$value) {
            $query.=$key . ",";
            $valueInsert.="'" . $value . "',";
        }
        // cắt bỏ dấu , dư thừa
        $query= substr($query, 0, -1);

        $valueInsert=substr($valueInsert, 0, -1);
        // đưa giá trị của cột vào câu query
        $query.=") Values(" . $valueInsert . ")";
        // chèn ký tự ; vào cuối dòng lệnh để cách câu
        $query.=";";
        // Thực thi câu query và trả kết quả ra ngoài
        return $this->executeQuery($query);
    }
	public function Update($TableName, $ColumnValues, $Condition) {
		// Khai báo biến $query để tạo chuỗi SQL
		$query = "UPDATE $TableName SET ";
	
		// Duyệt và đưa thông tin tên cột và giá trị vào câu truy vấn
		foreach ($ColumnValues as $key => $value) {
			$value = $this->connection->real_escape_string($value);
			$query .= " $key = '$value', ";
		}
	
		// Loại bỏ ký tự ',' cuối câu truy vấn
		$query = rtrim($query, ', ');
	
		// Thêm điều kiện vào câu truy vấn (hàm AddCondition chưa được định nghĩa)
		if (!empty($Condition) && !$Condition=="") {
			$query .= " WHERE $Condition";
		}
	
		// Thêm ký tự ';' vào cuối câu truy vấn để phân tách các câu lệnh
		$query .= ";";
	
		echo "<script>console.log('".$query."')</script>";
		 // In ra câu truy vấn (tùy mục đích)
	
		// Thực hiện truy vấn và trả về kết quả
		return $this->executeQuery($query);
	}
	public function Delete($TableName, $Condition) {
        $query = "Delete From " . $TableName;
        // Đưa câu lệnh điều kiện vào query
        if (!empty($Condition) && !$Condition=="") {
			$query .= " WHERE $Condition ";
		}
        // chèn ký tự ; vào cuối dòng lệnh để ngăn cách các câu
        $query.=";";

        echo "<script>console.log('".$query."')</script>";
        //thực thi và trả về giá trị
        return $this->executeQuery($query);
    }
	public function getCountCol($TableName){
		$query="SELECT COUNT(*) FROM $TableName";
		return $this->connection->executeUpdate($query);
	}
}
?>