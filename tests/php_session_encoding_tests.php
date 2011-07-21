<?php
//This example shows that session_encode() and serialize() produce DIFFERENT encoded results
// This means that unserialize() cannot be used to decode encoded session


function open($save_path, $session_name)
{
  global $sess_save_path;

  $sess_save_path = $save_path;
  return(true);
}

function close()
{
  return(true);
}

function read($id)
{
  global $sess_save_path;

  $sess_file = "$sess_save_path/sess_$id";
  return (string) @file_get_contents($sess_file);
}

function write($id, $sess_data)
{
  global $sess_save_path;

echo "\nsession_encode:\n".$sess_data."\n\n";
echo "serialize(\$_SESSION):\n".serialize($_SESSION)."\n\n";

$v = unserialize($sess_data);
echo "unserialize(session_encoded): ".$v."\n\n";
echo "json_encode(serialized) ". json_encode(serialize($_SESSION)) . "\n\n";

  $sess_file = "$sess_save_path/sess_$id";
  if ($fp = @fopen($sess_file, "w")) {
    $return = fwrite($fp, $sess_data);
    fclose($fp);
    return $return;
  } else {
    return(false);
  }

}

function destroy($id)
{
  global $sess_save_path;

  $sess_file = "$sess_save_path/sess_$id";
  return(@unlink($sess_file));
}

function gc($maxlifetime)
{
  global $sess_save_path;

  foreach (glob("$sess_save_path/sess_*") as $filename) {
    if (filemtime($filename) + $maxlifetime < time()) {
      @unlink($filename);
    }
  }
  return true;
}

session_set_save_handler("open", "close", "read", "write", "destroy", "gc");

class ABC {
}

header('Content-type: text/plain');
session_start();
$_SESSION['stringEntry'] = 'abc';
$_SESSION['intEntry'] = 1238;
$_SESSION['objectEntry'] = new ABC();
$_SESSION['hashEntry'] = array("key1" => "value1", "key2" => "value2");
$_SESSION['arrayEntry'] = array("apple", "orange", "banana");

echo 'This example shows that session_encode() and serialize() produce DIFFERENT encoded results'."\n";
echo 'This means that unserialize() cannot be used to decode encoded session.'."\n\n\n";


echo 'Sample session:';
var_dump($_SESSION);