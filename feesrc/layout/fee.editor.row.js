app.FrontEndEditor.prototype.row = (function () {
    var _self = this;

    var parentElement;
    var appendToElement;
    var elementUUID;
    var floatingMenuElement;
    var actionGroupElement;
    // object instances
    var cssParser;
    var rowColumnCssInstance;
    var rowColumnHeaderInstance;
    var viewPortWidth;

    var defaults = {
        menuClass: "fee-floating-row",
        openAnimationClass: "animated fadeIn",
        closeAnimationClass: "animated fadeOut",
        removeAnimationClass: "collapseDownToTop",
        moveUpAnimationClass: "animated fadeInDown",
        moveDownAnimationClass: "animated fadeInUp",
        activeRowClass: "fee-widget-row-active",
        animationTimeout: 300,
        viewPortMinWidth: 1170,
        template: "<div class=\"fee-floating-editor-menu\">\n" +
        "    <div class=\"fee-fm-header\">\n" +
        "        <div class=\"fee-fm-title\">Row <span class=\"fee-fm-counter\"></span></div>\n" +
        "        <div class=\"fee-fm-action fee-header-action\">\n" +
        "            <span class=\"fee-icon fee-icon-drag fee-fm-draggable\"></span>\n" +
        "            <span class=\"fee-icon fee-icon-cross fee-fm-close\" data-action=\"close\"></span>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <div class=\"fee-fm-content\">\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-action-group\">\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"moveUp\"><span class=\"fee-icon fee-icon-up\"></span></button>\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"moveDown\"><span class=\"fee-icon fee-icon-down\"></span></button>\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"copy\"><span class=\"fee-icon fee-icon-copy\"></span></button>\n" +
        "                    <button class=\"fee-fm-button\" data-action=\"remove\"><span class=\"fee-icon fee-icon-trash\"></span></button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-row-width\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-label\">Row width</div>\n" +
        "                <div class=\"fee-fm-size-button-container fee-fm-row-width-action\">\n" +
        "                    <button class=\"fee-fm-button fee-fm-fixed fee-fm-active\" data-width-type=\"fixed\">Fixed</button>\n" +
        "                    <button class=\"fee-fm-button fee-fm-full\" data-width-type=\"full\">Full</button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-content-width\" style=\"display:none\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-label\">Content width</div>\n" +
        "                <div class=\"fee-fm-size-button-container fee-fm-content-width-action\">\n" +
        "                    <button class=\"fee-fm-button fee-fm-fixed\" data-width-type=\"fixed\">Fixed</button>\n" +
        "                    <button class=\"fee-fm-button fee-fm-full fee-fm-active\" data-width-type=\"full\">Full</button>\n" +
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
        "                       <input type=\"text\" data-action=\"right\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"bottom\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"left\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n"+
        "        <div class=\"fee-fm-menu-block fee-fm-height\" style=\"display:none\">\n" +
        "            <div class=\"fee-fm-block-content\">\n" +
        "                <div class=\"fee-fm-label\">Height</div>\n" +
        "                <div class=\"fee-fm-input-row fee-height-input\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <input type=\"text\" data-action=\"height\" placeholder=\"0\">\n" +
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
        "                     <div class=\"fee-fm-input\">\n" +
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
        "                      <div class=\"fee-fm-input\">\n" +
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

    var actionEvents = {
        moveUp: function () {
            this._move("up");
        },
        moveDown: function () {
            this._move("down");
        },
        _move: function (type) {
            var topPanel = parentElement.closest('.v-split-container,.page-content,.widget-container');
            var firstPanel = parentElement.closest('.fee-widget-row');
            var secondPanel = type === "up" ? firstPanel.prev() : firstPanel.next();
            var firstClonePanel = firstPanel.clone(true);
            var secondClonePanel = secondPanel.clone(true);
            firstClonePanel.find("." + defaults.menuClass).remove();
            secondClonePanel.find("." + defaults.menuClass).remove();
            firstPanel.hide();
            secondPanel.hide();
            firstClonePanel.addClass('fee-first-move-panel').removeClass('no-fixed-down no-fixed-up');
            secondClonePanel.addClass('fee-second-move-panel').removeClass('no-fixed-down no-fixed-up');
            if (type === "up") {
                secondPanel.replaceWith(firstClonePanel.addClass(defaults.moveDownAnimationClass));
                topPanel.find('.fee-first-move-panel').after(secondClonePanel.addClass(defaults.moveUpAnimationClass));
            } else {
                secondPanel.replaceWith(firstClonePanel.addClass(defaults.moveUpAnimationClass));
                topPanel.find('.fee-first-move-panel').before(secondClonePanel.addClass(defaults.moveDownAnimationClass));
            }

            setTimeout(function () {
                firstPanel.remove();
                secondPanel.remove();
                if (type === "up") {
                    secondClonePanel.removeClass(defaults.moveUpAnimationClass);
                    firstClonePanel.removeClass(defaults.moveDownAnimationClass);
                } else {
                    secondClonePanel.removeClass(defaults.moveDownAnimationClass);
                    firstClonePanel.removeClass(defaults.moveUpAnimationClass);
                }
                if (topPanel.find('.fee-first-move-panel').prev('.fee-widget-row').length === 0) {
                    firstClonePanel.addClass('no-fixed-up')
                } else if (topPanel.find('.fee-first-move-panel').next('.fee-widget-row').length === 0) {
                    firstClonePanel.addClass('no-fixed-down')
                }
                if (topPanel.find('.fee-second-move-panel').prev('.fee-widget-row').length === 0) {
                    secondClonePanel.addClass('no-fixed-up')
                } else if (topPanel.find('.fee-second-move-panel').next('.fee-widget-row').length === 0) {
                    secondClonePanel.addClass('no-fixed-down')
                }
                firstClonePanel.removeClass('fee-first-move-panel');
                secondClonePanel.removeClass('fee-second-move-panel');
                destroy();
                _self.events.save();
            }, defaults.animationTimeout);
        },
        copy: function () {
            var newUuid = bm.getUUID();
            var cloneParentElement = parentElement.clone();
            cloneParentElement.find('.fee-floating-editor-menu').remove();
            cloneParentElement.removeClass('fee-active-state fee-widget-row-active');
            var preSpacerHeight = cssParser.getAttribute("#spltr-" + elementUUID, "height");
            cloneParentElement.attr('id', 'spltr-' + newUuid);
            _self.style.update(_self.css, null, "#spltr-" + newUuid, {'height':preSpacerHeight});

            cloneParentElement.removeClass('no-fixed-up no-fixed-down');
            if (!parentElement.next().hasClass('fee-widget-row')) {
                cloneParentElement.addClass('no-fixed-down');
                parentElement.removeClass('no-fixed-up no-fixed-down');
            }
            app.FrontEndEditor.utils.copyCss(newUuid, parentElement);
            cloneParentElement.find('.fee-widget-column').each(function () {
                var newUuid = bm.getUUID();
                app.FrontEndEditor.utils.copyCss(newUuid, $(this));
                $(this).attr('id', 'spltr-' + newUuid);
            });
            cloneParentElement.find('.widget').each(function () {
                var currentWidget = $(this);
                var prevUuid = app.FrontEndEditor.utils.getUuid(currentWidget);
                var newUuid = bm.getUUID();
                app.FrontEndEditor.utils.copyCss(newUuid, currentWidget);
                _self.cachedWidgets[newUuid] = _self.cachedWidgets[prevUuid];
                $(this).attr('id', 'wi-' + newUuid).attr('new-widget', true).removeAttr('widget-id');
            });
            cloneParentElement.addClass(defaults.moveUpAnimationClass);
            parentElement.after(cloneParentElement);
            setTimeout(function () {
                cloneParentElement.removeClass(defaults.moveUpAnimationClass);
                destroy();
                _self.events.save();
            }, defaults.animationTimeout);
        },
        remove: function () {
            bm.confirm($.i18n.prop("confirm.delete", 'widget'), function () {
                parentElement.addClass(defaults.removeAnimationClass);
                setTimeout(function () {
                    parentElement.find('.widget').each(function () {
                        _self.layout.widget.remove($(this), true);
                    });
                    parentElement.remove();
                    _self.events.save();
                }, defaults.animationTimeout);
            }, true);
        }
    };

    var widthEvents = {
        row: function (width_type) {
            parentElement.removeClass("fee-fixed-width-row fee-full-width-row").addClass("fee-" + width_type + "-width-row");
            switch (width_type){
                case 'full':
                    _self.style.update(_self.css, null, "#spltr-" + elementUUID, {'max-width':"100%", 'width':"auto"});
                    break;
                case 'fixed':
                    _self.style.removeRule(_self.css, null, "#spltr-" + elementUUID, true);
                    break;
            }
            _self.events.save();
        },
        // removeRowPadding: function(){
        //     _self.style.update(_self.css, null, "#spltr-" + elementUUID, {'padding-left':"0px", 'padding-right':"0px"})
        // },
        content: function (width_type) {
            // if(width_type === "fixed"){
            //     if(viewPortWidth < defaults.viewPortMinWidth ){
            //         this.removeRowPadding();
            //     }else{
            //         _self.style.update(_self.css, null, "#spltr-" + elementUUID, {'padding-left':leftRightFixedPadding+"px", 'padding-right':leftRightFixedPadding+"px"});
            //     }
            // }else{
            //     this.removeRowPadding();
            // }

            parentElement.removeClass("fee-fixed-width-content fee-full-width-content").addClass("fee-" + width_type + "-width-content");
            _self.events.save();
        }
    };

    var destroy = function () {
        var menuElement = $('.' + defaults.menuClass);
        menuElement.addClass(defaults.closeAnimationClass);
        setTimeout(function () {
            menuElement.find('.fee-fm-content').scrollbar("destroy");
            menuElement.remove();
        }, defaults.animationTimeout);
        parentElement.removeClass(defaults.activeRowClass);
        rowColumnCssInstance.destroyColorPicker();
    };


    var postInit = {
        initVars: function () {
            floatingMenuElement = $(defaults.template).addClass(defaults.menuClass);
            actionGroupElement = floatingMenuElement.find('.fee-fm-actions');
            elementUUID = app.FrontEndEditor.utils.getUuid(parentElement);
            cssParser = _self.css;
            viewPortWidth = _self.window.width();

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
                animationTimeout: defaults.animationTimeout
            });
        },

        render: function () {
            appendToElement.append(floatingMenuElement.addClass(defaults.openAnimationClass));
            setTimeout(function () {
                floatingMenuElement.removeClass(defaults.openAnimationClass);
            }, defaults.animationTimeout);
            if (parentElement.hasClass("no-fixed-up") || parentElement.prev('.fee-widget-row').length < 1) {
                actionGroupElement.find("[data-action=moveUp]").attr("disabled", true).addClass("fee-fm-disabled");
            }
            if (parentElement.hasClass("no-fixed-down") || parentElement.next('.fee-widget-row').length < 1) {
                actionGroupElement.find("[data-action=moveDown]").attr("disabled", true).addClass("fee-fm-disabled");
            }
            var fee_counter = parentElement.find(".fee-menu-bar").find(".fee-counter").html();
            floatingMenuElement.find(".fee-fm-counter").html(fee_counter);

            if(parentElement.hasClass('fee-widget-spacer')){
                floatingMenuElement.find(".fee-fm-background, .fee-fm-padding, .fee-fm-content-width, .fee-fm-row-width").hide();
                floatingMenuElement.find(".fee-fm-height").show();
            }

            var layout_id = _self.layout_id;

            if(layout_id == 11){ // Inner Page-Fixed
                floatingMenuElement.find(".fee-fm-row-width").hide();
            }

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

            floatingMenuElement.delegate(".fee-fm-row-width-action button", "click", function (ev) {
                floatingMenuElement.find(".fee-fm-row-width-action button").removeClass("fee-fm-active");
                $(this).addClass("fee-fm-active");
                var width_type = $(ev.target).attr("data-width-type");
                widthEvents['row'].apply(widthEvents, [width_type]);

                if (width_type === 'full') {
                    floatingMenuElement.find(".fee-fm-content-width").fadeIn();
                } else {
                    floatingMenuElement.find(".fee-fm-content-width").hide();
                }
            });

            floatingMenuElement.delegate(".fee-fm-content-width-action button", "click", function (ev) {
                floatingMenuElement.find(".fee-fm-content-width-action button").removeClass("fee-fm-active");
                $(this).addClass("fee-fm-active");
                 var width_type = $(ev.target).attr("data-width-type");
                 widthEvents['content'].apply(widthEvents, [width_type]);
            });

            floatingMenuElement.find(".fee-padding-input input").on("change", function () {
                rowColumnCssInstance['padding'].apply(rowColumnCssInstance);
            });

            floatingMenuElement.find(".fee-height-input input").on("keyup", function () {
                var spacerHeight = $(this).val();

                if(isNaN(spacerHeight) || spacerHeight < 10 ){
                    $(this).addClass('error');
                }else{
                    $(this).removeClass('error');
                    _self.style.update(_self.css, elementUUID, "#spltr-" + elementUUID, {'height':spacerHeight+"px"});
                    _self.events.save();
                }
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

            this.initializeRowWidth();
            this.initializeContentWidth();
            this.initializeConditionalWidth();
            this.initializePadding();
            this.initializeHeight();
            this.initializeBackground();
        },
        initializeRowWidth: function () {
            var rowWidthContainer = floatingMenuElement.find(".fee-fm-row-width");
            var contentWidthContainer = floatingMenuElement.find(".fee-fm-content-width");
            rowWidthContainer.find("button").removeClass("fee-fm-active");
            if($("#spltr-" + elementUUID).hasClass("fee-full-width-row")){
                rowWidthContainer.find("button[data-width-type=\"full\"]").addClass("fee-fm-active");
                contentWidthContainer.fadeIn();
            }else{
                rowWidthContainer.find("button[data-width-type=\"fixed\"]").addClass("fee-fm-active");
            }
        },
        initializeContentWidth: function () {
            var contentWidthContainer = floatingMenuElement.find(".fee-fm-content-width");
            contentWidthContainer.find("button").removeClass("fee-fm-active");
            if($("#spltr-" + elementUUID).hasClass("fee-fixed-width-content")){
                contentWidthContainer.find("button[data-width-type=\"fixed\"]").addClass("fee-fm-active");
            }else{
                contentWidthContainer.find("button[data-width-type=\"full\"]").addClass("fee-fm-active");
            }
        },
        initializeConditionalWidth: function () {
            var container = _self.pageBody.find('.body .widget-container');
            var containerWidth = container.width();
            if (containerWidth && (viewPortWidth !== containerWidth)) {
                floatingMenuElement.find('.fee-fm-row-width, .fee-fm-content-width').hide();
            }
        },
        initializePadding: function () {
            $.each(['top', 'right', 'bottom', 'left'], function (index, item) {
                var cssAttributeValue = cssParser.getAttribute("#spltr-" + elementUUID, "padding-" + item);
                if (cssAttributeValue) {
                    cssAttributeValue = parseInt(cssAttributeValue.replace("px", ""));
                    floatingMenuElement.find(".fee-padding-input input[data-action=" + item + "]").val(cssAttributeValue);
                }
            });
        },
        initializeHeight: function () {
            var cssAttributeValue = cssParser.getAttribute("#spltr-" + elementUUID, "height");
            if (cssAttributeValue) {
                cssAttributeValue = cssAttributeValue.replace("px", "");
                floatingMenuElement.find(".fee-height-input input[data-action=height]").val(cssAttributeValue);
            }
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

            parentElement.addClass(defaults.activeRowClass);

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