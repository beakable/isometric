<?php
/*
// -------------------------------------------
header('Content-type: text/xml');
// -------------------------------------------
// -- connect to the DB and select the correct map via GET
mysql_connect("localhost","*****","*******");
mysql_select_db("beakers_*******");
$id = $_GET['username'];
// -------------------------------------------
// -------------------------------------------
$getall = mysql_query("SELECT * FROM user_data WHERE username='$id'");
function check_dates($stored_date){
	date_default_timezone_set('GMT');

	$today = date( 'Y-m-d');
	$timestamp = strtotime($stored_date);
	$stored = date("Y-m-d", $timestamp);
		if($stored == $today){
			$dateposted = "Today";	
		}
		else {
			$dateposted = $stored;
		}
		return $dateposted;	
}

// -------------------------------------------
// -- Begin executing XML output --
$_xml = '<?xml version="1.0" encoding="utf-8"?>';
$_xml .= "<user_data>";
while ($get = mysql_fetch_array($getall)) {
	$date_check = check_dates($get['distance_walked_timestamp']);
	$_xml .= "<user id='".$get['id']."' name='".$get['username']."' walked_total='".$get['distance_walked_total']."' walked_today ='".$get['distance_walked_today']."' walked_target ='".$get['distance_target']."'  walked_timestamp='". $date_check ."' next_reward='". $get['next_reward'] ."'>";
			$_xml .="<ground_map>";
					$_xml .= $get['ground_map'];
			$_xml .="</ground_map>";	
			$_xml .="<ground_height>";
					$_xml .= $get['city_height'];
			$_xml .="</ground_height>";
			$_xml .="<object_map>";
					$_xml .= $get['city_structure'];
			$_xml .="</object_map>";			
	$_xml .= "</user>";
	}
		
$_xml .= "</user_data>";
// -------------------------------------------
// -- Spit out the XML 
print  $_xml;
// -------------------------------------------	
*/ ?>
<?php
// -------------------------------------------
header('Content-type: text/xml');
// -------------------------------------------
// -- connect to the DB and select the correct map via GET	
?>
<user_data>
	<ground_map>
	<row>6,6,2,2,2,2,2,2,1,2,2,2,2,2,1,2</row>
	<row>6,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2</row>
	<row>2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2</row>
	<row>1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2</row>
	<row>2,1,1,2,2,2,2,2,2,2,1,2,2,2,2,2</row>
	<row>2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2</row>
	<row>2,1,2,2,2,2,5,5,5,2,1,1,1,2,2,2</row>
	<row>1,2,2,2,2,2,5,5,5,1,2,2,2,2,2,1</row>
	<row>2,2,2,5,5,5,5,5,5,2,2,2,2,2,2,2</row>
	<row>2,2,2,1,5,5,5,5,1,2,2,2,2,2,1,2</row>
	<row>2,1,2,2,5,5,5,5,2,2,2,2,1,2,2,2</row>
	<row>2,1,1,1,5,5,5,5,2,1,2,2,2,2,2,2</row>
	<row>1,1,1,2,1,2,2,1,2,2,2,2,2,2,2,2</row>
	<row>2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2</row>
	<row>2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2</row>
	<row>1,2,6,1,1,2,2,1,2,1,2,2,2,1,2,2</row>
	</ground_map>
	<ground_height>
	<row>5,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	</ground_height>
	<object_map>
	<row>10,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>9,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	</object_map>
</user_data>