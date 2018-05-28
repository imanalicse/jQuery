app.FrontEndEditor.prototype.header = (function () {
    var _self = this;
    var editorInstance = _self;
    var pageBody = this.pageBody;
    var currentWidgetInstance;
    var popupElement;
    var popupInstance;
    var defaults = {
        popupClass: 'fee-navigation-popup',
        animationClass: 'animated zoomIn',
        closingAnimationClass: 'animated fadeOut',
        animationTimeout: 300
    };

    function afterContentLoad(content){
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
            content: content,
            events: {
                content_loaded: function (contentEl) {
                    popupElement = contentEl.el;
                }
            }
        };

        popupInstance = new POPUP(popupConfig);
    }

    var postInit = {
        loadWidgetAsync: function (widgetElement, widgetType, widgetUUID, widgetId) {
            var cachedData = editorInstance.cachedWidgetData[widgetUUID];

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
                        var widgetContent = $(resp);
                        afterContentLoad(widgetContent);
                        currentWidgetInstance = new app.FrontEndEditor.widget[widgetType](widgetContent, widgetType, widgetUUID, editorInstance);
                        currentWidgetInstance.init();
                        app.FrontEndEditor.utils.setAnimation(widgetContent, 'animated fadeIn');
                        postInit.bindWidgetEvents(widgetContent, widgetType, widgetUUID, currentWidgetInstance);
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

                                    if (widgetElement.find(".fee-overlay").length < 1) {
                                        widgetElement.append(_self.layout.template.widgetOverlay.clone());
                                    }
                                    pageBody.find("#"+uuid).html(widgetElement.html());
                                    editorInstance.portlet.restoreSortable(true);
                                    editorInstance.events.save();
                                    //widgetPanel.find('.fee-cancel').trigger("click");
                                    if (popupInstance) {
                                        popupInstance.close();
                                    }
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
        saveContent: function (currentWidget) {
            //var currentWidget = $(ev.target).closest('.widget');

            var widgetType = currentWidget.attr('widget-type');
            var widgetUUId = app.FrontEndEditor.utils.getUuid(currentWidget);

            var currentWidgetObj = _self.WIDGETS[widgetType];
            if (!currentWidgetObj) {
                return;
            }

            currentWidget.find(".fee-header-footer-control-menu").remove();

            var widgetInst = new app.FrontEndEditor.widget[widgetType](currentWidget, widgetType, widgetUUId, _self);

            var contentId = widgetInst.getContentId();

            _self.layout.hideEditSelectionOverlay();

            var contentValue = widgetInst.getContentValue();

            currentWidget.attr('modified-widget', true);
            currentWidget.attr("cached-widget", true);

            var webApiUrl = app.baseUrl + widgetInst.getEditApiUrl();
            var widgetId = '';

            if (currentWidget) {
                widgetId = currentWidget.attr('widget-id');
            }

            var ajaxSettings = {};
            if(!ajaxSettings.data) {
                ajaxSettings.data = {}
            }
            var defaultParams = {
                widgetType: widgetType,
                uuid: widgetUUId,
                widgetId: widgetId,
                containerId: _self.pageId,
                containerType: 'page',
                noLayout: true,
                fromFrontEnd: true
            };

            defaultParams[widgetInst.getContentIdKey()] = contentId;
            defaultParams[widgetInst.getContentValueKey()] = contentValue;
            widgetInst.addAdditionalData(defaultParams);

            widgetInst.beforeSave(ajaxSettings);

            $.extend(ajaxSettings.data, defaultParams);

            _self.ajaxCallee(webApiUrl, ajaxSettings.data, currentWidget).then(function (resp) {
                if (resp.status = "success") {
                    if (_self.popupInstance) {
                        _self.popupInstance.close();
                        currentWidget.closest('.fee-widget-chooser').find('.fee-add-widget').text('+ ' + $.i18n.prop("add.content"));
                        currentWidget.closest('.fee-widget-chooser').find('.fee-item-list').hide();
                    }
                    currentWidget.data('data-cache', resp['serialized']);

                    var widgetData = JSON.parse(resp.serialized);

                    _self.cachedWidgetData[widgetUUId] = resp;
                    _self.cachedWidgetData[widgetUUId]['serialized'] = widgetData;

                    _self.events.save();
                }
            });
        }
    }

    return {
        headerWidgetCommand: function (menuElement) {
            var role = menuElement.attr('data-role');
            var currentWidget = menuElement.closest('.widget');
            var widgetType = currentWidget.attr('widget-type');
            switch (role) {
                case "visibility":
                    var widgetSelector = "#"+currentWidget.attr("id");
                    $(widgetSelector).toggleClass("fee-widget-control-view");
                    /*var opacityValue = _self.css.getAttribute(widgetSelector, "opacity");
                    var opacity = opacityValue === "1" ? "0.5" : "1";
                    _self.style.update(_self.css, null, widgetSelector, {'opacity': opacity});*/

                    _self.events.save();
                    break;
                case 'edit':
                    var widgetUUID = currentWidget.attr("id");
                    var widgetId = currentWidget.attr("widget-id");
                    if(widgetType === 'navigation') {
                        var widgetPanel = $(editorInstance.layout.widget.getEmptyDom('html', widgetUUID));
                        postInit.loadWidgetAsync(widgetPanel, 'navigation', widgetUUID, widgetId);
                    }else if(widgetType ==="storeLogo"){
                        var curEl = currentWidget.find("img");
                        var highlightedElement = curEl;
                        var imageEditorInstance = _self.imageEditor().init(curEl, highlightedElement);
                    }else if(widgetType ==="snippet" || widgetType ==="article"  || widgetType ==="html" ){
                        _self.simpleEditorInstance = _self.simpleEditor().init(currentWidget);
                    }
                    break;
                case 'save':
                    if(widgetType === 'snippet') {
                       postInit.saveContent(currentWidget);
                    }
                    break;
                 case 'reset':
                    if(widgetType === 'snippet') {
                        _self.simpleEditorInstance.reset();
                    }
                    break;
                 case 'close':
                    if(widgetType === 'snippet') {
                        _self.simpleEditorInstance.reset();
                        _self.simpleEditorInstance.destroy(currentWidget);
                    }
                    break;

            }
        }
    }
});