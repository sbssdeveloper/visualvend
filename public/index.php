<?php
/**
 * @OA\Info(
 *     title="My Lumen API",
 *     version="1.0.0",
 *     description="API documentation for My Lumen API",
 *     @OA\Contact(
 *         email="support@myapi.com"
 *     ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 */


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, HEAD');
header('Access-Control-Allow-Headers: *');

$app = require __DIR__ . '/../bootstrap/app.php';
$app->run();
