<?php
require("dbinfo.php");

$id = $_POST["id"];
$groundMap = $_POST["groundMap"];
$heightMap = $_POST["heightMap"];
$objectMap = $_POST["objectMap"];

// -------------------------------------------

// -- connect to the DB
// -------------------------------------------
// -------------------------------------------
$insert = mysql_query("UPDATE map_data SET ground_map='".$groundMap."', height_map='".$heightMap."', object_map='".$objectMap."' WHERE id='".$id."';");

?>