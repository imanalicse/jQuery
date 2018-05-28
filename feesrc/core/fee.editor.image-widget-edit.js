app.FrontEndEditor.prototype.imageWidgetEdit = function () {
    var _self = this;
    var editorInstance = _self;
    var highlightedElement;
    var currentElement;
    var popupEl;
    var popupInstance;
    var previewElement;
    var csdkImageEditor;
    var currentImage;

    var currentWidget;
    var widgetType;
    var widgetId;
    var widgetUUID;

    var defaults = {
        popupClass: 'fee-image-popup widget-image-edit-popup',
        animationClass: 'animated zoomIn',
        closingAnimationClass: 'animated fadeOut',
        template: "",
        csdkAPIKey: "ivi35oh8nmumnuhp"
    };


    var postInit = {
        initVars: function () {
            currentWidget = currentElement.closest('.widget');
            widgetType = currentWidget.attr("widget-type");
            widgetId = currentWidget.attr("widget-id");
            widgetUUID = currentWidget.attr("id").substring(3);

            var cachedData = _self.cachedWidgetData[widgetUUID];

            if (!$(document).hasClass("loader")) {
                bm.mask($(".fee-pu-body"), '<div><span class="loader"></span></div>');
            }

            bm.ajax({
                url: app.baseUrl + 'frontEndEditor/' + widgetType + 'Config',
                data: {
                    uuid: widgetUUID,
                    type: widgetType,
                    widgetId: cachedData && cachedData.serialized.id ? cachedData.serialized.id : widgetId
                },
                dataType: "html",
                success: function (resp) {
                    if (resp) {


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
                            content: resp,
                            events: {
                                content_loaded: function (contentEl) {
                                    popupEl = contentEl.el;
                                    previewElement = popupEl.find(".preview-image");
                                    postInit.bind();
                                    var widgetContent = $(resp);
                                    var currentWidgetInstance = new app.FrontEndEditor.widget[widgetType](widgetContent, widgetType, widgetUUID, editorInstance);
                                    currentWidgetInstance.init();
                                    app.FrontEndEditor.utils.setAnimation(widgetContent, 'animated fadeIn');
                                    postInit.bindWidgetEvents(currentWidget, widgetType, widgetUUID, currentWidgetInstance);
                                }
                            }
                        };
                        popupInstance = new POPUP(popupConfig);
                    }
                },
                error: function (xhr, status, resp) {
                    bm.unmask($(".fee-pu-body"));
                    bm.notify(resp.message, resp.status);
                },
                complete: function (xhr, status, resp) {
                    bm.unmask($(".fee-pu-body"));
                }
            });
        },
        bindWidgetEvents: function (widgetPanel, widgetType, uuid, widgetInst) {
            var cachedData = editorInstance.cachedWidgetData[uuid];
            editorInstance.portlet.destroySortable();
            var configForm = popupEl.find(".config-form");
            configForm.form({
                ajax: true,
                disable_on_invalid: false,
                preSubmit: function (ajaxSettings) {
                    $.extend(ajaxSettings, {
                        success: function (resp) {
                            if (widgetInst.afterSave) {
                                widgetInst.afterSave(resp, widgetPanel);
                            } else {
                                if (resp.status = "success") {

                                    var parentElement = widgetPanel.parents('.fee-widget-chooser:first').length > 0 ? widgetPanel.parents('.fee-widget-chooser:first') : widgetPanel;
                                    var widgetElement = editorInstance.layout.widget.update(parentElement, resp.html, widgetType, uuid, typeof cachedData !== 'undefined');
                                    widgetElement.data('data-cache', resp['serialized']);
                                    if (cachedData && cachedData.serialized.id) {
                                        widgetElement.attr('modified-widget', true);
                                    }
                                    editorInstance.cachedWidgetData[uuid] = resp;

                                    var widgetData = JSON.parse(resp.serialized);
                                    editorInstance.cachedWidgetData[uuid]['serialized'] = widgetData;
                                    editorInstance.portlet.restoreSortable(true);
                                    editorInstance.events.save();
                                    popupEl.find('.fee-cancel').trigger("click");
                                    _self.pageBody.find('.fee-widget-selected-mask').remove();
                                }
                            }
                        }
                    });
                    var returnVal = widgetInst.beforeSave(ajaxSettings);
                    if (returnVal === false) {
                        return false
                    }
                    var beforeSubmit = function (data) {
                        var widgetElm = editorInstance.pageBody.find("#wi-" + uuid);
                        var widgetId = '';
                        if (widgetElm.length < 1) {
                            widgetElm = editorInstance.layout.widget.getEmptyDom(widgetType, uuid);
                            var boundary = widgetPanel.parents(".grid-block-boundary:first");
                            if (boundary.is(".bottom")) {
                                boundary.before(widgetElm)
                            } else {
                                boundary.after(widgetElm)
                            }
                        } else {
                            widgetId = widgetElm.attr('widget-id');
                        }
                        data.pushAll([
                            {
                                name: "widgetId",
                                value: widgetId ? widgetId : (cachedData ? cachedData.serialized.id : '')
                            },
                            {
                                name: "uuid",
                                value: uuid
                            },
                            {
                                name: "containerId",
                                value: editorInstance.pageId
                            },
                            {
                                name: "containerType",
                                value: "page"
                            },
                            {
                                name: "noLayout",
                                value: "true"
                            }
                        ]);
                    };
                    if (ajaxSettings.beforeSubmit) {
                        ajaxSettings.beforeSubmit.blend(beforeSubmit)
                    } else {
                        ajaxSettings.beforeSubmit = beforeSubmit;
                    }
                    return true
                }
            });

            popupEl.find('.fee-cancel').trigger("click");
        },
        bind: function () {

            /*popupEl.find(".edit-button").on("click", function () {
                currentImage = previewElement.find("img")[0];
                csdkImageEditor.launch({
                    image: currentImage.id,
                    url: currentImage.src
                });

            });*/

            previewElement.fadeIn();
            var imgSrc = previewElement.find("img").attr("src");
            previewElement.find(".image-name").text(_self.common.getFileName(imgSrc, true));

            popupEl.find(".fee-cancel").on("click", function () {
                if (popupInstance) {
                    popupInstance.close();
                }
            });

            popupEl.find("input[type='file']").on("change", function () {
                if (this.files && this.files[0]) {
                    var file = this.files[0];
                    var FR = new FileReader();
                    FR.onload = function () {
                        var imgSrc = FR.result;
                        previewElement.find("img").attr('src', imgSrc);
                        previewElement.find(".image-name").text(file.name);
                        var imageSize = ((file.size) / 1000) + " KB";
                        previewElement.find(".image-size").text(imageSize);
                    };
                    FR.readAsDataURL(this.files[0]);
                }
            });
        }
    }
    return {
        init: function (_currentElement, _highlightedElement) {
            currentElement = _currentElement;
            highlightedElement = _highlightedElement;
            postInit.initVars();
            //postInit.bind();
            return this;
        }
    };
};
