app.FrontEndEditor.floatingMenu = {
    COLUMN: 'column',
    ROW: 'row',
    BACKGROUND_TYPE: {
        NONE: 'none',
        COLOR: 'color',
        IMAGE: 'image'
    }
};

app.FrontEndEditor.prototype.rowColumnCss = (function (configs) {
    var _self = this;
    var defaults = {
        floatingMenuElement: undefined,
        parentElement: undefined,
        cssParser: new CssParser("").parse(),
        elementUUID: ''
    };
    $.extend(defaults, configs, true);

    var styleBuilder = this.styleBuilder();
    var layoutBuilder = this.layoutBuilder();

    return {
        padding: function () {
            var paddingCss = {};
            defaults.floatingMenuElement.find(".fee-padding-input input").each(function () {
                var dataAction = $(this).attr("data-action");
                var value = $.trim($(this).val());
                if (value) {
                    paddingCss['padding-' + dataAction] = value+"px";
                }
            });
            styleBuilder.update(defaults.cssParser, defaults.elementUUID, "#spltr-" + defaults.elementUUID, paddingCss);
            styleBuilder.update(defaults.cssParser, defaults.elementUUID, "#spltr-" + defaults.elementUUID + ":before", paddingCss);
            layoutBuilder.setColumnAsEqualHeight(defaults.parentElement.closest('.fee-widget-row'));
            _self.events.save();
        },

        background: function (type, value) {

            var selectedId =  "#spltr-" + defaults.elementUUID;
            var inlineElementIds = [];
            inlineElementIds.push(selectedId);
            if($(selectedId).find(".fee-widget-column").length){
                $(selectedId).find(".fee-widget-column").each(function (index, columnElement) {
                    var columnElementId = "#"+$(columnElement).attr("id");
                    var columnBackground = defaults.cssParser.getAttribute(columnElementId, "background-color");
                    if(columnBackground ==='none' || columnBackground === null){
                        columnBackground = defaults.cssParser.getAttribute(columnElementId, "background-image");
                    }
                    if(columnBackground ==='none' || columnBackground === null){
                        getWidgetIds(columnElementId);
                    }
                });
            }else{
                getWidgetIds(selectedId);
            }

            function getWidgetIds(seId) {
                $(seId).find(".widget").each(function (index, element) {
                    var elementId = "#"+$(element).attr("id");
                    inlineElementIds.push(elementId);
                });
            }

            $.each(inlineElementIds, function (index, eleId) {
                applyBackground(eleId);
            });

            function applyBackground(elementId) {
                var backgroundCss = {};
                defaults.cssParser.removeAttribute(elementId, "background-color");
                defaults.cssParser.removeAttribute(elementId, "background");
                defaults.cssParser.removeAttribute(elementId, "background-position");
                defaults.cssParser.removeAttribute(elementId, "background-size");
                if (type === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.COLOR) {
                    backgroundCss['background-color'] = "#" + value;
                } else if (type === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.IMAGE) {
                    var backgroundPosition = defaults.floatingMenuElement.find(".fee-background-position").val() || "0 100%";
                    backgroundCss['background-image'] = "url(" + value + ")";
                    if (backgroundPosition === 'center') {
                        backgroundCss['background-size'] = "cover";
                    }
                    backgroundCss['background-position'] = backgroundPosition;
                    backgroundCss['background-repeat'] = defaults.floatingMenuElement.find(".fee-background-repeat").val() || "no-repeat";
                }else if(type === app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.NONE){
                    backgroundCss['background-color'] = "none";
                    backgroundCss['background-image'] = "none";
                }

                if (!$.isEmptyObject(backgroundCss)) {
                    styleBuilder.update(defaults.cssParser, null, elementId, backgroundCss);
                }
            }
            _self.events.save();
        },

        backgroundPosition: function (value) {
            var backgroundCss = {};
            if (value === 'center') {
                backgroundCss['background-size'] = "cover";
            }
            backgroundCss['background-position'] = value;
            styleBuilder.update(defaults.cssParser, defaults.elementUUID, "#spltr-" + defaults.elementUUID, backgroundCss);
            _self.events.save();
        },

        backgroundRepeat: function (value) {
            styleBuilder.update(defaults.cssParser, defaults.elementUUID, "#spltr-" + defaults.elementUUID, {'background-repeat': value});
            _self.events.save();
        },

        bindColorPicker: function () {
            var _self = this;
            var colorPickerSelector = defaults.floatingMenuElement.find(".fee-fm-color-picker");
            colorPickerSelector.ColorPicker({
                flat: true,
                onShow: function (colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    colorPickerSelector.val(hex);
                },
                onSubmit: function (hsb, hex, rgb, el) {
                    //$(el).ColorPickerHide();
                    _self['background'].apply(_self, [app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.COLOR, hex]);
                }
            });
        },

        /*triggerColorPicker: function () {
            defaults.floatingMenuElement.find(".fee-fm-color-picker").trigger("click");
        },*/

        destroyColorPicker: function () {
            var colorPicker = $(".colorpicker");
            if (colorPicker.length > 0) {
                colorPicker.remove();
            }
        },
        bindImageUpload: function () {
            var _self = this;
            defaults.floatingMenuElement.find(".fee-background-upload-field").on("change", function () {
                if (this.files && this.files[0]) {
                    var FR = new FileReader();
                    FR.onload = function () {
                        _self['background'].apply(_self, [app.FrontEndEditor.floatingMenu.BACKGROUND_TYPE.IMAGE, FR.result]);
                    };
                    FR.readAsDataURL(this.files[0]);
                }
            });
        }
    };
});

app.FrontEndEditor.prototype.rowColumnHeader = (function (configs) {
    var defaults = {
        floatingMenuElement: undefined,
        parentElement: undefined,
        openAnimationClass: '',
        closeAnimationClass: '',
        activeRowClass: '',
        activeColumnClass: '',
        animationTimeout: 300
    };

    $.extend(defaults, configs, true);

    return {
        drag: function () {
            defaults.floatingMenuElement.find('.fee-fm-draggable').draggable({
                proxy: defaults.floatingMenuElement
            });
        },
        close: function () {
            if (defaults.floatingMenuElement) {
                defaults.floatingMenuElement.addClass(defaults.closeAnimationClass);
                setTimeout(function () {
                    defaults.floatingMenuElement.remove();
                }, defaults.animationTimeout);
            }
        }
    };
});

app.FrontEndEditor.activeMenuInstance = undefined;

app.FrontEndEditor.prototype.rowColumn = (function () {
    var _self = this;

    var menuType;

    var hideActiveInstance = function () {
        $(document).bind('mousedown.rowColumn', function (ev) {
            var curEl = $(ev.target);
            if (app.FrontEndEditor.activeMenuInstance
                && !curEl.hasClass('fee-floating-editor-menu') && curEl.parents('.fee-floating-editor-menu').length < 1
                && !curEl.hasClass('colorpicker') && curEl.parents('.colorpicker').length < 1) {
                app.FrontEndEditor.activeMenuInstance.destroy();
            }

        });
    };

    var afterRender = function (parentElement) {
        if (app.FrontEndEditor.activeMenuInstance && app.FrontEndEditor.activeMenuInstance.menuElement) {
            var currentOffset = parentElement.offset();
            currentOffset.left += 1;// for border
            currentOffset.top += 1;// for border
            if (menuType === app.FrontEndEditor.floatingMenu.ROW) {
                currentOffset.left += parentElement.outerWidth() - app.FrontEndEditor.activeMenuInstance.menuElement.width();
            }
            app.FrontEndEditor.activeMenuInstance.menuElement.css({top: currentOffset.top, left: currentOffset.left});
        }
    };

    return {
        init: function (type, appendTo, parentElement, config) {
            if (app.FrontEndEditor.activeMenuInstance) {
                app.FrontEndEditor.activeMenuInstance.destroy();
            }
            menuType = type;
            app.FrontEndEditor.activeMenuInstance = _self[menuType].apply(_self).init(appendTo, parentElement, config);
            afterRender(parentElement);
            hideActiveInstance();
        }
    }
});