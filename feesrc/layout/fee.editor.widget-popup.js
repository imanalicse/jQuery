app.FrontEndEditor.widgetPopup = (function (hostElement, editorInstance) {
    var _self = this;
    var actionPopupType;
    var selectMenuContainer;
    var widgetContentSection;
    var widgetHeaderSection;
    var currentWidgetInstance;
    var popupInstance;
    var popupElement;
    var csdkImageEditor;
    var currentImage; // assigned when the Edit button is clicked
    var imageWidget;

    var rowPanel = hostElement.closest('.fee-widget-row');

    var LAYOUT_TYPE = {
        SPACER: 'spacer',
        TWO_COLUMN: 'twoColumn',
        THREE_COLUMN: 'threeColumn'
    };

    var defaults = {
        popupClass: 'fee-widget-popup fee-popup',
        animationClass: 'animated zoomIn',
        closingAnimationClass: 'animated fadeOut',
        layoutSwitchOn: 'animated fadeIn',
        layoutSwitchOff: 'animated fadeOut',
        animationTimeout: 300,
        csdkAPIKey: "ivi35oh8nmumnuhp",
        template: "<div class=\"fee-pu-title-bar\">\n" +
        "        <span class=\"fee-pu-title\">" +
        "           <div class=\"fee-select-menu\">\n" +
        "                <span class=\"fee-sm-selected\" data-value=\"widget\">Add Widget</span>\n" +
        "                   <div class=\"fee-sm-container\" style=\"display:none\">\n" +
        "                      <span class=\"fee-sm-item\" data-value=\"widget\">Add Widget</span>\n" +
        "                      <span class=\"fee-sm-item\" data-value=\"layout\">Add Layout</span>\n" +
        "                   </div>\n" +
        "           </div>\n" +
        "        </span>\n" +
        "        <span class=\"fee-pu-close\"></span>\n" +
        "    </div>\n" +
        "    <div class=\"fee-pu-content fee-pu-widget-body\">\n" +
        "        <div class=\"fee-pu-widget-tab-section\">\n" +
        "            <div class=\"fee-pu-widget-tab fee-pu-widget-content\" data-widget-type=\"content\">\n" +
        "                <span class=\"fee-pu-icon\"></span>\n" +
        "                <span class=\"fee-pu-label\">Content</span>\n" +
        "            </div>\n" +
        "            <div class=\"fee-pu-widget-tab fee-pu-widget-image\" data-widget-type=\"image\">\n" +
        "                <span class=\"fee-pu-icon\"></span>\n" +
        "                <span class=\"fee-pu-label\">Image</span>\n" +
        "            </div>\n" +
/*        "            <div class=\"fee-pu-widget-tab fee-pu-widget-navigation\" data-widget-type=\"navigation\">\n" +
        "                <span class=\"fee-pu-icon\"></span>\n" +
        "                <span class=\"fee-pu-label\">Navigation</span>\n" +
        "            </div>\n" +*/
        "        </div>\n" +
        "        <div class=\"fee-pu-widget-content-section\">\n" +
        "            <div class=\"fee-pu-header\"></div>\n" +
        "            <div class=\"fee-pu-body\"></div>\n" +
        "        </div>\n" +
        "   </div>" +
        "   <div class=\"fee-pu-content fee-pu-layout-body\" style=\"display:none\">\n" +
        "        <div class=\"fee-pu-layout-container\">\n" +
        "            <div class=\"fee-pu-layout\" data-type=\"twoColumn\">\n" +
        "                <span class=\"fee-pu-lo-icon\"><img src=\"" + app.baseUrl + "resources/front-end-editor/2-column.png\" alt=\"\"></span>\n" +
        "                <span class=\"fee-pu-lo-label\">2 Column section</span>\n" +
        "            </div>\n" +
        "            <div class=\"fee-pu-layout\" data-type=\"threeColumn\">\n" +
        "                <span class=\"fee-pu-lo-icon\"><img src=\"" + app.baseUrl + "resources/front-end-editor/3-column.png\" alt=\"\"></span>\n" +
        "                <span class=\"fee-pu-lo-label\">3 Column section</span>\n" +
        "            </div>\n" +
        "            <div class=\"fee-pu-layout\" data-type=\"spacer\">\n" +
        "                <span class=\"fee-pu-lo-icon\"><img src=\"" + app.baseUrl + "resources/front-end-editor/spacer.png\" alt=\"\"></span>\n" +
        "                <span class=\"fee-pu-lo-label\">Spacer</span>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>"
    };

    var popupConfig = {
        clazz: defaults.popupClass,
        animation_clazz: defaults.animationClass,
        closing_animation_clazz: defaults.closingAnimationClass,
        is_fixed: true,
        draggable: true,
        drag_handle: '*',
        drag_cancel: '.content',
        is_always_up: true,
        width: '900px',
        show_title: false,
        show_close: false,
        maximizable: false,
        minimizable: false,
        content: defaults.template,
        events: {
            content_loaded: function (contentEl) {
                var popup = contentEl.el;
                popup.find(".widget-tabs").tabify();
            }
        }
    };

    var postInit = {
        initVars: function () {
            popupElement = popupInstance.el;
            selectMenuContainer = popupElement.find(".fee-select-menu");
            actionPopupType = selectMenuContainer.find(".fee-sm-item");
            widgetContentSection = popupElement.find(".fee-pu-widget-content-section");
            widgetHeaderSection = popupElement.find(".fee-pu-header");

            csdkImageEditor = new Aviary.Feather({
                apiKey: defaults.csdkAPIKey,
                theme: 'minimum',
                maxSize: 1000,
                language: browser.lang,
                tools: ["enhance", "effects", "crop", "resize", "orientation", "focus", "brightness", "contrast", "sharpness", "colorsplash", "drawing", "textwithfont", "whiten"],
                onSave: function (imageID, newURL) {
                    var imageWidgetEl = jQuery(imageWidget[0]);
                    var widgetUUId = imageWidgetEl.attr("id").substr(3);
                    //var widgetId = currentElement.parents('.widget').attr("widget-id").substr(2);
                    var widgetType = imageWidgetEl.attr("widget-type");
                    var formdata = new FormData();
                    formdata.append("targetImageUrl", currentImage.src);
                    formdata.append("sourceImageUrl", newURL);
                    formdata.append("type", "png");
                    formdata.append("widgetUUId", widgetUUId);
                    formdata.append("widgetType", widgetType);
                    // formdata.append("widgetId", widgetId);
                    formdata.append("name", popupElement.find(".preview-image").find(".image-name").text());

                    bm.ajax({
                        contentType: false,
                        processData: false,
                        cache: false,
                        url: "app/modifyImage",
                        type: "post",
                        data: formdata,
                        success: function (response) {
                            popupElement.find(".preview-image img").attr('src', response.url);
                            csdkImageEditor.close();
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
        loadWidgetAsync: function (widgetElement, widgetType, widgetUUID, widgetId) {
            var cachedData = editorInstance.cachedWidgetData[widgetUUID];

            if (!$(document).hasClass("loader")) {
                bm.mask($(".fee-pu-widget-content-section"), '<div><span class="loader"></span></div>');
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
                        var widgetContent = $(resp);
                        currentWidgetInstance = new app.FrontEndEditor.widget[widgetType](widgetContent, widgetType, widgetUUID, editorInstance);
                        currentWidgetInstance.init();
                        app.FrontEndEditor.utils.setAnimation(widgetContent, 'animated fadeIn');
                        if (widgetContent.find('.fee-pu-body').length) {
                            widgetContentSection.find(".fee-pu-body").html(widgetContent);
                        } else {
                            widgetContentSection.find('.fee-pu-body').empty().append(widgetContent);
                        }

                        if (widgetType !== 'snippet') {
                            postInit.bindWidgetEvents(widgetContent, widgetType, widgetUUID, currentWidgetInstance);
                        }
                        if (widgetType === 'image') {
                            postInit.imageWidgetPopulate();
                        }
                        if (popupElement.find(".fee-pu-content-body").length) {
                            new PerfectScrollbar('.fee-pu-content-body');
                        }
                    }
                },
                error: function (xhr, status, resp) {
                    bm.unmask($(".fee-pu-body"));
                    bm.notify(resp.message, resp.status);
                },
                complete: function (xhr, status, resp) {
                    setTimeout(function () {
                        bm.unmask($(".fee-pu-widget-content-section"));
                    }, 1500);
                }
            });
        },
        bindWidgetEvents: function (widgetPanel, widgetType, uuid, widgetInst) {
            var cachedData = editorInstance.cachedWidgetData[uuid];
            editorInstance.portlet.destroySortable();
            var configForm = widgetPanel.find(".config-form");
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

                                    widgetInst.widgetContentPlacement(hostElement, widgetElement);

                                    editorInstance.layout.setColumnAsEqualHeight(rowPanel);
                                    //editorInstance.portlet.restoreSortable(true);
                                    editorInstance.events.save();
                                    popupElement.find('.fee-pu-close').trigger("click");

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

            widgetPanel.find('.fee-cancel').on('click', function () {
                if (popupInstance) {
                    popupInstance.close();
                }
            });
        },
        _bind: function () {
            popupElement.find('.fee-pu-close').on('click', function () {
                popupInstance.close();
            });

            if (hostElement.hasClass("fee-add-button")) {
                selectMenuContainer.removeClass("fee-control-arrow");
            }else{
                selectMenuContainer.addClass("fee-control-arrow");
            }

            selectMenuContainer.find(".fee-sm-selected").click(function () {
                if (hostElement.hasClass("fee-add-button")) {
                    selectMenuContainer.find(".fee-sm-container").fadeToggle();
                }
            });
            actionPopupType.on("click", function () {
                var type = $(this).data("value");
                var selectedType = selectMenuContainer.find(".fee-sm-selected").attr("data-value");
                selectMenuContainer.find(".fee-sm-container").fadeOut();
                if (type !== selectedType) {
                    selectMenuContainer.find(".fee-sm-selected").attr("data-value", type);
                    selectMenuContainer.find(".fee-sm-selected").html($(this).html());
                    var alterType = type === 'widget' ? 'layout' : 'widget';
                    var alternateContentBodyEl = popupElement.find(".fee-pu-" + alterType + "-body");
                    var contentBodyEl = popupElement.find(".fee-pu-" + type + "-body");
                    alternateContentBodyEl.addClass(defaults.layoutSwitchOff);
                    contentBodyEl.addClass(defaults.layoutSwitchOn);
                    setTimeout(function () {
                        alternateContentBodyEl.removeClass(defaults.layoutSwitchOff).hide();
                        contentBodyEl.removeClass(defaults.layoutSwitchOn).show();
                    }, defaults.animationTimeout);
                }
            });
            popupElement.on("click", function (e) {
                if (!$(e.target).parents().addBack().is(selectMenuContainer)) {
                    selectMenuContainer.find(".fee-sm-container").fadeOut();
                }
            });

            popupElement.find('.fee-pu-layout').on('click', function () {
                var currEl = $(this);
                currEl.addClass('fee-pu-layout-selected');
                var layoutType = currEl.attr("data-type");
                if (layoutType === LAYOUT_TYPE.SPACER) {
                    editorInstance.layout.addSpacer(hostElement);
                    popupElement.find('.fee-pu-close').trigger("click");
                } else {
                    editorInstance.layout.addMultiColumn(hostElement, layoutType);
                    popupElement.find('.fee-pu-close').trigger("click");
                }
            });

            popupElement.find('.fee-pu-widget-tab').on('click', function () {
                var currEl = $(this);
                popupElement.find('.fee-pu-widget-tab-active').removeClass('fee-pu-widget-tab-active');
                currEl.addClass('fee-pu-widget-tab-active');
                var widgetType = currEl.attr('data-widget-type');

                switch (widgetType) {
                    case "content":
                        postInit.contentWidgetFunctionality();
                        break;

                    case "image":
                        var widgetUUID = bm.getUUID();
                        var widgetPanel = $(editorInstance.layout.widget.getEmptyDom('image', widgetUUID));
                        imageWidget = widgetPanel;
                        postInit.loadWidgetAsync(widgetPanel, 'image', widgetUUID);
                        widgetHeaderSection.empty();
                        break;

                    case "navigation":
                        postInit.navigationFunctionality();
                        break;
                }
            });
            popupElement.find('.fee-pu-widget-tab:first').trigger('click');
            new PerfectScrollbar('.fee-pu-widget-tab-section');
        },
        contentWidgetFunctionality: function () {
            var widgetUUID = bm.getUUID();
            var widgetPanel = $(editorInstance.layout.widget.getEmptyDom('html', widgetUUID));

            var contentTypeMenu = "<span class=\"fee-content-from\">From:</span>\n" +
                "        <div class=\"fee-select-menu fee-content-select-menu\">\n" +
                "           <span class=\"fee-sm-selected\" data-value=\"\">Snippet</span>\n" +
                "            <div class=\"fee-sm-container\" style=\"display: none\">\n" +
                "                <span class=\"fee-sm-item active\" data-value=\"snippet\">Snippet</span>\n" +
                "                <span class=\"fee-sm-item\" data-value=\"article\">Article</span>\n" +
                "                <span class=\"fee-sm-item\" data-value=\"custom-content\">Custom Content</span>\n" +
                "            </div>\n" +
                "        </div>";
            widgetHeaderSection.html(contentTypeMenu);

            var contentSelectMenuContainer = popupElement.find(".fee-pu-header").find(".fee-select-menu");
            contentSelectMenuContainer.find(".fee-sm-selected").click(function () {
                contentSelectMenuContainer.find(".fee-sm-container").fadeToggle();
            });
            contentSelectMenuContainer.find(".fee-sm-item").on("click", function () {
                var value = $(this).data("value");
                var selectedValue = contentSelectMenuContainer.find(".fee-sm-selected").attr("data-value");
                contentSelectMenuContainer.find(".fee-sm-container").fadeOut();
                if (value !== selectedValue) {
                    contentSelectMenuContainer.find(".fee-sm-item").removeClass("active");
                    $(this).addClass("active");

                    if (value != 'custom-content') {
                        postInit.loadWidgetAsync(widgetPanel, value, widgetUUID);
                    }

                    contentSelectMenuContainer.find(".fee-sm-selected").attr("data-value", value);
                    contentSelectMenuContainer.find(".fee-sm-selected").html($(this).html());

                    switch (value) {
                        case 'article':
                            postInit.loadWidgetAsync(widgetPanel, 'article', widgetUUID);
                            break;
                        case 'snippet':
                            setTimeout(function () {
                                editorInstance.snippet().init(popupElement, widgetPanel, widgetUUID, hostElement, currentWidgetInstance);
                            }, 1500);
                            break;
                        case 'custom-content':
                            var widgetIns = new app.FrontEndEditor.widget.html(widgetPanel, 'html', widgetUUID, editorInstance);
                            widgetIns.init(hostElement);
                            var htmlBody = widgetIns.render();
                            popupElement.find(".fee-pu-body").html(htmlBody);
                            break;
                    }
                }
            });

            contentSelectMenuContainer.find(".fee-sm-item").eq(0).trigger("click");

            popupElement.on("click", function (e) {
                var target = $(e.target);
                if (target.parents(".fee-content-select-menu").length < 1) {
                    contentSelectMenuContainer.find(".fee-sm-container").fadeOut();
                }
            });
        },
        navigationFunctionality: function () {
            var widgetUUID = bm.getUUID();
            var widgetPanel = $(editorInstance.layout.widget.getEmptyDom('html', widgetUUID));
            postInit.loadWidgetAsync(widgetPanel, 'navigation', widgetUUID);
            widgetHeaderSection.empty();
        },
        imageWidgetPopulate: function () {

            popupElement.find(".dropzone-wrapper").remove();
            var imageForm = popupElement.find(".config-form");
            imageForm.find("input[type='file']").on("change", function () {
                popupElement.find(".preview-image").fadeIn();
                if (this.files && this.files[0]) {
                    var file = this.files[0];
                    var FR = new FileReader();
                    FR.onload = function () {
                        var imgSrc = FR.result;
                        imageForm.find(".preview-image img").attr('src', imgSrc);
                        imageForm.find(".image-name").text(file.name);
                        var imageSize = ((file.size) / 1000) + " KB";
                        imageForm.find(".image-size").text(imageSize);

                        imageForm.find(".edit-button").on("click", function () {
                            currentImage = popupElement.find(".preview-image").find("img")[0];

                            csdkImageEditor.launch({
                                image: currentImage.id,
                                url: currentImage.src
                            });

                        });
                    };
                    FR.readAsDataURL(this.files[0]);
                }
            });
        }
    };

    this.init = function (config) {
        if (config) {
            $.extend(popupConfig, config, true);
        }
        popupInstance = new POPUP(popupConfig);
        postInit.initVars();
        popupElement.data("popup-instance", popupInstance);
        postInit._bind();
        return popupInstance;
    }
});