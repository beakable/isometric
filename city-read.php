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
			$_xml .="<steps_made>";
					$_xml .= $get['city_height'];
			$_xml .="</steps_made>";
			$_xml .="<steps_dates>";
					$_xml .= $get['city_structure'];
			$_xml .="</steps_dates>";			
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
	<row>3,2,0,0,0,3,3,2,1,0,2,3,0,3,1,3</row>
	<row>1,2,2,3,0,4,4,0,4,0,2,4,0,3,2,3</row>
	<row>0,3,3,1,1,2,4,2,3,1,1,3,4,3,2,0</row>
	<row>1,4,4,2,4,3,3,4,4,0,4,4,3,1,2,4</row>
	<row>4,1,1,0,4,0,3,2,2,4,1,2,3,4,2,4</row>
	<row>4,2,2,4,0,0,3,4,1,2,4,4,4,1,4,3</row>
	<row>3,1,4,2,2,2,5,5,5,2,1,1,1,4,0,0</row>
	<row>1,3,0,2,3,3,5,5,5,1,4,0,3,3,3,1</row>
	<row>0,3,4,5,5,5,5,5,5,4,4,3,3,0,4,0</row>
	<row>3,0,2,1,5,5,5,5,1,0,0,0,4,4,1,0</row>
	<row>2,1,2,3,5,5,5,5,4,0,2,3,1,2,3,4</row>
	<row>2,1,1,1,5,5,5,5,3,1,3,3,0,0,3,2</row>
	<row>1,1,1,3,1,2,2,1,3,0,4,4,3,3,4,0</row>
	<row>0,1,2,2,4,3,0,3,0,3,1,0,4,0,3,0</row>
	<row>2,4,4,3,2,1,4,0,1,4,0,4,2,0,0,3</row>
	<row>1,3,0,1,1,0,4,1,4,1,2,3,2,1,4,4</row>
	</ground_map>
	<steps_made>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,5,0,0,0,12,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	</steps_made>
	<steps_dates>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
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
	<row>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</row>
	</steps_dates>
</user_data>