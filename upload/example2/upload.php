<?php

$upload_dir = 'images';
if (! is_dir($upload_dir)) {
    mkdir( $upload_dir, 0700 );
}

$response = array();
if(is_array($_FILES)) {
    foreach ($_FILES as $key => $value){
        $sourcePath = $value['tmp_name'];
        $targetPath = $upload_dir . "/".$value['name'];
        $uploaded = move_uploaded_file($sourcePath, $targetPath);
        if($uploaded) {
            $response[$key]['status'] = "success";
            $response[$key]['url'] = $targetPath;
            $response[$key]['name'] = basename($targetPath);
            $response[$key]['type'] = $value['type'];
        }else {
            $response[$key]['status'] = "error";
            $response[$key]['name'] = basename($targetPath);
        }
    }
}
echo json_encode($response);