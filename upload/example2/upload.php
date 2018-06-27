<?php

$sourcePath = $_FILES['userImage']['tmp_name'];
$targetPath = "images/".$_FILES['userImage']['name'];

$response = array();
$uploaded = move_uploaded_file($sourcePath, $targetPath);
if($uploaded) {
    $response['status'] = "success";
    $response['url'] = $targetPath;
    $response['name'] = basename($targetPath);
    $response['type'] = $_FILES['userImage']['type'];
}else {
    $response['status'] = "error";
}
echo json_encode($response);
