<?php
// headers 
header('Access-Control-Allow-Origin: *');
header('content-type:application/json');

// data connection
$host = "localhost";
$user = "wfmpacyv_root";
$pass = "Root1234";
$_db_ = "wfmpacyv_bsale-store";

// query to data base
$query = "SELECT * FROM category;";

// get connection
$conn = mysqli_connect($host, $user, $pass, $_db_);
if(mysqli_connect_errno()){
    $conn = null;
}

// show data if connection is not null 
if($conn != null){
    $result = mysqli_query($conn, $query);
    if($result){
        $str_array = "";
        while($row = mysqli_fetch_assoc($result)){
            $item = "";
            $item .= "\"id\":".$row['id'].",";
            $item .= "\"name\":\"".utf8_encode($row['name'])."\"";
            $str_array .= "{".$item."},";
        }
        $str_array = rtrim($str_array, ",");
        echo("[".$str_array."]");
    }else{
        echo("[]");
    }
    mysqli_close($conn);
}
?>
