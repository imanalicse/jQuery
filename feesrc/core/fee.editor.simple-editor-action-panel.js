app.FrontEndEditor.prototype.elementActionPanel = function (parentElement, highlightedElement) {
    _self = this;

    var parentElement;
    var appendToElement;
    var floatingMenuElement;
    var selectedElement;
    var actionGroupElement;

    var defaults = {
        menuClass: "fee-floating-action-panel",
        openAnimationClass: "animated fadeIn",
        closeAnimationClass: "animated fadeOut",
        removeAnimationClass: "collapseDownToTop",
        moveUpAnimationClass: "animated fadeInDown",
        moveDownAnimationClass: "animated fadeInUp",
        activeRowClass: "fee-widget-row-active",
        animationTimeout: 300,
        template: "<div class=\"fee-floating-editor-menu\">\n" +
        "    <div class=\"fee-fm-header\">\n" +
        "        <div class=\"fee-fm-action fee-header-action\">\n" +
        "            <span class=\"fee-icon fee-icon-drag fee-fm-draggable\" data-action=\"drag\"></span>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <div class=\"fee-fm-content\">\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
"                    <button class=\"fee-fm-button\" data-action=\"moveUp\"><span class=\"fee-icon fee-icon-up\"></span></button>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
"                    <button class=\"fee-fm-button\" data-action=\"moveDown\"><span class=\"fee-icon fee-icon-down\"></span></button>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
"                    <button class=\"fee-fm-button\" data-action=\"copy\"><span class=\"fee-icon fee-icon-copy\"></span></button>\n" +
        "        </div>\n" +
        "        <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
"                    <button class=\"fee-fm-button\" data-action=\"remove\"><span class=\"fee-icon fee-icon-trash\"></span></button>\n" +
        "        </div>\n" +
        "        <div class='fee-margin-input'>" +
        "           <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <label>Margin Top</label>\n" +
        "                        <input type=\"text\" data-action=\"top\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "           </div>\n" +
        "           <div class=\"fee-fm-menu-block fee-fm-actions\">\n" +
        "                    <div class=\"fee-fm-input\">\n" +
        "                        <label>Margin Bottom</label>\n" +
        "                        <input type=\"text\" data-action=\"bottom\" placeholder=\"0\">\n" +
        "                    </div>\n" +
        "           </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"
    };

    var destroy = function () {
        var menuElement = $('.' + defaults.menuClass);
        menuElement.addClass(defaults.closeAnimationClass);
        setTimeout(function () {
            menuElement.remove();
        }, defaults.animationTimeout);
    };

    var headerAction = {
        drag: function () {
            floatingMenuElement.find('.fee-fm-draggable').draggable({
                proxy: floatingMenuElement
            });
        },
        close: function () {
            if (floatingMenuElement) {
                floatingMenuElement.addClass(defaults.closeAnimationClass);
                setTimeout(function () {
                    floatingMenuElement.remove();
                }, defaults.animationTimeout);
            }
        }
    };
    var actionEvents = {
        moveUp: function () {
            this._move("up");
        },
        moveDown: function () {
            this._move("down");
        },
        _move: function (type) {
            var topPanel = parentElement;
            var firstPanel = selectedElement;
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
                firstClonePanel.removeClass('fee-first-move-panel');
                secondClonePanel.removeClass('fee-second-move-panel');
                destroy();
                _self.events.save();
            }, defaults.animationTimeout);
        },
        copy: function () {
            var cloneParentElement = selectedElement.clone();
            cloneParentElement.find('.fee-element-action-container').remove();
            cloneParentElement.removeClass('fee-highlighted-element');
            cloneParentElement.addClass(defaults.moveUpAnimationClass);
            selectedElement.after(cloneParentElement);
            setTimeout(function () {
                cloneParentElement.removeClass(defaults.moveUpAnimationClass);
                destroy();
                _self.events.save();
            }, defaults.animationTimeout);
        },
        remove: function () {
            selectedElement.addClass(defaults.removeAnimationClass);
            setTimeout(function () {
                selectedElement.remove();
                _self.events.save();
                headerAction.close();
            }, defaults.animationTimeout);
        }
    };

    var postInit = {
        initVars: function () {
            floatingMenuElement = $(defaults.template).addClass(defaults.menuClass);
            actionGroupElement = floatingMenuElement.find('.fee-fm-actions');
        },
        render: function () {
            appendToElement.append(floatingMenuElement.addClass(defaults.openAnimationClass));
            this.actionPanelPlacement();
            this.upDownControl();

            var dataAction = floatingMenuElement.find(".fee-fm-draggable").attr("data-action");
            headerAction[dataAction].apply(headerAction);
        },
        _bind: function () {
            floatingMenuElement.delegate(".fee-header-action .fee-icon", "click", function (ev) {
                var dataAction = $(ev.target).attr("data-action");
                headerAction[dataAction].apply(headerAction);
            });

            actionGroupElement.delegate("button", "click", function () {
                var dataAction = $(this).attr("data-action");
                actionEvents[dataAction].apply(actionEvents);
            });

            this.marginAction();

            $('body').click(function (e) {
                var curEl = $(e.target);
                if (!curEl.parents().addBack().is(parentElement)
                    && (!curEl.hasClass('fee-floating-action-panel') && curEl.parents('.fee-floating-action-panel').length < 1)
                    && (!curEl.hasClass('confirm-popup') && curEl.parents('.confirm-popup').length < 1)
                    && (!curEl.hasClass('fee-element-action-container') && curEl.parents('.fee-element-action-container').length < 1)
                ) {
                    destroy();
                }
            });
        },
        _loadInitialStyle: function(){
            this.initializeMargin();
        },
        actionPanelPlacement: function () {
            var currentOffset = selectedElement.offset();
            currentOffset.left += 1;// for border
            currentOffset.top += 1;// for border
            currentOffset.left += selectedElement.outerWidth() - floatingMenuElement.width();
            floatingMenuElement.css({top: currentOffset.top, left: currentOffset.left});
        },
        upDownControl: function () {
            var hasUp = selectedElement.prev().length;
            var hasDown = selectedElement.next().length;
            var upButton = actionGroupElement.find("button[data-action='moveUp']");
            var downButton = actionGroupElement.find("button[data-action='moveDown']");
            hasUp ? upButton.removeClass("fee-fm-disabled") : upButton.addClass("fee-fm-disabled");
            hasDown ? downButton.removeClass("fee-fm-disabled"): downButton.addClass("fee-fm-disabled");
        },
        marginAction: function () {
            floatingMenuElement.find(".fee-margin-input input").on("change", function () {
                floatingMenuElement.find(".fee-margin-input input").each(function () {
                    var dataAction = $(this).attr("data-action");
                    var value = $.trim($(this).val());
                    if (value) {
                        selectedElement.css('margin-' + dataAction, value+"px");
                    }
                });
            });
        },
        initializeMargin: function () {
            $.each(['top', 'bottom'], function (index, item) {
                var cssAttributeValue = selectedElement.css("margin-" + item);
                if (cssAttributeValue) {
                    cssAttributeValue = cssAttributeValue.replace("px", "");
                    floatingMenuElement.find(".fee-margin-input input[data-action=" + item + "]").val(cssAttributeValue);
                }
            });
        }
    };
    return {
        init: function (_appendToElement, _parentElement, highlightedElement) {
            appendToElement = _appendToElement
            parentElement = _parentElement;
            selectedElement = highlightedElement;

            postInit.initVars();
            postInit.render();
            postInit._bind();
            postInit._loadInitialStyle();
            return this;
        },
        destroy: function () {
            destroy();
        }
    }
};