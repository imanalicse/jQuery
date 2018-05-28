app.FrontEndEditor.prototype.portletBuilder = (function () {
    var _self = this;

    return {
        init: function (section, performResizable) {
            var currentScope = this;
            var dragElement;
            var dragParent;
            if (!_self.grid_sortable) {
                _self.grid_sortable = new bm.Sortable(section.find(".fee-widget-row .fee-widget-content"), {
                    shim: false,
                    handle: "." + _self.widgetClass,
                    sortable_on_drop: false,
                    placeholder: 'fee-widget-placeholder',
                    helper: function (drag) {
                        dragElement = drag;
                        dragParent = _self.layout.getNestedGridBlock(drag);
                        var widgetType = drag.attr("widget-type");
                        var widgetObj = _self.WIDGETS[widgetType];
                        var widgetName = widgetObj ? widgetObj.label : (widgetType ? widgetType.capitalize() : '');
                        return $('<div/>').text(widgetName).addClass('fee-draggable-widget').appendTo(document.body);
                    },
                    start: function (data) {
                        dragElement.remove();
                        data.obj.sort_old_state = {
                            parent: data.elm.parent(),
                            index: data.elm.parent().children("." + _self.widgetClass).index(data.elm)
                        };
                        currentScope.destroyResizable();
                    },
                    stop: function () {
                        var deletableBlock = _self.layout.getNestedGridBlock(dragElement);
                        var borderOverlay = deletableBlock.find(">.fee-border-overlay,>.bmui-resize-handle");
                        deletableBlock.append(borderOverlay.clone());
                        borderOverlay.remove();
                        currentScope.addGridResize(section.find(_self.editableBlockSelector));
                        _self.layout.setColumnAsEqualHeight();
                        currentScope.restoreSortable(true);
                        _self.events.save();
                    }
                });
            }
            if (performResizable) {
                currentScope.addGridResize(section.find(_self.editableBlockSelector));
            }
        },
        addGridResize: function (grids) {
            var addResizeInfo = function (parentElement, infoData) {
                var resizeInfoElement = parentElement.find(".fee-resize-info");
                if (resizeInfoElement.length < 1) {
                    resizeInfoElement = $("<div/>").addClass("fee-resize-info");
                    parentElement.append(resizeInfoElement);
                }
                resizeInfoElement.html(infoData);
            };
            if (!_self.grid_resizable) {
                _self.grid_resizable = grids.find(".no-fixed-left").resizable({
                    direction: ["r"],
                    resize: function (hash) {
                        _self.pageBody.find('.fee-widget-chooser').css('visibility', 'hidden');
                        var total = hash.elm.parent().width();
                        var x_width = hash.elm.width();
                        if (x_width > total - 100) {
                            x_width = total - 80;
                            hash.elm.width(x_width);
                        } else if (x_width < 100) {
                            x_width = 80;
                            hash.elm.width(x_width);
                        }
                        addResizeInfo(hash.elm, ((hash.elm.width() / total) * 100).toFixed(2) + "%");
                        var other_grid = hash.elm.siblings('.grid-block');
                        $.each(other_grid, function () {
                            var currElm = $(this);
                            var other_width = total - hash.elm.width() - 20;
                            currElm.width(other_width);
                            addResizeInfo(currElm, ((other_width / total) * 100).toFixed(2) + "%");
                        });
                    },
                    start: function () {
                        _self.pageBody.find('.fee-widget-chooser').css('visibility', 'hidden');
                    },
                    stop: function (hash) {
                        var total = hash.elm.parent().width();
                        // update resize grid
                        var x_uuid = hash.elm.attr("id").substring(6);
                        var x_width = hash.elm.width() / total * 100;
                        _self.style.update(_self.css, null, "#spltr-" + x_uuid, {'width': x_width + "%"});

                        // update other grid
                        var other_grid = hash.elm.siblings('.grid-block');
                        $.each(other_grid, function () {
                            var currElm = $(this);
                            var other_uuid = currElm.attr("id").substring(6);
                            // var other_width = ((x_width - currElm.width()) / total * 100) / other_grid.length;
                            var other_width = (total - hash.elm.width()) / total * 100;
                            _self.style.update(_self.css, null, "#spltr-" + other_uuid, {'width': other_width + "%"});
                        });
                        hash.elm.removeAttr('style');
                        hash.elm.siblings().removeAttr('style');
                        hash.elm.find(".fee-resize-info").remove();
                        hash.elm.siblings().find(".fee-resize-info").remove();
                        _self.layout.setColumnAsEqualHeight();
                        _self.events.save();
                    }
                });
            }
        },
        restoreSortable: function (reInit) {
            if (_self.grid_sortable && !reInit) {
                _self.grid_sortable.restore();
            } else {
                if (_self.grid_sortable) {
                    _self.grid_sortable.destroy();
                    _self.grid_sortable = null;
                }
                this.init(_self.pageBody, true);
            }
        },
        addSortableElement: function (element) {
            if (_self.grid_sortable) {
                _self.grid_sortable.addElement(element);
            }
        },
        removeSortableElement: function (element) {
            if (_self.grid_sortable) {
                _self.grid_sortable.removeElement(element);
            }
        },
        destroySortable: function () {
            if (_self.grid_sortable) {
                _self.grid_sortable.destroy();
            }
        },
        destroyResizable: function () {
            if (_self.grid_resizable) {
                var resizableOnj = _self.grid_resizable.data('wcuiResizableObj');
                if (resizableOnj) {
                    resizableOnj.destroy();
                }
            }
        }
    }
});