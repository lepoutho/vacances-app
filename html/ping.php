<?php
/* Expense counter: one line per anonymous user, cumulative.
 *
 * The page calls this with a POST each time an expense is created, sending
 * uid=<random id generated once in the visitor's browser>. No IP address is
 * read or stored here, and the id is not linked to a name, an email or the
 * trip's data. Only the id (validated to a strict format) and a number are
 * ever written to the file, so there is nothing to inject into it.
 *
 * The log lives one level above the site's public folder, so it can't be
 * downloaded by typing its URL. Read it with cPanel's File Manager.
 *
 * Columns (tab-separated): uid, number of expenses created.
 */

const MAX_LINES = 20000; // stops the file growing without limit

if($_SERVER['REQUEST_METHOD'] !== 'POST'){ http_response_code(405); exit; }

$uid = isset($_POST['uid']) ? $_POST['uid'] : '';
if(!is_string($uid) || !preg_match('/^[A-Za-z0-9-]{8,64}$/', $uid)){ http_response_code(400); exit; }

$dir = dirname($_SERVER['DOCUMENT_ROOT']) . '/vacances-logs';
if(!is_dir($dir) && !mkdir($dir, 0700, true)){ http_response_code(500); exit; }
$file = $dir . '/depenses-par-utilisateur.tsv';

$handle = fopen($file, 'c+');
if(!$handle){ http_response_code(500); exit; }
flock($handle, LOCK_EX);

$counts = array();
while(($line = fgets($handle)) !== false){
  $cols = explode("\t", rtrim($line, "\r\n"));
  if(count($cols) === 2 && $cols[0] !== 'uid') $counts[$cols[0]] = (int)$cols[1];
}

if(isset($counts[$uid])){
  $counts[$uid]++;
}else if(count($counts) < MAX_LINES){
  $counts[$uid] = 1;
}

ftruncate($handle, 0);
rewind($handle);
fwrite($handle, "uid\tdepenses_creees\n");
foreach($counts as $id => $n) fwrite($handle, $id . "\t" . $n . "\n");
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

http_response_code(204);
