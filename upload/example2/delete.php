<?php
if( isset( $_POST ) ){
    global $wpdb;

    $file_url = $_POST['file_url'];
    $response = array();

    $filename = basename( $file_url );
    $upload_dir = 'images';
    // $upload_path = $upload_dir["path"];
    $uploaded_file = $upload_dir .'/'. $filename;
    if(file_exists($uploaded_file)){
        @unlink($uploaded_file);
        $response['response'] = "SUCCESS";
    }else {
        $response['response'] = "ERROR";
        $response['error'] = 'File does not exist';
        $response['path'] = $uploaded_file;
    }

    echo json_encode( $response );
}