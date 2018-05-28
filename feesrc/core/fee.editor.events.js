app.FrontEndEditor.prototype.eventBuilder = (function () {
    var _self = this;

    var pageBody = this.pageBody;

    return {
        openWidgetPopup: function (hostElement) {
            var popupConfig = {};
            var widgetPopup = new app.FrontEndEditor.widgetPopup(hostElement, _self);
            _self.popupInstance = widgetPopup.init(popupConfig);
        },
        bindWidgetCommand: function (menuElement) {
            var role = menuElement.attr('data-role');
            var currentWidget = menuElement.closest('.widget');
            switch (role) {
                case 'edit':
                    _self.simpleEditorInstance = _self.simpleEditor().init(currentWidget);
                    break;
                case 'delete':
                    bm.confirm($.i18n.prop("confirm.delete", 'widget'), function () {
                        _self.layout.widget.remove(currentWidget);
                    }, true);
                    break;
                case 'save':
                    console.log("save");
                    break;
                case 'reset':
                    _self.simpleEditorInstance.reset();
                    break;
                case 'close':
                    _self.simpleEditorInstance.reset();
                    _self.simpleEditorInstance.destroy(currentWidget);
                    break;
            }
        },
        loadSerializeConfig: function (widgetElement, widgetUUID) {
            var widgetId = widgetElement.attr('widget-id');
            var widgetType = widgetElement.attr('widget-type');
            var currentWidget = _self.WIDGETS[widgetType];
            if (currentWidget) {
                widgetUUID = widgetUUID || app.FrontEndEditor.utils.getUuid(widgetElement);

                var url = app.baseUrl + 'widget/' + widgetType + 'ShortConfig';

               _self.ajaxCallee(url,
                   {
                       fetchSerialize: true,
                       fetchHtml: !currentWidget.inlineEdit,
                       widgetId: widgetId
                   },
                   widgetElement).then(function (jsonResponse) {
                        if (jsonResponse) {
                            widgetElement.data('data-cache', jsonResponse.serialized);
                            _self.cachedWidgetData[widgetUUID] = {
                                serialized: JSON.parse(jsonResponse.serialized),
                                htmlContent: jsonResponse.htmlContent
                            };
                            _self.layout.widget.get(widgetElement);
                        }
                    });
            }
        },
        clearSavedData: function (resp) {
            pageBody.find("[modified-widget]").removeData("data-cache").removeAttr("modified-widget");
            if (resp.newWidgets) {
                $.each(resp.newWidgets, function () {
                    pageBody.find("#wi-" + this.uuid).removeData("data-cache").removeAttr("new-widget").attr("widget-id", this.id);
                })
            }
            _self.containerId = resp.containerId;
            _self.removedWidgets = [];
            if (resp.newDocks) {
                $.each(resp.newDocks, function () {
                    pageBody.find("#dock-" + this.uuid).attr("dock-id", this.id);
                })
            }
            _self.newDocks = [];
            _self.modifiedDocks = [];
            _self.removedDock = [];

            _self.removedHeader = [];
            _self.removedFooter = [];
        },
        getSavedData: function () {
            //var blockSelector = ["header", "body", "footer", "dockable"];
            var blockSelector = ["body", "dockable"];
            var getWidgets = function (block) {
                var widgets = [];
                block.each(function () {
                    var wiElement = _self.layout.widget.get($(this));
                    var saveData = {
                        uuid: wiElement.uuid,
                        type: wiElement.type,
                        cache: wiElement.elm.data("data-cache"),
                        copied: true,
                        css: wiElement.css.toString(),
                        templateServerUuid: wiElement.templateServerUuid,
                        groupId: wiElement.group
                    };
                    if (wiElement.js !== undefined) {
                        saveData.js = wiElement.js
                    }
                    var dock = wiElement.elm.closest(".dockable");
                    if (dock.length) {
                        saveData["dockUUID"] = dock.attr("id").substring(5);
                    }
                    widgets.push(saveData);
                });
                return widgets;
            };
            var added = {};
            blockSelector.every(function () {
                added[this] = getWidgets(pageBody.find("." + this + " [new-widget]"))
            });

            var docks = [];
            _self.newDocks.every(function () {
                docks.push({uuid: this.uuid, css: this.css.toString()})
            });

            _self.modifiedDocks.every(function () {
                var cache = _self.cachedDock[this];
                var id = cache.elm.attr("dock-id");
                if (!_self.removedDock.contains(id)) {
                    docks.push({uuid: cache.uuid, css: cache.css.toString(), dockId: id})
                }
            });
            var modified = {};
            pageBody.find('.body').find("[modified-widget]").each(function () {
                var uuid = app.FrontEndEditor.utils.getUuid($(this));
                var wiElement = _self.layout.widget.get($(this));
                var css = wiElement.css;
                modified[uuid] = {uuid: uuid, type: wiElement.type, cache: wiElement.elm.data("data-cache"), css: css.toString(), js: wiElement.js, groupId: wiElement.group}
            });

            var containerCss = _self.css ? _self.css.toString() : '';
            var removed = [];
            _self.removedWidgets.every(function (removedWidget) {
                if (removedWidget instanceof Array) {
                    removed.pushAll(removedWidget);
                } else {
                    removed.push(removedWidget);
                }
            });
            var data = {
                modified: JSON.stringify(modified),
                removed: JSON.stringify(removed),
                removedDock: JSON.stringify(_self.removedDock),
                docks: JSON.stringify(docks),
                containerId: _self.pageId,
                containerType: 'page',
                containerCss: containerCss,
                layoutId: _self.layout_id,
                added_in_header: JSON.stringify(added.header),
                added_in_footer: JSON.stringify(added.footer),
                added_in_body: JSON.stringify(added.body),
                added_in_dock: JSON.stringify(added.dockable)
            };
            var bodyContent = _self.layout.getBodyContent();
            bodyContent.find("*").each(function () {
                var _this = $(this);
                _this.removeAttr("style").removeClass("bmui-draggable bmui-resizable bmui-sortable-placeholder");
                _this.removeClass('fee-widget-row fee-widget-column fee-widget-row-active fee-widget-column-active fee-active-state fee-widget-selected-container');
                _this.filter(".fee-overlay,.fee-border-overlay,.fee-widget-chooser,.fee-widget-command,.fee-after,.fee-before,.bmui-resize-handle,.fee-resize-info,.bmui-sortable-placeholder,.fee-add-content,.fee-menu-bar,.fee-floating-editor-menu").replaceWith("");
                if (_this.hasClass(_self.widgetClass)) {
                    var widgetType = _this.attr("widget-type");
                    var id = _this.attr("id");
                    var uuid = id ? id.substring(3) : null;
                    _this.replaceWith(_self.layout.widget.getTag(uuid, widgetType));
                }
            });
            data.bodyContent = bodyContent.length ? bodyContent.cleanWhitespace().html() : "";
            return data;
        },
        save: function (callback) {
            var currentScope = this;
            var blockSelector = ["header", "body", "footer"].contains(_self.section) ? _self.section : "dockable";
            var templateWidget = pageBody.find("." + blockSelector + " [external-widget=true]");
            if (templateWidget.length > 1) {
                bm.notify($.i18n.prop("you.have.unconfigured.widget"), "error");
                return false;
            }
            var params = currentScope.getSavedData();

            var url= app.baseUrl + _self.contentSaveUrl;

            _self.ajaxCallee(url, params, templateWidget).then(function (resp) {
                currentScope.clearSavedData(resp);
                if (callback) {
                    callback();
                }
            });
        }
    }
});