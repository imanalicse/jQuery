app.FrontEndEditor.prototype.column = (function () {
    var _self = this;

    var rowPanel;
    var parentElement;
    var appendToElement;
    var floatingMenuElement;
    var elementUUID;
    var actionGroupElement;
    var isParentElementLeftColumn = false;
    var totalColumn;
    var columnIndex;
    // object instances
    var cssParser;
    var rowColumnCssInstance;
    var rowColumnHeaderInstance;
    var styleBuilder = this.styleBuilder();
    var layoutBuilder = this.layoutBuilder();
    var eventBuilder = this.eventBuilder();

    var defaults = {
        menuClass: "fee-floating-column",
        openAnimationClass: "animated fadeIn",
        closeAnimationClass: "animated fadeOut",
        moveLeftAnimationClass: "animated fadeInRight",
        moveRightAnimationClass: "animated fadeInLeft",
        leftAnimationClass: "growLeftToRight",
        rightAnimationClass: "growRightToLeft",
        activeRowClass: "fee-widget-row-active",
        activeColumnClass: "fee-widget-column-active",
        animationTimeout: 300,
        template: "<div class=\"fee-floating-editor-menu\">\n" +
        "    <div class=\"fee-fm-header\">\n" +
        "        <div class=\"fee-fm-title\">Column <span class=\"fee-fm-counter\"></span></div>\n" +
        "        <div class=\"fee-fm-action fee-header-action\">\n" +
        "            <span class=\"fee-icon fee-icon-drag fee-fm-draggable\"></span>\n" +
        "            <span class=\"fee-icon fee-icon-cross fee-fm-close\" data-action=\"close\"></span>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <div class=\"fee-fm-content\">\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-action-group\">\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"moveLeft\"><span class=\"fee-icon fee-icon-left\"></span></button>\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"moveRight\"><span class=\"fee-icon fee-icon-right\"></span></button>\n" +
//        "                    <button class=\"fee-fm-button\" data-action=\"copy\"><span class=\"fee-icon fee-icon-copy\"></span></button>\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"remove\"><span class=\"fee-icon fee-icon-trash\"></span></button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-padding\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-label\">Padding(T, R, B, L)</div>\n" +
        "                <div class=\"fee-fm-input-row fee-padding-input\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"top\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"right\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"bottom\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"left\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-background\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-label\">Background</div>\n" +
        "                <div class=\"fee-fm-input-row fee-fm-radio-row fee-background-type\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <label>\n" +
        "                            <input type=\"radio\" name=\"background\" checked value=\"none\">\n" +
        "                            <span>None</span>\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <label>\n" +
        "                            <input type=\"radio\" name=\"background\" value=\"color\">\n" +
        "                            <span>Color</span>\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <label>\n" +
        "                            <input type=\"radio\" name=\"background\" value=\"image\">\n" +
        "                            <span>Image</span>\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-input-row fee-background-input-area\">\n" +
        "                    <div class=\"fee-fm-input fee-color-input-area\" style=\"display:none\">\n" +
        "                        <label>\n" +
        "                            <span class=\"fee-fm-color-picker\">&nbsp;</span>\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input fee-image-input-area\"  style=\"display:none\">\n" +
        "                        <label>\n" +
        "                            <input type=\"file\" class=\"fee-background-upload-field\">\n" +
        "                            <span>Click here to upload</span>\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"fee-fm-block-content fee-position-input-area\"  style=\"display:none\">\n" +
        "                <div class=\"fee-fm-input-row\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <div class=\"fee-fm-label\">Position</div>\n" +
        "                        <select class=\"fee-background-position\">\n" +
        "                            <option value=\"left top\">Left Top</option>\n" +
        "                            <option value=\"left bottom\">Left Bottom</option>\n" +
        "                            <option value=\"center top\">Center Top</option>\n" +
        "                            <option value=\"center bottom\">Center Bottom</option>\n" +
        "                            <option value=\"right top\">Right Top</option>\n" +
        "                            <option value=\"right bottom\">Right Bottom</option>\n" +
        "                            <option value=\"center\" selected>Fit</option>\n" +
        "                        </select>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"fee-fm-block-content fee-position-input-area\"  style=\"display:none\">\n" +
        "                <div class=\"fee-fm-input-row\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <div class=\"fee-fm-label\">Repeat</div>\n" +
        "                        <select class=\"fee-background-repeat\">\n" +
        "                            <option value=\"repeat\">Repeat</option>\n" +
        "                            <option value=\"repeat-x\">Repeat-X</option>\n" +
        "                            <option value=\"repeat-y\">Repeat-Y</option>\n" +
        "                            <option value=\"no-repeat\" selected>No Repeat</option>\n" +
        "                        </select>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"
    };

    var isLeftColumn = function (element) {
        return element.hasClass('no-fixed-left');
    };


    var actionEvents = {
        moveLeft: function () {
            this._move("left");
        },
        moveRight: function () {
            this._move("right");
        },
        _move: function (type) {

            if (type === "left") {
                var leftPanel = rowPanel.find('.fee-widget-column').eq(columnIndex-1);
                var rightPanel = parentElement;
            }else{
                var leftPanel = parentElement;
                var rightPanel = rowPanel.find('.fee-widget-column').eq(columnIndex+1);
            }

            var leftClonePanel = leftPanel.clone(true);
            var rightClonePanel = rightPanel.clone(true);
            rightClonePanel.find("." + defaults.menuClass).remove();
            leftClonePanel.find("." + defaults.menuClass).remove();
            leftPanel.hide();
            rightPanel.hide();

            rowPanel.find('.fee-widget-column').eq(columnIndex).before(rightClonePanel.addClass(defaults.moveLeftAnimationClass));
            rowPanel.find('.fee-widget-column').eq(columnIndex).after(leftClonePanel.addClass(defaults.moveRightAnimationClass));

            setTimeout(function () {
                leftPanel.remove();
                rightPanel.remove();

                rightClonePanel.removeClass(defaults.moveLeftAnimationClass);
                leftClonePanel.removeClass(defaults.moveRightAnimationClass);

                rowPanel.find('.' + defaults.activeColumnClass).removeClass(defaults.activeColumnClass);
                destroy();
                layoutBuilder.commandTemplate.updateColumnCounter(rowPanel);
                eventBuilder.save();
            }, defaults.animationTimeout);
        },
        copy: function () {
            var parentRowPanel = parentElement.closest('.fee-widget-row');
            var newUuid = bm.getUUID();

            var leftCloneParentElement = parentElement.clone();
            leftCloneParentElement.find('.fee-floating-editor-menu').remove();
            var cloneParentElement = parentElement.clone();
            cloneParentElement.find('.fee-floating-editor-menu').remove();
            var rowContainer = layoutBuilder.getMultiColumnContainer();
            rowContainer.attr("id", "spltr-" + newUuid);
            rowContainer.addClass(isParentElementLeftColumn ? defaults.leftAnimationClass : defaults.rightAnimationClass);
            var rowContainerCssParser = app.FrontEndEditor.utils.getCssParser($("#style-store-" + newUuid));

            cloneParentElement.find('.widget').each(function () {
                var currentWidget = $(this);
                var prevUuid = app.FrontEndEditor.utils.getUuid(currentWidget);
                var newUuid = bm.getUUID();
                app.FrontEndEditor.utils.copyCss(newUuid, currentWidget);
                _self.cachedWidgets[newUuid] = _self.cachedWidgets[prevUuid];
            });
            var classSuffix = isParentElementLeftColumn ? 'left' : 'right';
            var alternateClassSuffix = isParentElementLeftColumn ? 'right' : 'left';
            rowContainer.addClass('no-fixed-' + classSuffix);
            rowContainer.find('.no-fixed-' + classSuffix).append(leftCloneParentElement.html());
            rowContainer.find('.no-fixed-' + alternateClassSuffix).append(cloneParentElement.html());
            /// alternate column css update
            var relativeElement = parentRowPanel.find('.fee-widget-column').not(parentElement);
            var relativeElementUuid = app.FrontEndEditor.utils.getUuid(relativeElement);
            relativeElement.addClass(isParentElementLeftColumn ? defaults.rightAnimationClass : defaults.leftAnimationClass);
            var relativeElementCssParser = app.FrontEndEditor.utils.getCssParser($("#style-store-" + relativeElementUuid));
            relativeElementCssParser.removeAttribute("#spltr-" + relativeElementUuid, "width");
            styleBuilder.update(relativeElementCssParser, relativeElementUuid, "#spltr-" + relativeElementUuid, {width: (100 / 3) + '%;'});
            // update main panel after alternate animation
            setTimeout(function () {
                styleBuilder.update(rowContainerCssParser, newUuid, "#spltr-" + newUuid, {width: (2 * 100 / 3) + '%;'});
                parentElement.replaceWith(rowContainer);
                layoutBuilder.setColumnAsEqualHeight(parentRowPanel);
                rowContainer.removeClass('fee-active-state fee-widget-column');
                rowContainer.find('.' + defaults.activeColumnClass).removeClass(defaults.activeColumnClass);
                rowContainer.removeClass(isParentElementLeftColumn ? defaults.leftAnimationClass : defaults.rightAnimationClass);
                relativeElement.removeClass(isParentElementLeftColumn ? defaults.rightAnimationClass : defaults.leftAnimationClass);
                layoutBuilder.commandTemplate.updateColumnCounter(parentRowPanel);
                destroy();
                _self.events.save();
            }, defaults.animationTimeout);

        },
        remove: function () {
            var parentRowPanel = parentElement.closest('.fee-widget-row');
            bm.confirm($.i18n.prop("confirm.delete", 'widget'), function () {
                deleteColumn(parentRowPanel, parentElement);

                function deleteColumn(parentRowPanel, parentElement) {
                    var columnElements = parentElement.parent().find('.fee-widget-column');
                    var currentElementUuid = app.FrontEndEditor.utils.getUuid(parentElement);

                    isParentElementLeftColumn = parentElement.next().hasClass("fee-widget-column");
                    var relativeElements = columnElements.filter(function(index, elem) {
                            return app.FrontEndEditor.utils.getUuid($(elem)) !== currentElementUuid;
                        }
                    );

                    var columnsCount = relativeElements.length;
                    parentElement.remove();

                    var updatedRelativeElements = relativeElements.map(function(index, elem) {
                        var  relativeElement = updateElementWidth($(elem), (100 / columnsCount) + '%');
                        if(columnsCount === 1)
                        {
                            relativeElement.addClass(!isParentElementLeftColumn ? defaults.leftAnimationClass : defaults.rightAnimationClass);
                        }
                        else {
                            relativeElement.addClass(index % 2 ? defaults.leftAnimationClass : defaults.rightAnimationClass);
                        }

                        return relativeElement;
                    });

                    setTimeout(function () {
                        updatedRelativeElements.map(function(index, elem) {
                            if(columnsCount === 1)
                            {
                                elem.removeClass(!isParentElementLeftColumn ? defaults.leftAnimationClass : defaults.rightAnimationClass);
                            }
                            else {
                                elem.removeClass(index % 2 ? defaults.leftAnimationClass : defaults.rightAnimationClass);
                            }

                            return elem;
                        });

                        layoutBuilder.commandTemplate.updateColumnCounter(parentRowPanel);
                        _self.events.save();
                    }, defaults.animationTimeout);
                }
                
               function updateElementWidth(element, value) {
                   var elementUuid = app.FrontEndEditor.utils.getUuid(element);
                   var elementCssParser = app.FrontEndEditor.utils.getCssParser($("#style-store-" + elementUuid));
                   elementCssParser.removeAttribute("#spltr-" + elementUuid, "width");
                   _self.style.update(_self.css, null, "#spltr-" + elementUuid, {"width": value});
                   return element;
               }
            }, true);
        }
    };

    var destroy = function () {
        var menuElement = $('.' + defaults.menuClass);
        menuElement.addClass(defaults.closeAnimationClass);
        setTimeout(function () {
            menuElement.find('.fee-fm-content').scrollbar("destroy");
            menuElement.remove();
        }, defaults.animationTimeout);

        parentElement.removeClass(defaults.activeColumnClass);
        parentElement.parent().removeClass(defaults.activeRowClass);
        rowColumnCssInstance.destroyColorPicker();
    };

    var postInit = {
        initVars: function () {
            isParentElementLeftColumn = isLeftColumn(parentElement);
            floatingMenuElement = $(defaults.template).addClass(defaults.menuClass);
            actionGroupElement = floatingMenuElement.find('.fee-fm-actions');
            elementUUID = app.FrontEndEditor.utils.getUuid(parentElement);
            cssParser = _self.css;

            rowPanel = parentElement.closest('.fee-widget-row');
            totalColumn = rowPanel.find(".fee-widget-column").length;
            columnIndex = rowPanel.find(".fee-widget-column").index(parentElement);

            rowColumnCssInstance = _self.rowColumnCss({
                parentElement: parentElement,
                floatingMenuElement: floatingMenuElement,
                cssParser: cssParser,
                elementUUID: elementUUID
            });
            rowColumnHeaderInstance = _self.rowColumnHeader({
                parentElement: parentElement,
                floatingMenuElement: floatingMenuElement,
                openAnimationClass: defaults.openAnimationClass,
                closeAnimationClass: defaults.closeAnimationClass,
                activeRowClass: defaults.activeRowClass,
                activeColumnClass: defaults.activeColumnClass,
                animationTimeout: defaults.animationTimeout
            });
        },
        render: function () {
            appendToElement.append(floatingMenuElement.addClass(defaults.openAnimationClass));
            setTimeout(function () {
                floatingMenuElement.removeClass(defaults.openAnimationClass);
            }, defaults.animationTimeout);

            if (!columnIndex) {
                actionGroupElement.find("[data-action=moveLeft]").attr("disabled", true).addClass("fee-fm-disabled");
            }
            if ((columnIndex + 1) === totalColumn) {
                actionGroupElement.find("[data-action=moveRight]").attr("disabled", true).addClass("fee-fm-disabled");
            }
            /*if (parentElement.closest('.fee-widget-row').find(".no-fixed-left,.no-fixed-right").length < 1 || parentElement.closest('.fee-widget-row').find('.fee-widget-column').length > 2) {
                actionGroupElement.find("[data-action=copy]").attr("disabled", true).addClass("fee-fm-disabled");
            }*/

            var fee_counter = parentElement.find(".fee-menu-bar").find(".fee-counter").html();
            floatingMenuElement.find(".fee-fm-counter").html(fee_counter);
        },
        _bind: function () {
            actionGroupElement.delegate("button", "click", function () {
                var dataAction = $(this).attr("data-action");
                actionEvents[dataAction].apply(actionEvents);
            });
            floatingMenuElement.delegate(".fee-header-action", "click", function (ev) {
                var dataAction = $(ev.target).attr("data-action");
                rowColumnHeaderInstance[dataAction].apply(rowColumnHeaderInstance);
            });
            floatingMenuElement.find(".fee-padding-input input").on("change", function () {
                rowColumnCssInstance['padding'].apply(rowColumnCssInstance);
            });
            floatingMenuElement.find(".fee-background-type input").on("change", function () {
                var backgroundType = $(this).val();
                floatingMenuElement.find(".fee-background-input-area .fee-fm-input,.fee-position-input-area").hide();
                floatingMenuElement.find(".fee-" + backgroundType + "-input-area").show();
                if (backgroundType === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.NONE) {
                    rowColumnCssInstance['background'].apply(rowColumnCssInstance, [app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.NONE]);
                } else if (backgroundType === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.COLOR) {
                    //rowColumnCssInstance.triggerColorPicker();
                }
                if (backgroundType === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.IMAGE) {
                    floatingMenuElement.find(".fee-position-input-area").show();
                }
            });
            floatingMenuElement.find(".fee-background-position").on("change", function () {
                rowColumnCssInstance['backgroundPosition'].apply(rowColumnCssInstance, [$(this).val()]);
            });
            floatingMenuElement.find(".fee-background-repeat").on("change", function () {
                rowColumnCssInstance['backgroundRepeat'].apply(rowColumnCssInstance, [$(this).val()]);
            });

            floatingMenuElement.find('.fee-fm-content').scrollbar();

            rowColumnHeaderInstance.drag();
            rowColumnCssInstance.bindColorPicker();
            rowColumnCssInstance.bindImageUpload();
        },
        _loadInitialStyle: function () {
            this.initializePadding();
            this.initializeBackground();
        },
        initializePadding: function () {
            $.each(['top', 'right', 'bottom', 'left'], function (index, item) {
                var cssAttributeValue = cssParser.getAttribute("#spltr-" + elementUUID, "padding-" + item);
                if (cssAttributeValue) {
                    cssAttributeValue = cssAttributeValue.replace("px", "");
                    floatingMenuElement.find(".fee-padding-input input[data-action=" + item + "]").val(cssAttributeValue);
                }
            });
        },
        initializeBackground: function () {

            var backgroundColor = cssParser.getAttribute("#spltr-" + elementUUID, 'background-color');
            var backgroundImage = cssParser.getAttribute("#spltr-" + elementUUID, 'background-image');
            if (backgroundColor &&  backgroundColor !=='none') {
                floatingMenuElement.find(".fee-background-type input[value=\"color\"]").prop("checked", true).trigger('change');
                floatingMenuElement.find(".fee-fm-color-picker").ColorPickerSetColor(backgroundColor);
            } else if(backgroundImage  &&  backgroundImage !=='none') {
                floatingMenuElement.find(".fee-background-type input[value=\"image\"]").prop("checked", true).trigger('change');
            }else{
                floatingMenuElement.find(".fee-background-type input[value=\"none\"]").prop("checked", true).trigger('change');
            }
        }
    };

    return {
        init: function (_appendToElement, _parentElement, config) {
            parentElement = _parentElement;
            appendToElement = _appendToElement;
            if (config) {
                $.extend(defaults, config, true);
            }

            parentElement.addClass(defaults.activeColumnClass);
            parentElement.parent().addClass(defaults.activeRowClass);

            postInit.initVars();
            postInit.render();
            postInit._bind();
            postInit._loadInitialStyle();
            this.menuElement = floatingMenuElement;
            return this;
        },
        destroy: function () {
            destroy();
        }
    }
});