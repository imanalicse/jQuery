var enable_file_validation = true;
var fileUploadValidation = (function () {
    function maxFileSize() {
        // 1MB = 1048576 Bytes (1*1024*1024)
        let size = 20 * 1048576; // 20MB
        return size;
    }

    function formatSizeUnits(bytes) {
        if (bytes >= 1073741824)
        {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576)
        {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024)
        {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1)
        {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1)
        {
            bytes = bytes + ' byte';
        }
        else
        {
            bytes = '0 bytes';
        }

        return bytes;
    }

    function validateFileSize(file_size, max_size) {
         let response = [];
         response['is_success'] = true;
         response['message'] = 'File size is ok';
         file_size = Array.isArray(file_size) ? file_size['size'] : file_size;
         let allow_max_size = maxFileSize();
         if (file_size == 0) {
            response['is_success'] = false;
            response['message'] = 'File size 0 is not allowed';
         } else if (max_size && file_size > max_size) {
            var size_with_unit = formatSizeUnits(max_size);
            response['is_success'] = false;
            response['message'] = 'File size can not be more than '+ size_with_unit;
         } else if (file_size > allow_max_size) {
            var size_with_unit = formatSizeUnits(allow_max_size);
            response['is_success'] = false;
            response['message'] = 'File size can not be more than '+ size_with_unit;
         }
         return response;
    }

    function validateFile(file, allow_extensions, max_size) {
        let response = [];
        response['is_success'] = true;
        response['message'] = 'File is ok';
        var fileName = file.name;
        var validate_file_extension = validateFileExtension(fileName, allow_extensions);
        if (!validate_file_extension['is_success']) {
            return validate_file_extension;
        }
        let validate_file_size = validateFileSize(file.size, max_size);
        if (!validate_file_size['is_success']) {
            return validate_file_size;
        }
        return response;
    }

    function getExtension(fileName) {
        var extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        return extension;
    }

    function allowFileUploadExtensions() {
        return [
            'gif',
            'png',
            'jpg',
            'jpeg',
            'tiff',
            'tif',
            'pdf',
            'csv',
            'xls',
            'xlsx',
            'doc',
            'docx',
            'rtf',
            'ppt',
            'pptx',
            'mp3',
            'mp4',
            'mpeg',
            'mpg',
            'mpeg',
            'wma',
            'wav',
            'avi',
            'mov',
            'acc',
            'flac',
            'm4a',
            'ai',
            'psd',
        ];
    }

    function validateFileExtension(fileName, allow_extensions) {
        let response = [];
         response['is_success'] = true;
         response['message'] = 'File extension allowed';
        var extension = getExtension(fileName).toLowerCase();
        if (allow_extensions && allow_extensions.length && !allow_extensions.includes(extension)) {
            response['is_success'] = false;
            response['message'] = 'Wrong file format. Please upload the file in proper format ( ' + allow_extensions.join(', ') + ').';
        } else if (!allowFileUploadExtensions().includes(extension)) {
            response['is_success'] = false;
            response['message'] = 'File with extension .' + extension+ ' not allowed to upload';
        }
        return response;
    }

    return {
        validateFile: function (file, allow_extensions, max_size) {
            return validateFile(file, allow_extensions, max_size);
        }
    }
})();


document.addEventListener("DOMContentLoaded", function(event) {
    if (enable_file_validation) {
        $("input[type='file']:not(.no_validation)").off('change.fileValidation').on('change.fileValidation', function (e) {
            e.preventDefault();
            var file_input = $(this);
            var files = e.target.files;
            var allow_extensions = file_input.attr('allow_extensions') ? file_input.attr('allow_extensions').split("|") : undefined;
            var max_file_size = file_input.attr('max_file_size') ? file_input.attr('max_file_size') : undefined;
            for (var file of files) {
                var result = fileUploadValidation.validateFile(file, allow_extensions, max_file_size);
                if (!result['is_success']) {
                    file_input.val('');
                    customToast('error', result.message);
                    return false;
                }
            }
        });
    }
});
