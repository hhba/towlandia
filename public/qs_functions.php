<?php
function QSConvert2EngNumber($sNumber) {
   return $sNumber;
   /* 
   if (!is_numeric($sNumber)) {                     //* 'is_numeric' does not depend on the locale             
	  $sNumber = (string)$sNumber; 
	  $StrTemp = (string)3/2;
	  $DecimalChar =  substr($StrTemp, 1, 1);    	//Get decimal char by current locale  	 
	  for ($i = 0; $i <= strlen($sNumber); $i++) {  
		$NumChar = substr($sNumber, $i, 1);
		if ((!is_numeric($NumChar)) && ($NumChar != $DecimalChar)) {
		   $sNumber = str_replace($NumChar, "", $sNumber);
		}
	  }		
	  $sNumber = str_replace($DecimalChar, ".", $sNumber); 
	  return $sNumber; 
   } else {
	  return $sNumber;
   }  */    
}

function qsconvertdate2basedate($strdate)
{
   if ($strdate == "") { return ""; }
   $strdate = str_replace("-", "/", $strdate);
   return date("Y-m-d H:i:s", strtotime($strdate));
}

function qsconvertdate2ansi ($strdate,$formatdate,$param)
{
    if (trim($strdate) == "") { return ""; }
	  $basedate = strtotime($strdate);
	  $stddate = "yyyy-mm-dd hh:nn:ss";
	  $strdate = $strdate . " ";
	  $formatdate = $formatdate . " ";
	  $today = getdate();
	  $y = "";
  	$m = "";
	  $d = "";
	  if (substr_count(strtolower($formatdate),"h") > 0 ) {
		    $h = date("H", $basedate);
	  }else{
		    $h = "00";
	  }
	  if (substr_count(strtolower($formatdate),"n") > 0 ) {
		    $min = date("i", $basedate);
	  }else{
		    $min = "00";
	  }
	  if (substr_count(strtolower($formatdate),"s") > 0 ) {
		    $s = date("s", $basedate);
	  }else {
		    $s = "00";
	  }
	  $array_month[0][0] = "Jan";
	  $array_month[0][1] = "January";
	  $array_month[1][0] = "Feb";
	  $array_month[1][1] = "February";
	  $array_month[2][0] = "Mar";
	  $array_month[2][1] = "March";
	  $array_month[3][0] = "Apr";
	  $array_month[3][1] = "April";
	  $array_month[4][0] = "May";
	  $array_month[4][1] = "May";
	  $array_month[5][0] = "Jun";
	  $array_month[5][1] = "June";
	  $array_month[6][0] = "Jul";
	  $array_month[6][1] = "July";
	  $array_month[7][0] = "Aug";
	  $array_month[7][1] = "August";
	  $array_month[8][0] = "Sep";
	  $array_month[8][1] = "September";
	  $array_month[9][0] = "Oct";
	  $array_month[9][1] = "October";
	  $array_month[10][0] = "Nov";
	  $array_month[10][1] = "November";
	  $array_month[11][0] = "Dec";
	  $array_month[11][1] = "December";
	  $temp = split(" ",trim($formatdate));
	  $temp2 = split(" ",trim($strdate));
	  for($i=0;$i<count($temp);$i++) {
	  	  if(substr_count($temp[$i],$param) > 0 ){
	  		     $formatdate = $temp[$i];
	  		     $strdate = $temp2[$i];
	  	  }
	  }
	  $array_format = split($param, $formatdate);
	  $array_date =split($param, $strdate);
	  for ($i =0 ; $i < count($array_format); $i++){
	  	  $iformat = strtolower(trim($array_format[$i]));
	  	  $idata = strtolower(trim($array_date[$i]));
	  	  if (substr_count($iformat,"yyyy") > 0){
	  		    $y = $idata ;
	  	  }elseif (substr_count($iformat,"yy") > 0){
	  		    $y =  substr($today["year"],0,2) . $idata;
	  	  }elseif (substr_count($iformat,"mmmm") > 0) {
	  		    for($j=0 ;$j < 11 ;$j++) {
	  			      if ($idata == strtolower(trim($array_month[$j][1]))) {
	  				        $m = $j+1;
	  			      }
	  		    }
	  	  }elseif (substr_count($iformat,"mmm") > 0 ) {
	  		    for($j=0 ; $j < 11; $j++) {
	  			      if ($idata == strtolower(trim($array_month[$j][0]))) {
	  				        $m = $j+1;
	  			      }
	  		    }
	  	  }elseif (substr_count($iformat,"m") > 0 ) {
	  		    $m = $idata;
	  	  }elseif (substr_count($iformat,"d") > 0 ) {
	  		    $d = $idata;
	  	  }
	  }
	  if ($y == "" ){
	  	  $y = $today["year"];
	  }
	  if ($m == "" ){
	  	  $m = $today["mon"];
	  }
	  if ((int)($m)<10){
	  	  $m = "0" . (int)($m);
	  }
	  if ($d == "" ){
	  	  $d = $today["mday"];
	  }
	  if ((int)($d)<10) {
	  	  $d = "0" . (int)($d);
	  }
	  $newformatdate = $stddate;
	  $newformatdate=ereg_replace("yyyy","$y" ,$newformatdate);
	  $newformatdate=ereg_replace("mm","$m" ,$newformatdate);
	  $newformatdate=ereg_replace("dd","$d" ,$newformatdate);
	  $newformatdate=ereg_replace("hh","$h" ,$newformatdate);
	  $newformatdate=ereg_replace("nn","$min" ,$newformatdate);
	  $newformatdate=ereg_replace("ss","$s" ,$newformatdate);
	  return  $newformatdate;
}

function replaceSymbol($str){
	$newStr =eregi_replace(":","",$str);
	$newStr =eregi_replace("-","",$newStr);
	$newStr =eregi_replace("/","",$newStr);
	$newStr =eregi_replace(",","",$newStr);
	return $newStr;
}
function TimeStamp_to_string($dt){
	$dt = replaceSymbol((string)($dt)) ;
	$yr=strval(substr($dt,0,4));
    $mo=strval(substr($dt,4,2));
    $da=strval(substr($dt,6,2));
    $hr=strval(substr($dt,8,2));
    $mi=strval(substr($dt,10,2));
    $se=strval(substr($dt,12,2));
	$strTimeStamp = $mo."/".$da."/".$yr;
	return $strTimeStamp;
}
function qsconvertdate($sdate,$formatdate) {
	  if ($sdate == "") {return "";}
	  $basedate = @strtotime($sdate);
    if($basedate==-1) 
    { 
    $newformatdate = TimeStamp_to_string($sdate);
    }
    else
    {
	  $shour = (int)(@date("H", $basedate));
	  $sminute = (int)(@date("i", $basedate));
	  $ssec = (int)(@date("s", $basedate));
	  //-------   get hour -------
	  if ((substr_count($formatdate,"h") > 0 )&&(substr_count($formatdate,"t"))){
	  	  $shour = (int)(date("H", $basedate));
	  	  		  if($shour==12){
	  	  		      $h = $shour;
	  	  		      $hh = $h;
	  	  		      $t = "PM";
	  	  		  }else if($shour==00){
	  	  		      $h =  00;
	  	  		      $hh = $h;
	  	  		      $t = "AM";
	  	  		  }else if($shour>12){
	  	  		      $h = $shour - 12;
	  	  		      $hh = $h;
	  	  		      $t = "PM";
	  	  		  }else{
	  	  		      $h = $shour;
	  	  		      $hh = $h;
	  	  		      $t = "AM";
	  	  		  }
	  }elseif (substr_count($formatdate,"H") > 0 ){
	  		$h = $shour;
	  		$hh = $h;
	  		$t = "";
	  }else{
	  	  $h = "";
	  	  $hh = "";
	  	  $t = "";
	  }
	  if ($hh < 10 ){
	  	  $hh = "0" . $hh;
	  }
	  //-------   get    minute -------
	  if (substr_count($formatdate,"n") > 0){
	  	  $n = $sminute;
	  	  $nn = $n;
	  }else{
	  	  $n = "";
	  	  $nn = "";
	  }
	  if($nn < 10 ) {
	  	  $nn = "0" . $nn;
	  }
	  //-------   get    second -------
	  if (substr_count($formatdate,"s") > 0 ) {
	  	  $s = $ssec;
	     	$ss = $s;
	  }else{
	  	  $s = "";
	  	  $ss = "";
	  }
	  if($ss < 10 ) {
	  	  $ss = "0" . $ss;
	  }
	  $temp = split(" ",$sdate);
	  for($i=0;$i<count($temp);$i++) {
	  	  if(substr_count($temp[$i],"-") > 0 ){
	  		    $sdate = $temp[$i];
	  	  }
	  }
	  $temp = split('[- ]', $sdate);
	  $month = $temp[1];
	  $day = $temp[2];
    $year = $temp[0];
	  if (($year == "0000") || ($month == "00") || ($day == "00")) {return "";}
    $strdate = $year . "/" . $month . "/" . $day;
	  $array_date = split("/" , $strdate);
	  //-------   get    year -------
	  $yyyy = $array_date[0];
	  $yy = substr($array_date[0],2,2);
	  //-------   get    month -------
	  $array_month[0][0] = "Jan";
	  $array_month[0][1] = "January";
	  $array_month[1][0] = "Feb";
	  $array_month[1][1] = "February";
	  $array_month[2][0] = "Mar";
	  $array_month[2][1] = "March";
	  $array_month[3][0] = "Apr";
	  $array_month[3][1] = "April";
	  $array_month[4][0] = "May";
	  $array_month[4][1] = "May";
	  $array_month[5][0] = "Jun";
	  $array_month[5][1] = "June";
	  $array_month[6][0] = "Jul";
	  $array_month[6][1] = "July";
	  $array_month[7][0] = "Aug";
	  $array_month[7][1] = "August";
	  $array_month[8][0] = "Sep";
	  $array_month[8][1] = "September";
	  $array_month[9][0] = "Oct";
	  $array_month[9][1] = "October";
	  $array_month[10][0] = "Nov";
	  $array_month[10][1] = "November";
	  $array_month[11][0] = "Dec";
	  $array_month[11][1] = "December";
	  $mmmm = $array_month[(int)($array_date[1] )-1][1];
	  $mmm = $array_month[(int)($array_date[1] )-1][0];
	  $mm =  $array_date[1];
	  $m =  (int)($array_date[1]);
	  //-------   get    day -------
	  $dd =  $array_date[2];
	  $d =  (int)($array_date[2]);
	  $formatdate = strtolower($formatdate);
	  $newformatdate = $formatdate;
	  //--------  convert year ----------
	  if (substr_count($newformatdate ,"yyyy")  > 0) {
	  	  $newformatdate = ereg_replace ("yyyy" ,"$yyyy" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "yyy")  > 0) {
	  	  $newformatdate = ereg_replace ("yyy" ,"$yyyy" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "yy")  > 0)  {
	  	  $newformatdate = ereg_replace ("yy" ,"$yy" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "y")  > 0) {
	  	  $newformatdate = ereg_replace ("y" ,"$yy" ,$newformatdate);
	  }
	  //--------  convert  month ----------
	  if (substr_count($newformatdate ,"mmmm")  > 0) {
	  	  $newformatdate = ereg_replace ("mmmm" ,"$mmmm" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "mmm")  > 0) {
	  	  $newformatdate = ereg_replace ("mmm" ,"$mmm" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "mm")  > 0) {
	  	  $newformatdate = ereg_replace ("mm" ,"$mm" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "m")  > 0) {
	  	  $newformatdate = eregi_replace ("m" ,"$m" ,$newformatdate);
	  }
	  // -------- convert day ------------
	  if (substr_count($newformatdate, "dd")  > 0) {
	  	  $newformatdate = ereg_replace ("dd" ,"$dd" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "d")  > 0  ) {
	  		$newformatdate = ereg_replace ("d" ,"$d" ,$newformatdate);
	  }
	  // -------- convert hour ------------
	  if (substr_count($newformatdate, "hh")  > 0) {
	  	  $newformatdate = ereg_replace ("hh" ,"$hh" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "h")  > 0  ) {
	  		$newformatdate = ereg_replace ("h" ,"$h" ,$newformatdate);
	  }
	  // -------- convert minute ------------
	  if (substr_count($newformatdate, "nn")  > 0  ) {
	  	  $newformatdate = ereg_replace ("nn" ,"$nn" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "n")  > 0  ) {
	  		$newformatdate = ereg_replace ("n" ,"$n" ,$newformatdate);
	  }
	  // -------- convert second ------------
	  if (substr_count($newformatdate, "ss")  > 0  ) {
	  	  $newformatdate = ereg_replace ("ss" ,"$ss" ,$newformatdate);
	  }elseif (substr_count($newformatdate, "s")  > 0  ) {
	  		$newformatdate = ereg_replace ("s" ,"$s" ,$newformatdate);
	  }
	  if (substr_count($newformatdate, "t")  > 0  ) {
	  	  $newformatdate = ereg_replace ("t" ,"$t" ,$newformatdate);
	  }
     }
	  return $newformatdate ;
}

function qs_string_to_timestamp($str)
{
    $l=strlen($str);
    switch ($l) {
        case  4:
            $tm=qs_year_to_timestamp($str);
	          break;
	      case  8:
            $tm=qs_time_to_timestamp($str);
	          break;
	      case 10:
            $tm=qs_date_to_timestamp($str);
            break;
	      case 14:
            $tm=qs_timestamp_to_timestamp($str);
	          break;
	      case 19:
            $tm=qs_datetime_to_timestamp($str);
            break;
	      case 23:
            $tm=qs_datetime_to_timestamp($str);
            break;
        default:
            $tm=mktime(24,0,0,1,1,1970);
    }
    return $tm;
}

function qs_timestamp_to_timestamp($dt)
{
    $yr=strval(substr($dt,0,4));
    $mo=strval(substr($dt,4,2));
    $da=strval(substr($dt,6,2));
    $hr=strval(substr($dt,8,2));
    $mi=strval(substr($dt,10,2));
    $se=strval(substr($dt,12,2));
    return mktime($hr,$mi,$se,$mo,$da,$yr);
}

function qs_datetime_to_timestamp($dt)
{
    $yr=strval(substr($dt,0,4));
    $mo=strval(substr($dt,5,2));
    $da=strval(substr($dt,8,2));
    $hr=strval(substr($dt,11,2));
    $mi=strval(substr($dt,14,2));
    $se=strval(substr($dt,17,2));
    return @mktime($hr,$mi,$se,$mo,$da,$yr);
}

function qs_date_to_timestamp($dt)
{
    $yr=strval(substr($dt,0,4));
    $mo=strval(substr($dt,5,2));
    $da=strval(substr($dt,8,2));
    $hr=0;
    $mi=0;
    $se=0;
    return mktime($hr,$mi,$se,$mo,$da,$yr);
}

function qs_time_to_timestamp($dt)
{
    $yr=1970;
    $mo=1;
    $da=1;
    $hr=strval(substr($dt,0,2));
    $mi=strval(substr($dt,3,2));
    $se=strval(substr($dt,6,2));
    return mktime($hr,$mi,$se,$mo,$da,$yr);
}

function qs_year_to_timestamp($dt)
{
    $yr=strval(substr($dt,0,4));
    $mo=1;
    $da=1;
    $hr=0;
    $mi=0;
    $se=0;
    return mktime($hr,$mi,$se,$mo,$da,$yr);
}

function qs_datetime_to_string ($dt)
{
    if (@date("H:i:s",$dt) == "00:00:00"){
        $str = date("n/j/Y",$dt);
    }else{
        $str = @date("n/j/Y g:i:s",$dt);
    }
    return $str;
}

function qsvalid_timestamp($dt)
{
    if (strlen($dt) == 14) {
        $retval = is_numeric($dt);
    }else{
        $retval = false;
    }
    return $retval;
}

function qsvalidrequest ($paramval)
{
    return (((isset($_GET[$paramval])) || (isset($_POST[$paramval]))) && (qsrequest($paramval)!=""));
}

function qsrequest ($paramval)
{
    if (isset($_GET[$paramval])) {
        $retval = $_GET[$paramval];
    }elseif (isset($_POST[$paramval])) {
        $retval = $_POST[$paramval];
    }else{
      $retval = "";
    }
    return $retval;
}

function qsservervars($paramval)
{
    if (isset($_SERVER[$paramval])) {
        $retval = $_SERVER[$paramval];
    }else{
        $retval = "";
    }
    return $retval;
}

function qssession($paramval)
{
    if (isset($_SESSION[$paramval])) {
        $retval = $_SESSION[$paramval];
    } else {
        $retval = "";
    }
    return $retval;
}

function arrayvalue($paramval,$search_array)
{
    if (array_key_exists($paramval,$search_array)) {
        $retval = $search_array[$paramval];
    } else {
        $retval = "";
    }
    return $retval;
}

function qsodbc_fetch_array($res,$row_num)
{
    $row = array();
    $result = array();
    if ($row_num > 0) {
        $result = odbc_fetch_row($res,$row_num);
    } else {
        $result = odbc_fetch_row($res);
    }
    if ($result) {
        $nf = odbc_num_fields($res);
        for($i=0; $i < $nf; $i++) {
            $field_value = odbc_result($res, $i + 1);
            $row[$i] = $field_value;
        }
    }
    return $row;
}

function qsodbc_num_rows($res)
{
    $rowcount = odbc_num_rows($res);
    if ($rowcount < 0) {
        $rowcount = 0;
        while($temp = odbc_fetch_into($res,&$idata)){
            $rowcount++;
        }
    }
    return $rowcount;
}

$_SESSION['xTax'] = 10;

function qscheckselected($paramval, $itemval, $defaultval)
{
    if (trim(strtoupper($paramval)) == trim(strtoupper($itemval))) {
        $retval = $defaultval;
    }elseif ((strtoupper($paramval)=="0") && (trim(strtoupper($itemval))=="FALSE") ) {
        $retval = $defaultval;
    }elseif ((strtoupper($paramval)=="1") && (trim(strtoupper($itemval))=="TRUE") ) {
        $retval = $defaultval;
    }else{
        $retval = "";
    }
    return $retval;
}

function qsmysqlgen_radio_button($sql,$objname,$field1,$field2,$itemval)
{
    $result  = mysql_query($sql) or die("Invalid query");
    $cellstr = "";
    while ($row = mysql_fetch_array($result, MYSQL_BOTH)) {
        $cellstr .= "<input type=\"radio\" name=\"";
	      $cellstr .= $objname . "\" value=\"" . $row[$field1] . "\"";
          $cellstr .= qscheckselected($row[$field1],$itemval,"checked = \"checked\"") . ">";
        $cellstr .= $row[$field2] . "<br>";
    }
    mysql_free_result($result);
    return $cellstr;
}

function qsmysqlgen_listbox($sql,$objname,$field1,$field2,$itemval)
{
    $result  = mysql_query($sql) or die("Invalid query");
    $cellstr = "";
    while ($row = mysql_fetch_array($result, MYSQL_BOTH)) {
  	    $cellstr .= "<option value=\"" . $row[$field1] . "\"";
	      $cellstr .= qscheckselected($row[$field1],$itemval,"Selected") . ">";
        $cellstr .= $row[$field2] . "</option>";
    }
    mysql_free_result($result);
    return $cellstr;
}

function qsmysqlgen_listbox2($sql,$objname,$field1,$field2,$itemval, $format)
{
    $result  = mysql_query($sql) or die("Invalid query");
    $cellstr = "";
    while ($row = mysql_fetch_array($result, MYSQL_BOTH)) {
  	    $cellstr .= "<option value=\"" . qsconvertdate($row[$field1], "yyyy/mm/dd") . "\"";
	      $cellstr .= qscheckselected(qsconvertdate($row[$field1], "yyyy/mm/dd"),$itemval,"Selected") . ">";
        $cellstr .= qsconvertdate($row[$field2], $format) . "</option>";
    }
    mysql_free_result($result);
    return $cellstr;
}

function qsodbcgen_radio_button($conn,$sql,$objname,$field1,$field2,$itemval)
{
    $result = odbc_exec($conn,$sql) or die("Invalid query");
    $cellstr = "";
    while (odbc_fetch_row($result)) {
        $cellstr .= "<input type=\"radio\" name=\"";
	      $cellstr .= $objname . "\" value=\"" . odbc_result($result,$field1) . "\"";
	      $cellstr .= qscheckselected(odbc_result($result,$field1),$itemval,"checked = \"checked\"") . ">";
        $cellstr .= odbc_result($result,$field2) . "<br>";
    }
    odbc_free_result($result);
    return $cellstr;
}

function qsodbcgen_listbox($conn,$sql,$field1,$field2,$itemval)
{
    $result  = odbc_exec($conn,$sql) or die("Invalid query");
    $cellstr = "";
    while (odbc_fetch_row($result)) {
  	    $cellstr .= "<option value=\"" . odbc_result($result,$field1) . "\"";
	      $cellstr .= qscheckselected(odbc_result($result,$field1),$itemval,"Selected") . ">";
        $cellstr .= odbc_result($result,$field2) . "</option>";
    }
    odbc_free_result($result);
    return $cellstr;
}

function qsodbcgen_listbox2($conn,$sql,$field1,$field2,$itemval,$format)
{
    $result  = odbc_exec($conn,$sql) or die("Invalid query");
    $cellstr = "";
    while (odbc_fetch_row($result)) {
  	    $cellstr .= "<option value=\"" . qsconvertdate(odbc_result($result,$field1), "yyyy/mm/dd") . "\"";
	      $cellstr .= qscheckselected(qsconvertdate(odbc_result($result,$field1), "yyyy/mm/dd"),$itemval,"Selected") . ">";
        $cellstr .= qsconvertdate(odbc_result($result,$field2), $format) . "</option>";
    }
    odbc_free_result($result);
    return $cellstr;
}

function qsreplace_html_quote($itemval)
{
    $retval = htmlspecialchars($itemval, ENT_QUOTES);
    return $retval;
}


function qsreplace_quote($itemval)
{
    $retval = addslashes($itemval);
    return $retval;
}

function qsreplace_backslashes($itemval)
{
    $retval = str_replace("\\","\\\\",$itemval);
    return $retval;
}

function qsreplacecomma($itemval)
{
    $retval = str_replace(",","",$itemval);
    return $retval;
}

function qsdestroysession()
{
    $_SESSION = array();
    session_destroy();
}

function qscheckselectedstatic ( $itemval,$paramval)
{
	  if ((isset($paramval)) && ($itemval == $paramval)) {
		    $select = "SELECTED";
	  } else {
		    $select;
	  }
	  return $select;
}

function qschecktypevalue($itemvalue, $datatype, $quotedate)
{
    $itemvalue =eregi_replace("'","''",$itemvalue);
    if ($datatype == 0) {
        return "'" . $itemvalue . "'";
    }
    elseif ($datatype == 1) {
        return qsreplacecomma($itemvalue);
    }
    elseif ($datatype == 2) {
        return $quotedate . $itemvalue . $quotedate;
    }
    else{
        return "'" . $itemvalue . "'";
    }
    if ($itemvalue == "") {return "null";}
}

function qssortasc($value1, $value2, $value3, $value4){
    if ($value1 == $value2) {
        if ($value3 != "") {
            if (strtoupper($value3) == "ASC") {
                $nextsortasc  = "<img src=\"images/sort_asc2.gif\" title=\"".$value4."\" border=\"0\">";
            }else{
                $nextsortasc  = "<img src=\"images/sort_asc1.gif\" title=\"".$value4."\" border=\"0\">";
            }
        }else{
  		      $nextsortasc  = "<img src=\"images/sort_asc1.gif\" title=\"".$value4."\" border=\"0\">";
  		  }
    }else{
  	    $nextsortasc  = "<img src=\"images/sort_asc1.gif\" title=\"".$value4."\" border=\"0\">";
    }
    return $nextsortasc;
}

function qssortdesc($value1, $value2, $value3, $value4){
    if ($value1 == $value2) {
        if ($value3 != "") {
            if (strtoupper($value3) == "ASC") {
                $nextsortdesc = "<img src=\"images/sort_desc1.gif\" title=\"".$value4."\" border=\"0\">";
            }else{
                $nextsortdesc = "<img src=\"images/sort_desc2.gif\" title=\"".$value4."\" border=\"0\">";
            }
        }else{
  			    $nextsortdesc = "<img src=\"images/sort_desc1.gif\" title=\"".$value4."\" border=\"0\">";
  	    }
    }else{
  	    $nextsortdesc = "<img src=\"images/sort_desc1.gif\" title=\"".$value4."\" border=\"0\">";
    }
    return $nextsortdesc;
}

function returntype($field_type){
    if ((strtolower($field_type) == "datetime")
       ||(strtolower($field_type) == "smalldatetime")
       ||(strtolower($field_type) == "date")
       ||(strtolower($field_type) == "time")
       ||(strtolower($field_type) == "year")
       ||(strtolower($field_type) == "timestamp")) {
           return "type_datetime";
    } elseif (((strtolower($field_type) == "integer")
            ||(strtolower($field_type) == "int")
            ||(strtolower($field_type) == "smallint")
            ||(strtolower($field_type) == "tinyint")
            ||(strtolower($field_type) == "longint")
            ||(strtolower($field_type) == "counter")
            ||(strtolower($field_type) == "autoincrement")
            ||(strtolower($field_type) == "float")
            ||(strtolower($field_type) == "real")
            ||(strtolower($field_type) == "money")
            ||(strtolower($field_type) == "smallmoney")
            ||(strtolower($field_type) == "short")
            ||(strtolower($field_type) == "long")
            ||(strtolower($field_type) == "double")
            ||(strtolower($field_type) == "currency")
            ||(strtolower($field_type) == "bit")
            ||(strtolower($field_type) == "decimal")
            ||(strtolower($field_type) == "number")
            ||(strtolower($field_type) == "numeric"))) {
            return "type_integer";
    } elseif ((strtolower($field_type) == "blob")
            ||(strtolower($field_type) == "mediumblob")
            ||(strtolower($field_type) == "longblob")
            ||(strtolower($field_type) == "varchar")
            ||(strtolower($field_type) == "char")
            ||(strtolower($field_type) == "text")
            ||(strtolower($field_type) == "tinytext")
            ||(strtolower($field_type) == "mediumtext")
            ||(strtolower($field_type) == "string")
            ||(strtolower($field_type) == "longtext")
            ||(strtolower($field_type) == "longchar")
            ||(strtolower($field_type) == "nvarchar")
            ||(strtolower($field_type) == "nchar")
            ||(strtolower($field_type) == "ntext")) {
            return "type_string";
    } else {
        return "type_unknown";
    }
}

function replacecharxml($svalue){
        if ($svalue != "") {$svalue = str_replace("\"", "&quot;", $svalue);}
        if ($svalue != "") {$svalue = str_replace("&", "&amp;", $svalue);}
        if ($svalue != "") {$svalue = str_replace("<", "&lt;", $svalue);}
        if ($svalue != "") {$svalue = str_replace(">", "&gt;", $svalue);}
        if ($svalue != "") {$svalue = str_replace("'", "&apos;", $svalue);}
        if ($svalue != "") {$svalue = str_replace("`", "&lsquo;", $svalue);}
    return $svalue;
}

function GetLastRecordID($RDBMSType, $ConnType, $Table, $Column, $Conn)
{
   switch($RDBMSType){
   	  case "FUTURE DB" : { $Sql = "SELECT MAX(" . $Column . ") AS MaxRecord FROM " . $Table;  } break;
                default: { $Sql = "SELECT MAX(" . $Column . ") AS MaxRecord FROM " . $Table;  } break;
   }		
   $MaxRecord = -1;					
   if ($ConnType == "ODBC") {
     $result  = odbc_exec($Conn, $Sql) or die("Invalid query");
     $MaxRecord = odbc_result($result, "MaxRecord");
   } else {
     $result  = mysql_query($Sql) or die("Invalid query");
	 $MaxRecord = mysql_result($result, 0 , "MaxRecord");
   }
   return $MaxRecord;
}

?>
