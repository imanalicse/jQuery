app.FrontEndEditor.prototype.initializeEditor = (function () {

    var _self = this;
    var pageBody = this.pageBody;

    var initializeEditor = {
        init: function () {
            initializeEditor.initEditableArea();
            initializeEditor.bindEvents();
        },

        initEditableArea: function () {
            var layoutId = pageBody.find(".layout-id");
            _self.pageId = pageBody.find(".page-id").val();
            _self.has_layout = layoutId.length > 0;
            if (layoutId.length) {
                _self.layout_id = layoutId.val();
                _self.layout_name = pageBody.find(".layout-name").val();
                _self.leafGridBlockSelectorInContentMode = ".page-content,.page-content:not(:has(>div>.grid-block, >.widget-container)), .page-content .grid-block:not(.grid-block.no-fixed-container), .page-content .widget-container:not(:has(>.grid-block)),.header .widget-container:not(:has(>.page-content)),.footer .widget-container:not(:has(>.page-content))"
            }
            else {
                _self.leafGridBlockSelectorInContentMode = ".widget-container:not(:has(>.page-content)), .grid-block:not(:has(>.grid-block, >.page-content))"
            }

            $(_self.leafGridBlockSelectorInContentMode).find(".widget").append(_self.layout.template.widgetOverlay.clone());

            var editableBlockContainer = $(_self.leafGridBlockSelectorInContentMode).find(".fee-widget-row,.no-fixed-container,.v-split");
            if (editableBlockContainer.length) {
                $.each(editableBlockContainer, function () {
                    var editableBlock = $(this);
                    if (!editableBlock.hasClass("no-fixed-left") && !editableBlock.hasClass("no-fixed-right")) {
                        editableBlock.addClass('fee-widget-row');
                        editableBlock.find('.no-fixed-left,.no-fixed-right').each(function () {
                            if (!$(this).hasClass('no-fixed-container')) {
                                $(this).addClass('fee-widget-column');
                            }

                            if ($(this).children('.widget').length > 0) {
                                $(this).children('.widget').append(_self.layout.template.widgetEditCommandPanel.clone());
                            }

                            if ($(this).find('.fee-widget-content').length < 1)
                            {
                                var widgetContent = $("<div>").addClass('fee-widget-content');
                                var allCloneWidget = $(this).find('.widget').clone();
                                widgetContent.append(allCloneWidget);
                                $(this).find('.widget').remove();
                                $(this).append(widgetContent);
                            }
                        });

                        _self.layout.addEditorCommandBlock(editableBlock);
                    }
                });
            } else {
                _self.defaultGridBlockContainer = ".page-content";
                _self.layout.insertDefaultGridBlock();
                _self.pageBody.find('.fee-widget-row').addClass('empty-row');
            }
            initializeEditor.loadCss();
            _self.layout.insertOverlay();
            _self.layout.setColumnAsEqualHeight();
        },

        loadCss: function () {
            var defaultCss;
            if (_self.isResponsive) {
                defaultCss = ".header > .widget-container {height: 200px;} .footer > .widget-container {height: 200px;}"
            } else {
                defaultCss = ".body > .widget-container {width: 1000px;} .header > .widget-container {width: 1000px; height: 200px;} .footer > .widget-container {width: 1000px; height: 200px;}"
            }

            var style_page = $("#stored-css");
            var cssString = style_page.length ? style_page[0].innerHTML : "";
            if (cssString === "" && !_self.has_layout) {
                cssString = defaultCss;
                $("head #stored-css").text(cssString);
                if (pageBody.find(".body > .widget-container").length === 0) {
                    pageBody.find(".body").prepend("<div class='widget-container'></div>")
                }
            }
            _self.css = new CssParser(cssString).parse();
        },

        resetSelectableWidget: function () {
            pageBody.find(".widget").each(function () {
                var isEditable = $(this).find('.fee-widget-config-panel').length > 0;
                if (!isEditable) {
                    _self.layout.hideEditSelectionOverlay();
                }
            });
        },
        bindEvents: function () {

            pageBody.delegate(".body", "mousemove", function (ev) {
                var currentElm = $(ev.target);
                if (currentElm.closest('.fee-active-state').length) {
                    return;
                }
                var gridBlockElement = currentElm.parent();

                if (gridBlockElement.hasClass("widget") || gridBlockElement.hasClass("fee-widget-column") || gridBlockElement.hasClass("fee-widget-row")
                    || (currentElm.hasClass("no-fixed-container") && (gridBlockElement.hasClass("page-content") || gridBlockElement.parent().hasClass("page-content")))) {
                    _self.layout.commandTemplate.hideActiveBlock();
                    _self.layout.commandTemplate.makeActiveBlock(currentElm);
                }
            });
            pageBody.delegate(".body", "click.editor", function (ev) {
                var currentElm = $(ev.target);
                if (!currentElm.hasClass('.grid-block') && currentElm.parents('.grid-block').length < 1) {
                    _self.layout.commandTemplate.hideActiveBlock();
                }
            });

            pageBody.delegate('.fee-widget-selected-mask', 'mousedown.unselect', function (ev) {
                var currentElm = $(ev.target);
                if(_self.simpleEditorInstance)
                {
                    _self.simpleEditorInstance.reset();
                }

                initializeEditor.resetSelectableWidget();
            });

            pageBody.delegate('.fee-overlay', 'click', function (ev) {
                var currentElm = $(ev.target);
                var currentWidget = $(this).closest('.widget');
                if(currentWidget.closest(".header").length > 0 || currentWidget.closest(".footer").length > 0){
                    _self.layout.initEditHeaderSelectionOverlay(currentWidget);
                    return;
                }
                if (currentWidget.closest(".body").length === 0 || currentElm.closest(".fee-add-content").length || currentWidget.hasClass('fee-nonSelectable')) {
                    return;
                }
                var widgetType = currentWidget.attr('widget-type');
                var currentWidgetObj = _self.WIDGETS[widgetType];
                if (!currentWidgetObj) {
                    return;
                }
                _self.layout.initEditSelectionOverlay(currentWidget);
                //_self.portlet.destroySortable();
            });

            pageBody.delegate(".fee-menu-group", "click", function (ev) {
                _self.events.bindWidgetCommand($(ev.target));
            });

            pageBody.delegate(".fee-header-footer-control-menu", "click", function (ev) {
                _self.header.headerWidgetCommand($(ev.target));
            });

            pageBody.delegate(".fee-ac-title", "click", function () {
                _self.events.openWidgetPopup($(this).closest('.grid-block'));
            });

            pageBody.delegate(".fee-add-row-container > .fee-add-button", "click", function () {
                _self.events.openWidgetPopup($(this));
            });

            pageBody.delegate(".fee-menu-bar", "click", function (ev) {
                var menuType = $(this).attr("data-type");
                var closestGridPanel = $(ev.target).closest('.grid-block');
                _self.rowColumn().init(menuType, $("body"), closestGridPanel);
            });

            //_self.portlet.init(pageBody, true);
        }
    };
    initializeEditor.init();
});