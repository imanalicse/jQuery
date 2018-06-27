<?php

$sourcePath = $_FILES['userImage']['tmp_name'];

$upload_dir = 'images';
if (! is_dir($upload_dir)) {
    mkdir( $upload_dir, 0700 );
}

$targetPath = $upload_dir . "/".$_FILES['userImage']['name'];

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
