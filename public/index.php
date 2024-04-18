<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, HEAD');
header('Access-Control-Allow-Headers: *');
$app = require __DIR__ . '/../bootstrap/app.php';
$app->run();
