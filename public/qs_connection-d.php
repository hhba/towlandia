<?php
$host = "host";
$db = "diputados";
$user = "user";
$passwd = "password";
$link = @mysql_connect($host,$user,$passwd);
if(!$link) {
	print "Could not connect to the MySQL Host<br><br>Message(s):<br>" . mysql_error()  . "<br>";
	exit ;
}

if(!@mysql_select_db($db)) {
	print "Could not connect to the MySQL Database<br><br>Message(s):<br>" . mysql_error()  . "<br>";
	exit ;
}
?>