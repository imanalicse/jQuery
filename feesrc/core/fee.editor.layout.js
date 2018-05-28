app.FrontEndEditor.prototype.layoutBuilder = (function () {

    var _self = this;
    var pageBody = this.pageBody;
    var spacerDefaultHeight = "50px";

    var template = {
        widgetSelectorPanel: $("<div class=\"fee-add-row-container\">\n" +
            "     <div class=\"fee-add-button\"></div>\n" +
            "</div>"),
        widgetAddContent: $("<div class=\"fee-add-content\">\n" +
            "                   <span class=\"fee-ac-title\">Add content</span>\n" +
            "               </div>"),
        widgetEditCommandPanel: $("<div class=\"fee-widget-menu\">\n" +
            "   <span class=\"fee-options\" style=\"display: none\"></span>\n" +
            "   <div class=\"fee-menu-group\">\n" +
            "      <span class=\"fee-menu-item fee-edit\" data-role=\"edit\"></span>\n" +
            "      <span class=\"fee-menu-item fee-delete\" data-role=\"delete\"></span>\n" +
            "      <span class=\"fee-menu-item fee-save\" data-role=\"save\"></span>\n" +
            "      <span class=\"fee-menu-item fee-reset\" data-role=\"reset\"></span>\n" +
            "      <span class=\"fee-menu-item fee-close\" data-role=\"close\"></span>\n" +
            "   </div>\n" +
            "</div>"),
        columnMenuPanel: $("<div class=\"fee-menu-bar fee-menu-column\" data-type=\"column\">\n" +
            "                    <span class=\"fee-menu-title\">Column <span class=\"fee-counter\"></span></span>\n" +
            "                    <span class=\"fee-menu-action fee-icon fee-icon-cog\"></span>\n" +
            "              </div>"),
        rowMenuPanel: $("<div class=\"fee-menu-bar fee-menu-row\" data-type=\"row\">\n" +
            "            <span class=\"fee-menu-title\">Row <span class=\"fee-counter\"></span></span>\n" +
            "            <span class=\"fee-menu-action fee-icon fee-icon-cog\"></span>\n" +
            "    </div>"),
        multiColumnPanel: $("<div class=\"grid-block fee-widget-column\">" +
            "                   <div class=\"no-fixed-left grid-block fee-widget-column\"></div>" +
            "                   <div class=\"no-fixed-right grid-block fee-widget-column\"></div>" +
            "              </div>"),
        widgetOverlay: $("<div class=\"fee-overlay\"></div>"),
        blankFullWidthPanel: $("<div class=\"v-split grid-block fee-widget-row\">\n" +
            "   <div class=\"fee-widget-content\"></div>\n" +
            "</div>"),
        widgetHeaderFooterCommandPanel: $("<div class=\"fee-header-footer-control-menu fee-widget-option\">\n" +
            "      <span class=\"fee-menu-item fee-visibility\" data-role=\"visibility\"></span>\n" +
            "      <span class=\"fee-menu-item fee-edit\" data-role=\"edit\"></span>\n" +
            "      <span class=\"fee-menu-item fee-save\" data-role=\"save\"></span>\n" +
            "      <span class=\"fee-menu-item fee-reset\" data-role=\"reset\"></span>\n" +
            /*"      <span class=\"fee-menu-item fee-close\" data-role=\"close\"></span>\n" +*/
            "</div>"),
    };

    var widgetComponent = {
        new: function (editor, props) {
            _self.editor = editor;
            $.extend(this, props);
            // _self.type = _self.elm.attr("widget-type");
        },
        getTag: function (uuid, widgetType) {
            return "<wi:widget uuid ='" + uuid + "' type='" + widgetType + "'/>"
        },
        getEmptyDom: function (widgetType, uuid) {
            return "<div class='" + _self.widgetClass + " widget-" + widgetType + "' new-widget widget-type='" + widgetType + "' id='wi-" + uuid + "'>" + $.i18n.prop(widgetType.minusCase()) + " " + $.i18n.prop("widget") + " </div>"
        },
        getRow: function (mainPanel) {
            return mainPanel.parents('.fee-widget-row:first');
        },
        get: function (widget) {
            var wiElement;
            var uuid = widget.attr("id").substring(3);
            if (widget.is('[cached-widget]')) {
                wiElement = _self.cachedWidgets[uuid];
            } else {
                var style = $("#style-store-" + uuid);
                var css = new CssParser(style.length ? style[0].innerHTML : "");
                css.parse();
                wiElement = new widgetComponent.new(this, {
                    uuid: uuid,
                    elm: widget,
                    type: widget.attr("widget-type"),
                    style: null,
                    css: css
                });
                _self.cachedWidgets[uuid] = wiElement;
                widget.attr("cached-widget", true);
                if (widget.parent().is(".widget-group")) {
                    wiElement.group = widget.parent().attr("id").substring(6)
                }
            }
            return wiElement;
        },
        append: function (element, widgetElm) {
            if (element.hasClass('fee-after')) {
                element.before(widgetElm);
            } else {
                element.after(widgetElm);
            }
            var parentElement = element.parent();
            var borderOverlay = parentElement.find(">.fee-border-overlay,>.bmui-resize-handle");
            parentElement.append(borderOverlay.clone());
            borderOverlay.remove();
        },
        updateContent: function (uuid, content) {
            return _self.pageBody.find("#wi-" + uuid).html(content.html())
        },

        update: function (parentElement, widgetValue, widgetType, uuid, isEditMode) {
            var widgetElm = isEditMode ? parentElement : $(widgetComponent.getEmptyDom(widgetType, uuid));
            var widgetDom = $(widgetValue);
            widgetDom.updateUi();
            widgetElm.html(widgetDom);

            if (!isEditMode) {
                widgetComponent.append(parentElement, widgetElm);
                //_self.portlet.restoreSortable(true);
            } else {
                //_self.portlet.restoreSortable();
            }
            //_self.portlet.destroyResizable();
            //_self.portlet.addGridResize(_self.pageBody.find(".body").find(_self.editableBlockSelector));

            parentElement.removeClass('fee-widget-selected');
            return widgetElm;
        },
        remove: function (widget, onlyCache) {
            var uuid = app.FrontEndEditor.utils.getUuid(widget);
            var cachedElement = _self.cachedWidgets[uuid];
            if (cachedElement) {
                var templateServerUuid = cachedElement.templateServerUuid ? cachedElement.templateServerUuid : (cachedElement.elm.is("[external-widget=true]") ? uuid : null);
                if (!cachedElement.elm.is("[new-widget]") || templateServerUuid) {
                    _self.removedWidgets.push({uuid: uuid, templateServerUuid: templateServerUuid});
                }
            }
            if (!onlyCache) {
                var rowPanel = widget.parents('.fee-widget-row:first');
                _self.layout.hideEditSelectionOverlay();
                widget.addClass("collapseDownToTop");
                setTimeout(function () {
                    widget.remove();
                    if (rowPanel.find('.widget').length === 0) {
                        rowPanel.remove();
                    }
                    _self.events.save();
                }, 300);
            }
        }
    };

    var commandTemplate = {
        getWidgetSelector: function () {
            var clonePanel = template.widgetSelectorPanel.clone();
            clonePanel.css('visibility', 'visible');
            return clonePanel;
        },
        hideActiveBlock: function () {
            _self.pageBody.find(".grid-block.fee-active-state").removeClass("fee-active-state");
        },
        makeActiveBlock: function (currentElm) {
            currentElm.closest(".grid-block").addClass("fee-active-state");
            commandTemplate.updateRowCounter(currentElm.closest('.fee-widget-row'));
        },
        addColumn: function (currentElm) {
            var closestWidgetColumn = currentElm.find('.fee-widget-column');
            if (closestWidgetColumn.find('.fee-menu-column').length < 1) {
                closestWidgetColumn.prepend(template.columnMenuPanel.clone());
                commandTemplate.updateColumnCounter(currentElm);
            }
        },
        addRow: function (currentElm) {
            var rowParentPanel = currentElm.closest('.fee-widget-row');
            if (rowParentPanel.length && rowParentPanel.find('.fee-menu-row').length < 1) {
                rowParentPanel.prepend(template.rowMenuPanel.clone());
                commandTemplate.updateRowCounter(rowParentPanel);
                var widgetSelectorBefore = commandTemplate.getWidgetSelector();
                widgetSelectorBefore.addClass("fee-before");
                var widgetSelectorAfter = commandTemplate.getWidgetSelector();
                widgetSelectorAfter.addClass("fee-after");
                rowParentPanel.prepend(widgetSelectorBefore);
                rowParentPanel.append(widgetSelectorAfter);
            }
        },
        updateRowCounter: function (rowParentPanel) {
            var allPreviousSiblings = rowParentPanel.prevUntil('.fee-menu-row');
            rowParentPanel.find('.fee-menu-row').find('.fee-counter').text(allPreviousSiblings.length + 1);
        },
        updateColumnCounter: function (columnParentPanel) {
            columnParentPanel.find('.fee-widget-column').each(function (index) {
                var currElm = $(this);
                currElm.find('.fee-menu-column').find('.fee-counter').text(index + 1);
            });
        },
        addWidgetContent: function (currentElm) {
            if (currentElm.find('.fee-add-content').length < 1) {
                if (currentElm.find('.fee-widget-content').length) {
                    currentElm.find('.fee-widget-content').append(template.widgetAddContent.clone());
                } else {
                    var gridPanel = currentElm.find('.grid-block').length ? currentElm.find('.grid-block') : currentElm.closest('.grid-block');
                    gridPanel.append(template.widgetAddContent.clone());
                }
            }
        }
    };

    return {
        template: template,
        commandTemplate: commandTemplate,
        widget: widgetComponent,
        getBlankFullWidthPanel: function () {
            return $(template.blankFullWidthPanel).clone().attr("id", "spltr-" + bm.getUUID());
        },
        getWidgetWithGridBlock: function (widget) {
            var blankFullWidthPanel = this.getBlankFullWidthPanel();
            this.addEditorCommandBlock(blankFullWidthPanel);
            blankFullWidthPanel.find('.fee-widget-content').prepend(widget);
            return blankFullWidthPanel;
        },
        getBodyContent: function () {
            if (_self.has_layout) {
                return _self.pageBody.find(".page-content").clone();
            }
            return _self.pageBody.find(".body").clone();
        },
        insertOverlay: function () {
            _self.pageBody.find(".fee-border-overlay").remove();
            var editableBlockContainer = _self.pageBody.find(".grid-block");
            var currentScope = this;
            $.each(editableBlockContainer, function () {
                var editableBlock = $(this);
                editableBlock.append(currentScope.addOverlay());
            });
        },
        insertDefaultGridBlock: function () {
            var selfScope = this;
            var blankFullWidthPanel = selfScope.getBlankFullWidthPanel();
            $(_self.defaultGridBlockContainer).append(blankFullWidthPanel);
            selfScope.addEditorCommandBlock(blankFullWidthPanel);
        },
        addOverlay: function () {
            var overLayDom = $("<div class=\"fee-border-overlay\"></div>");
            var totalGridBlock = _self.pageBody.find('.fee-border-overlay').length;
            overLayDom.css('zIndex', totalGridBlock > 0 ? 1000 + totalGridBlock : 1000);
            return overLayDom;
        },
        addEditorCommandBlock: function (block) {
            commandTemplate.addRow(block);
            commandTemplate.addWidgetContent(block);
            commandTemplate.addColumn(block);
        },
        getNestedGridBlock: function (mainPanel) {
            var parentBlock = mainPanel.parents('.grid-block:first');
            if (parentBlock.length < 1) {
                parentBlock = mainPanel.parents('.page-content:first');
            }
            if (parentBlock.length < 1) {
                parentBlock = mainPanel.parents('.widget-container:first');
            }
            return parentBlock;
        },
        getMultiColumnContainer: function () {
            var cssParser = _self.css;
            var leftUUID = bm.getUUID();
            var rightUUID = bm.getUUID();
            var rowContainer = template.multiColumnPanel.clone(true);
            var leftPanel = rowContainer.find(".no-fixed-left");
            var rightPanel = rowContainer.find(".no-fixed-right");
            leftPanel.attr('id', "spltr-" + leftUUID);
            rightPanel.attr('id', "spltr-" + rightUUID);
            _self.style.update(cssParser, leftUUID, "#spltr-" + leftUUID, {'width': '50%'});
            _self.style.update(cssParser, rightUUID, "#spltr-" + rightUUID, {'width': '50%'});
            return rowContainer;
        },
        addSpacer: function (activeSection) {
            var rowPanel = activeSection.closest('.fee-widget-row');
            var isAppendAfter = activeSection.hasClass('fee-after') || activeSection.parent('.fee-after').length;

            var currentScope = this;

            var elementUUID = bm.getUUID();

            var newElement = $('<div/>').attr("id", "spltr-" + elementUUID);

            newElement.empty();

            _self.style.update(_self.css, null, "#spltr-" + elementUUID, {'height': spacerDefaultHeight});

            app.FrontEndEditor.utils.setAnimation(newElement, 'animated fadeInDown');
            rowPanel[isAppendAfter ? 'after' : 'before'](newElement);

            newElement.addClass('v-split grid-block no-fixed-container fee-widget-row fee-widget-spacer');
            commandTemplate.addRow(newElement);
            //currentScope.addEditorCommandBlock(newElement);
            currentScope.insertOverlay();
            _self.events.save();
        },
        addMultiColumn: function (activeSection, columnType) {

            var rowPanel = activeSection.closest('.fee-widget-row');
            var isAppendAfter = activeSection.hasClass('fee-after') || activeSection.parent('.fee-after').length;

            var currentScope = this;
            var totalColumn = columnType === 'twoColumn' ? 2 : 3;
            var classPrefixName = 'no-fixed-';
            var x_width = 100 / totalColumn;

            var newElement = $('<div/>').attr("id", "spltr-" + bm.getUUID());

            newElement.empty();
            for (var columnIndex = 0; columnIndex < totalColumn; columnIndex++) {
                var columnUUID = bm.getUUID();
                var columnClassName = classPrefixName + (columnIndex === 0 ? "left" : "right") + (" col-" + columnIndex);

                var columnDom = $("<div class='" + columnClassName + " grid-block fee-widget-column' id='spltr-" + columnUUID + "'><div class=\"fee-widget-content\"></div></div>");
                newElement.append(columnDom);
                columnDom.append(currentScope.addOverlay());
                _self.style.update(_self.css, null, "#spltr-" + columnUUID, {'width': x_width + "%"});
            }

            app.FrontEndEditor.utils.setAnimation(newElement, 'animated fadeInDown');
            rowPanel[isAppendAfter ? 'after' : 'before'](newElement);
            newElement.addClass('v-split grid-block no-fixed-container fee-widget-row');
            currentScope.addEditorCommandBlock(newElement);
            currentScope.insertOverlay();
        },
        disableEditor: function () {
            _self.pageBody.find('.fee-widget-chooser,.fee-widget-command,.bmui-resize-handle,.fee-overlay,.fee-border-overlay, .fee-widget-selected-mask, .fee-add-content').remove();
            _self.pageBody.find('.widget').removeClass('bmui-draggable').removeClass('fee-widget-selected');
            _self.pageBody.find(".fee-widget-selected-container").removeClass("fee-widget-selected-container");
            _self.pageBody.find(".parent-elements").removeClass("parent-elements");
            _self.pageBody.find(".child-widgets").removeClass("child-widgets");
            _self.pageBody.find(".widget").css("border", "0");
            _self.pageBody.off('click mousedown.unselect mouseover mousemove');
            _self.pageBody.find(".edit-selection-overlay").remove();
            _self.pageBody.find(".grid-block").css({
                margin: "0", backgroundColor: "none", border: "0"
            });

            _self.pageBody.find('.grid-block').removeClass('fee-widget-row fee-widget-column fee-widget-row-active fee-widget-column-active fee-active-state fee-widget-selected-container');
            _self.pageBody.find('.widget').filter(".fee-overlay,.fee-border-overlay,.fee-widget-chooser,.fee-widget-command,.fee-after,.fee-before,.bmui-resize-handle,.fee-resize-info,.bmui-sortable-placeholder,.fee-add-content,.fee-menu-bar,.fee-floating-editor-menu").replaceWith("");
            _self.pageBody.removeClass("fee");

            //_self.portlet.destroySortable();
        },
        initEditSelectionOverlay: function (currentWidget) {
            var selfScope = this;
            var existCommandPanel = currentWidget.find('.fee-widget-menu');
            if (existCommandPanel.length) {
                existCommandPanel.show();
                this.showHideEditSelectionMenu(existCommandPanel);
            } else {
                existCommandPanel = template.widgetEditCommandPanel.clone();
                currentWidget.append(existCommandPanel);
                this.showHideEditSelectionMenu(existCommandPanel);
            }
            currentWidget.closest('.grid-block').find('.fee-overlay').hide();
            var widgetUUID = currentWidget.attr("id").substring(3);
            if (!currentWidget.is('[new-widget]') && !_self.cachedWidgetData[widgetUUID]) {
                _self.events.loadSerializeConfig(currentWidget, widgetUUID);
            }
            currentWidget.addClass('fee-widget-selected');

            currentWidget.after('<div class="fee-widget-selected-mask"></div>').addClass("animated fadeIn");

            pageBody.addClass("fee-widget-selected-body");
            currentWidget.closest(".grid-block").addClass("fee-widget-selected-container");

            var isColumn = currentWidget.parents('.fee-widget-column').length;
            if(isColumn){
                currentWidget.closest(".fee-widget-row").addClass("fee-widget-selected-container-column");
            }

            var rowBackgroudColor = currentWidget.closest(".fee-widget-row").css('backgroundColor');
            var columnBackgroudColor = currentWidget.closest(".fee-widget-column").css('backgroundColor');


            if(columnBackgroudColor=="rgba(0, 0, 0, 0)"){
                currentWidget.css('backgroundColor', rowBackgroudColor);
            }else{
                currentWidget.css('backgroundColor', columnBackgroudColor);
            }

        },
        showHideEditSelectionMenu: function (widgetMenuPanel) {
            widgetMenuPanel.find('.fee-options').addClass('fee-menu-close');
        },
        initEditHeaderSelectionOverlay: function (currentWidget) {
            var headerCommandPanel = currentWidget.find('.fee-header-footer-control-menu');
            var widgetType = currentWidget.attr("widget-type");
            if (headerCommandPanel.length) {
                headerCommandPanel.show();
            } else {
                headerCommandPanel = template.widgetHeaderFooterCommandPanel.clone();
                currentWidget.append(headerCommandPanel);
            }

            if(widgetType === "storeLogo" || widgetType === "navigation"){
                headerCommandPanel.find(".fee-menu-item").hide();
                headerCommandPanel.find(".fee-menu-item").eq(0).show();
                headerCommandPanel.find(".fee-menu-item").eq(1).show();
            }

            currentWidget.find('.fee-overlay').hide();
            var widgetUUID = currentWidget.attr("id").substring(3);
            if (!currentWidget.is('[new-widget]') && !_self.cachedWidgetData[widgetUUID]) {
                _self.events.loadSerializeConfig(currentWidget, widgetUUID);
            }
            currentWidget.addClass('fee-widget-selected');

            currentWidget.after('<div class="fee-widget-selected-mask"></div>');
            pageBody.addClass("fee-widget-selected-body");

            var widgetTopOffset = currentWidget.offset().top;
            if(widgetTopOffset<50){
                currentWidget.find(".fee-header-footer-control-menu").addClass("fee-menu-position");
            }
        },
        hideEditSelectionOverlay: function () {
            pageBody.find('.fee-widget-selected-mask').remove();

            var selectedWidget = $(".fee-widget-selected");

            if (selectedWidget.length > 0) {

                if (selectedWidget.closest(".header").length > 0 || selectedWidget.closest(".footer").length > 0) {
                    selectedWidget.find('.fee-overlay').show();
                    var headerCommandPanel = selectedWidget.find('.fee-header-footer-control-menu');
                    if (headerCommandPanel) {
                        headerCommandPanel.hide();
                    }
                }

                selectedWidget.closest('.grid-block').find('.fee-overlay').show();
                selectedWidget.removeClass('fee-widget-selected');

                selectedWidget.removeAttr("style");

                pageBody.removeClass("fee-widget-selected-body");


                selectedWidget.closest(".grid-block").removeClass("fee-widget-selected-container");
                var widgetMenuPanel = selectedWidget.find('.fee-widget-menu');
                if (widgetMenuPanel) {
                    widgetMenuPanel.find('.fee-options').removeClass('fee-menu-close');
                    widgetMenuPanel.hide();
                }

                if (_self.simpleEditorInstance) {
                    _self.simpleEditorInstance.destroy(selectedWidget);
                }
            }

            /*if (_self.portlet)
                _self.portlet.restoreSortable(true);*/
        },
        setColumnAsEqualHeight: function (parentEl) {
            var iterateElements = parentEl ? [parentEl] : _self.pageBody.find(".fee-widget-row");
            $.each(iterateElements, function () {
                var columns = $(this).find(".fee-widget-column");
                var maxHeight = 0;
                columns.each(function () {
                    $(this).removeAttr("style");
                    var currentColumnHeight = $(this).outerHeight();
                    if (maxHeight < currentColumnHeight) {
                        maxHeight = currentColumnHeight;
                    }
                });
                columns.each(function () {
                    $(this).css('height', maxHeight)
                });
            });
        }
    }
});