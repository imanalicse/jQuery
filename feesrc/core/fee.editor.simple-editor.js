app.FrontEndEditor.prototype.simpleEditor = function () {
    var _self = this;
    var editorInstance = _self;
    var parentElement;
    var highlightedElement;
    var nonEditableElements;
    var editableElements;
    var elementMenuPanel;
    var elementActionPanelInstance;
    var hasRedactor;
    var previousWidget;
    var cssParser;

    var destroy = function () {
        if (parentElement) {
            destroyWidget(parentElement);
            parentElement.off('mouseover mouseout');
            parentElement = null;
        }
    };

    var destroyWidget = function (currentWidget) {

        if (currentWidget) {
            currentWidget.removeClass("fee-widget-editable");
            currentWidget.trigger('mouseout');
            currentWidget.find(".fee-element-action-container").remove();
            $(document).find(".fee-highlighted-element").removeClass("fee-highlighted-element");
            if (hasRedactor) {
                redactorEvent.destroy();
            }
        }
    };

    var redactorEvent = {
        activeRedactor: function () {
            highlightedElement.on("click", function (e) {
                e.preventDefault();
                var curEl = $(e.target);
                if(curEl.closest('.fee-widget-editable').length==1) {
                    if (curEl.is("img") || (curEl.is("a") && curEl.children().is("img"))) {
                        var currentWidget = $(e.target).closest('.widget');
                        var widgetType = currentWidget.attr("widget-type");
                        if (widgetType === 'image') {
                            var imageEditorInstance = _self.imageWidgetEdit().init(curEl, highlightedElement);
                        } else {
                            var imageEditorInstance = _self.imageEditor().init(curEl, highlightedElement);
                        }

                    } else {
                        if (!curEl.hasClass("fee-element-action-container") && curEl.parents(".fee-element-action-container").length < 1) {
                            if (!highlightedElement.parent().hasClass("redactor-container")) {
                                _self.elementActionPanel().destroy();
                                if (hasRedactor) {
                                    redactorEvent.destroy();
                                }
                                if (!hasRedactor) {
                                    hasRedactor = true;
                                    highlightedElement.wrap("<div class='redactor-container'></div>");
                                    highlightedElement.parent().redactor({
                                        buttons: ['format', 'bold', 'italic', 'underline', 'ol', 'ul', 'indent', 'outdent',
                                            'image', 'file', 'link'],
                                        focus: true,
                                        plugins: ['fontcolor', 'fontsize', 'bufferbuttons', 'alignment']
                                    });
                                }
                            }
                        }
                    }
                }
            });
        },
        destroy: function () {
            if(parentElement)
            {
                if(parentElement.find(".redactor-container").length > 0){
                    parentElement.find(".redactor-container").redactor('core.destroy');
                    parentElement.find(".redactor-container").children().unwrap();
                    hasRedactor = false;
                }
            }
        }
    };

    var postInit = {
        initVars: function () {
            parentElement.addClass("fee-widget-editable");
            nonEditableElements = ".widget, .article-content, .article-item, .fee-widget-menu, .fee-menu-group, .fee-menu-item, .fee-widget-editable, .fee-element-action-container," +
                " .fee-element-action, .fee-overlay, span, strong, em, .container > row > col-*";
            editableElements = "h1, h2, h3, h4, h5, h6, p, img, ul, *[data-style-type='text'], div[data-cloneable=true], a";
            elementMenuPanel = $("<span class='fee-element-action-container'><span class=\"fee-element-action fee-icon fee-icon-cog\"></span></span>");
            hasRedactor = false;
            cssParser = _self.css;
        },
        selectEvent: function () {

            parentElement.on('mouseover', function (ev) {
                var targetEl = $(ev.target);
                if (
                    targetEl.is(editableElements)
                    && !targetEl.hasClass("redactor-toolbar") && targetEl.parents(".redactor-toolbar").length < 1
                )
                {
                    highlightElement(targetEl);
                }
            }).on('mouseout', function (ev) {
                if (highlightedElement && !$(ev.target == 'fee-element-action')) {
                    removeHighlightElement();
                }

            }).on('click', function (ev) {
                var targetEl = $(ev.target);
                if(targetEl.closest(".fee-highlighted-element").length===0 && targetEl.closest(".redactor-toolbar").length===0){
                    redactorEvent.destroy();
                    _self.elementActionPanel().destroy();
                }
            });

            function highlightElement(elm) {
                if (highlightedElement) {
                    removeHighlightElement()
                }
                highlightedElement = elm;
                highlightedElement.addClass('fee-highlighted-element');
                highlightedElement.append(elementMenuPanel);

                highlightedElement.find(".fee-element-action").on('click', function (ev) {
                    if (elementActionPanelInstance) {
                        elementActionPanelInstance.destroy();
                    }
                    redactorEvent.destroy();
                    elementActionPanelInstance = _self.elementActionPanel().init($("body"), parentElement, highlightedElement);
                });
                redactorEvent.activeRedactor();
            }

            function removeHighlightElement() {
                if (highlightedElement) {
                    highlightedElement.off("click");
                    highlightedElement.removeClass("fee-highlighted-element");
                    highlightedElement.find(".fee-element-action-container").remove();
                    highlightedElement = null;
                }
            }
        },
        bind: function () {
            parentElement.find(".fee-menu-item").on("click", function (ev) {
                var role = $(this).attr('data-role');
                if (role == 'save') {
                    postInit.saveContent(ev);
                }
            });
        },
        saveContent: function (ev) {
            var currentWidget = $(ev.target).closest('.widget');

            var widgetType = currentWidget.attr('widget-type');
            var widgetUUId = app.FrontEndEditor.utils.getUuid(currentWidget);

            var currentWidgetObj = _self.WIDGETS[widgetType];
            if (!currentWidgetObj) {
                return;
            }

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
        },
    };
    return {
        init: function (currentWidget) {
            parentElement = currentWidget;
            previousWidget = parentElement.clone();
            postInit.initVars();
            postInit.selectEvent();
            postInit.bind();
            return this;
        },
        save: function () {
            postInit.save();
        },
        destroy: function (currentWidget) {
            parentElement = currentWidget;
            destroy();
            _self.elementActionPanel().destroy();
        },
        reset: function () {
            if(parentElement)
            {
                parentElement.after('<div class="fee-widget-animator"><div><span class="loader"></span></div></div>');
                var widgetHeight = parentElement.outerHeight(true);
                var widgetWidth = parentElement.outerWidth(true);
                var offset = parentElement.position();

                var animator = parentElement.closest('.fee-widget-row').find('.fee-widget-animator');

                animator.css({
                    'height': widgetHeight+'px',
                    'width': widgetWidth+'px',
                    'top': offset.top+'px'
                });

                setTimeout(function(){
                    animator.remove();
                }, 500);

                var widgetValue = previousWidget.html();
                parentElement.first().html(widgetValue);
                _self.simpleEditorInstance = this.init(parentElement);
            }

        }
    };
};
