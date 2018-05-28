app.FrontEndEditor.prototype.uiComponent = (function () {

    var _self = this;

    return {
        renderPopup: function (config) {
            var _self = this;
            config = $.extend(true, {
                clazz: 'fee-popup',
                is_fixed: true,
                draggable: true,
                drag_cancel: '.content',
                is_always_up: true,
                events: {
                    close: function () {
                        //_self.portlet.restoreSortable();
                    }
                }

            }, config);
            if (config.animation_clazz === undefined) {
                config.animation_clazz = app.config.site_popup_animation_clazz
            }
            var $popup_instance = new POPUP(config);
            $popup_instance.el.data("popup-instance", $popup_instance);
            return $popup_instance;
        },
        floatingPopup: function (refContext, config, contentSetting, contentLoaded) {
            var beforeRuleIndex = -1;
            var afterRuleIndex = -1;
            var styleSheet = document.styleSheets[0];
            var popupConfig = $.extend(true, {
                show_title: false,
                masking: false,
                clazz: "floating-panel-popup",
                show_close: false,
                close_on_blur: false,
                modal: false,
                is_always_up: true,
                is_center: false,
                close_on_escape: true,
                on_load_loader: false,
                width: 400,
                ui_position: {
                    my: "right top",
                    at: "right+10 bottom+7",
                    of: refContext,
                    collision: false
                },
                events: {
                    render: function (popup) {
                        var popupWidth = popup.el.outerWidth();
                        var refWidth = refContext.outerWidth();
                        var leftPosition = 13;
                        if (popupWidth < refWidth || popupWidth > refWidth) {
                            if (popupWidth > refWidth) {
                                var refLeftPosition = refContext.positionFromBody().left;
                                var popupLeftPosition = popup.el.positionFromBody().left;
                                var differenceLeftPosition = refLeftPosition - popupLeftPosition;
                                leftPosition = differenceLeftPosition + (refWidth / 2);
                            } else {
                                leftPosition = popupWidth / 2;
                            }
                        } else {
                            leftPosition = refWidth / 2;
                        }

                        if (beforeRuleIndex > -1) {
                            styleSheet.removeRule(beforeRuleIndex);
                        }
                        if (afterRuleIndex > -1) {
                            styleSheet.removeRule(afterRuleIndex);
                        }
                        beforeRuleIndex = styleSheet.insertRule('.floating-panel-popup:before {left: ' + (leftPosition + 1) + 'px !important;right:auto !important;}', styleSheet.cssRules.length - 1);
                        afterRuleIndex = styleSheet.insertRule('.floating-panel-popup:after {left: ' + leftPosition + 'px !important;right:auto !important;}', styleSheet.cssRules.length - 1);
                    },
                    content_loaded: function (popup) {
                        if ($.isFunction(contentLoaded)) {
                            contentLoaded(popup);
                        }
                    }
                }
            }, config);
            if (contentSetting) {
                $.extend(popupConfig, contentSetting || {content: ''})
            }
            return new POPUP(popupConfig);
        }
    }
});