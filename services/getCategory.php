<?php

include 'config.php';

$sql = "select a.nama, b.kategori, a.id_alamat, b.icon from tb_alamat a, tb_kategori b " .
        "where a.id_kategori = b.id_kategori and a.id_kategori=:id";

try {
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $dbh->prepare($sql);
    //$stmt = $dbh->query($sql);
    $stmt->bindParam("id", $_GET[id]);
    $stmt->execute();
    $category = $stmt->fetchAll(PDO::FETCH_OBJ);
    $dbh = null;
    echo '{"items":' . json_encode($category) . '}';
} catch (PDOException $e) {
    echo '{"error":{"text":' . $e->getMessage() . '}}';
}
?>
