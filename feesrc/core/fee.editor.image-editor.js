app.FrontEndEditor.prototype.imageEditor = function () {
    var _self = this;
    var highlightedElement;
    var currentElement;
    var popupEl;
    var popupInstance;
    var previewElement;
    var csdkImageEditor;
    var currentImage; // assigned when the Edit button is clicked

    var defaults = {
        popupClass: 'fee-image-popup confirm-popup',
        animationClass: 'animated zoomIn',
        closingAnimationClass: 'animated fadeOut',
        template: "<form class=\"edit-popup-form image-upload\" method=\"post\" action=\"/app/uploadWceditorImage\" enctype=\"multipart/form-data\">\n" +
        "       <div class=\"header-line\"><span class=\"title\">Upload Image</span><span class=\"icon close\"></span></div>" +
        "    <div class=\"body\">\n" +
        "        <div class=\"form-image-block\">\n" +
        "            <input type=\"file\" name=\"file\" file-type=\"image\" remove-option-name=\"remove-image\" size-limit=\"2097152\" previewer=\"upload-image-preview\" validation=\"drop-file-required\">\n" +
        "        </div>\n" +
        "            <div class=\"resp-message error\"></div>\n" +
        "            <div class=\"preview-image\">\n" +
        "                <div class=\"image-wrapper\">\n" +
        "                    <img id=\"upload-image-preview\" src=''>\n" +
        "                </div>\n" +
        "                <div class=\"image-description-wrapper\">\n" +
        "                    <p class=\"image-name\"></p>\n" +
        "                    <span class=\"image-size\"></span>\n" +
        "                </div>\n" +
        "                <div class=\"image-edit-button\">\n" +
        "        <button type=\"button\" class=\"edit-button fee-btn\">Edit</button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "    </div>\n" +
        "    <div class=\"button-line\">\n" +
        "        <button type=\"button\" class=\"cancel-button\">Cancel</button>\n" +
        "        <button type=\"submit\" class=\"submit-button edit-popup-form-submit\">Upload</button>\n" +
        "    </div>\n" +
        "</form>",
        csdkAPIKey: "ivi35oh8nmumnuhp"
    };

    var postInit = {
        initVars: function () {

            // AdobeCreativeSDK.init({
            //     /* 2) Add your Client ID (API Key) */
            //     clientID: '8244a42a5e2a4132832abb1c1504d651',
            //     API: ["Asset"],
            //     onError: function(error) {
            //         /* 3) Handle any global or config errors */
            //         if (error.type === AdobeCreativeSDK.ErrorTypes.AUTHENTICATION) {
            //             /*
            //                 Note: this error will occur when you try
            //                 to launch a component without checking if
            //                 the user has authorized your app.
            //
            //                 From here, you can trigger
            //                 AdobeCreativeSDK.loginWithRedirect().
            //             */
            //             console.log('You must be logged in to use the Creative SDK');
            //         } else if (error.type === AdobeCreativeSDK.ErrorTypes.GLOBAL_CONFIGURATION) {
            //             console.log('Please check your configuration');
            //         } else if (error.type === AdobeCreativeSDK.ErrorTypes.SERVER_ERROR) {
            //             console.log('Oops, something went wrong');
            //         }
            //     }
            // });

            // csdkImageEditor = AdobeCreativeSDK.UI.ImageEditor();

            csdkImageEditor = new Aviary.Feather({
                apiKey: defaults.csdkAPIKey,
                theme: 'minimum',
                    maxSize: 1000,
                    language: browser.lang,
                    tools: ["enhance", "effects", "crop", "resize", "orientation", "focus", "brightness", "contrast", "sharpness", "colorsplash", "drawing", "textwithfont", "whiten"],
                onSave: function (imageID, newURL) {
                    var widgetUUId = currentElement.parents('.widget').attr("id").substr(2);
                    var widgetId = currentElement.parents('.widget').attr("widget-id").substr(2);
                    var widgetType = currentElement.parents('.widget').attr("widget-type");
                    var formdata = new FormData();
                    formdata.append("targetImageUrl", currentImage.src);
                    formdata.append("sourceImageUrl", newURL);
                    formdata.append("type", "png");
                    formdata.append("widgetUUId", widgetUUId);
                    formdata.append("widgetType", widgetType);
                    formdata.append("widgetId", widgetId);
                    formdata.append("name", popupEl.find(".preview-image").find(".image-name").text());

                    bm.ajax({
                        contentType: false,
                        processData: false,
                        cache: false,
                        url: "app/modifyImage",
                        type: "post",
                        data: formdata,
                        success: function (response) {
                            currentElement.attr('src', response.url);

                            csdkImageEditor.close();
                            popupInstance.close();
                        },
                        error: function (errorObj) {
                            console.log(errorObj);
                        }
                    });
                },
                onError: function (errorObj) {
                    console.log(errorObj.code);
                    console.log(errorObj.message);
                    console.log(errorObj.args);
                }
            });
        },
        bind: function () {
            var popupConfig = {
                clazz: defaults.popupClass,
                animation_clazz: defaults.animationClass,
                closing_animation_clazz: defaults.closingAnimationClass,
                is_fixed: true,
                draggable: true,
                drag_handle: '*',
                drag_cancel: '.content',
                is_always_up: true,
                //width: '900px',
                show_title: false,
                show_close: false,
                maximizable: false,
                minimizable: false,
                content: defaults.template,
                events: {
                    content_loaded: function (contentEl) {
                        popupEl = contentEl.el;
                        previewElement = popupEl.find(".preview-image");
                        var imgSrc = currentElement.attr('src');

                        previewElement.find("img").attr('src', imgSrc);
                        previewElement.find(".image-name").text(_self.common.getFileName(imgSrc, true));

                        var obj = new XMLHttpRequest();
                        obj.open('HEAD', imgSrc, true);
                        obj.onreadystatechange = function(){
                            if ( obj.readyState == 4 ) {
                                if ( obj.status == 200 ) {
                                    //alert('Size in bytes: ' + obj.getResponseHeader('Content-Length'));
                                    var imageSize = obj.getResponseHeader('Content-Length');
                                    imageSize = (imageSize/1000) +" KB";
                                    previewElement.find(".image-size").text(imageSize);
                                }
                            }
                        };
                        obj.send(null);
                    }
                }
            };

            popupInstance = new POPUP(popupConfig);

            popupEl.find(".edit-button").on("click", function () {
                currentImage = previewElement.find("img")[0];

                // csdkImageEditor.open(currentImage.src, function (response) {
                //     console.log(response);
                //     previewElement.find("img")[0].src = response.data[0];
                //     csdkImageEditor.close();
                // });

                csdkImageEditor.launch({
                    image: currentImage.id,
                    url: currentImage.src
                });

            });

            popupEl.find(".cancel-button").on("click", function () {
                popupInstance.close();
            });

            popupEl.find("input[type='file']").on("change", function () {
                if (this.files && this.files[0]) {
                    var file = this.files[0];
                    var FR = new FileReader();
                    FR.onload = function () {
                        var imgSrc = FR.result;
                        previewElement.find("img").attr('src', imgSrc);
                        previewElement.find(".image-name").text(file.name);
                        var imageSize = ((file.size)/1024) +" KB";
                        previewElement.find(".image-size").text(imageSize);
                    };
                    FR.readAsDataURL(this.files[0]);
                }
            });

            var currentWidget = currentElement.closest(".widget");
            var widgetType = currentWidget.attr("widget-type");
            if(widgetType === 'storeLogo'){
                popupEl.find('form').attr("action", app.baseUrl + "frontEndEditor/editStoreLogo");
                popupEl.find("form input[type='file']").attr("size-limit", "51200");
            }

            popupEl.find(".resp-message").html("");
            popupEl.find('form').form({
                ajax: true,
                preSubmit: function (ajaxSettings) {
                    $.extend(ajaxSettings, {}, null, {
                        error: function (jqXHR, textStatus, errorThrown ) {
                            popupEl.find(".resp-message").html(errorThrown.message);
                        },
                        success: function (resp) {
                            popupEl.find(".resp-message").html("");
                            if(resp.url) {
                                currentElement.attr('src', resp.url);
                            }
                            popupInstance.close();
                        }
                    });
                }
            });
        }
    }
    return {
        init: function (_currentElement, _highlightedElement) {
            currentElement = _currentElement;
            highlightedElement = _highlightedElement;
            postInit.initVars();
            postInit.bind();
            return this;
        }
    };
};
