<?
// Sample business logic in PHP

session_start();
$_SESSION['products'] += 1;
$_SESSION['productName'] = 'my product';

//phpinfo();
?>
You now have <?= $_SESSION['products'] ?> in your cart :-)