app.FrontEndEditor.widgetBase = function (configPanel, widgetType, widgetUuid, frontEndInstance, renderPanel, popupInstance) {
    this.configPanel = configPanel;
    this.widgetType = widgetType;
    this.widgetUUID = widgetUuid;
    this.renderPanel = renderPanel;
    this.popupInstance = popupInstance;
    this.frontEndInstance = frontEndInstance;

    var trackAjaxExecution = false;
    var _self = this;
    var panel = this.configPanel;
    var rightPanel = this.rightPanel = panel.find('.fee-right-panel');
    var rightTable = this.rightTable = panel.find('.table-view table');
    var leftTable = this.leftTable = panel.find('.left-table');
    var leftPanel = this.leftPanel = panel.find('.fee-left-panel');
    var perPageCount = 10;

    var diceRow = panel.find(".action-column-dice-content table tr:first");
    var itemName = 'item';
    this.rightSideFieldName = "item"; // used as hidden field name in right side table
    this.widgetId = panel.attr("widget-id") || "";

    var loadAjaxContent = function (loadUrl, params) {
        if (!trackAjaxExecution) {

            if(!$(document).hasClass("loader"))
            {
                bm.mask(_self.configPanel.find('.fee-body'), '<div><span class="loader"></span></div>');
            }

            return bm.ajax({
                url: loadUrl,
                data: $.extend(true, params, {noLayout: true}),
                dataType: 'html',
                response: function () {
                    trackAjaxExecution = false;
                },
                success: function (resp) {
                    return $.when(resp);
                },
                error: function (xhr, status, resp) {
                    bm.unmask(_self.configPanel.find('.fee-body'));
                    bm.notify(resp.message, "WC Editor Error");
                },
                complete: function(xhr, status, resp) {
                    bm.unmask(_self.configPanel.find('.fee-body'));
                }
            });
        }
    };

    this.afterWidgetContentChange = function (wELm, serialized) {
    };

    this.getInlineWidgetConfigPanel = function () {
        return "<div class=\"fee-widget-config-panel fee-border-panel\">\
                    <div class=\"fee-config-body fee-padding-30\"></div>\
                    <div class=\"fee-button-wrapper fee-config-footer\">\
                        <button class=\"fee-save\" type=\"button\">" + $.i18n.prop("save") + "</button>\
                        <button class=\"fee-cancel fee-common\" type=\"button\">" + $.i18n.prop("cancel") + "</button>\
                    </div>\
                </div>";
    };

    this.initPage = function () {
        this.firstPage = panel.find('.fee-first-page');
        this.lastPage = panel.find('.fee-last-page');
        panel.find('.fee-page-button').bind("click", function () {
            var currButton = $(this);
            if (currButton.hasClass('fee-next')) {
                _self.firstPage.removeClass('show').addClass('hide');
                setTimeout(function () {
                    _self.lastPage.removeClass('hide').addClass('show');
                }, 10);
            } else {
                _self.lastPage.removeClass('show').addClass('hide');
                setTimeout(function () {
                    _self.firstPage.removeClass('hide').addClass('show');
                }, 10);
            }
            currButton.hide();
            currButton.siblings().show();
        });
    };

    this.check = function (currEl, isChecked) {
        var fancyChecked = currEl.find('.wcui-checkbox');
        var currentCheckbox = currEl.find("input[type=checkbox]");
        if (isChecked === false || (typeof isChecked == 'undefined' && fancyChecked.hasClass('checked'))) {
            fancyChecked.removeClass('checked').addClass('unchecked');
            currEl.removeClass('selected');
        } else {
            fancyChecked.removeClass('unchecked').addClass('checked');
            currEl.addClass('selected');
        }
        if (currentCheckbox.length) {
            if (typeof isChecked == 'undefined') {
                currentCheckbox.prop("checked", !currentCheckbox.is(':checked'));
            } else {
                currentCheckbox.prop("checked", isChecked);
            }
        }
    };

    var fillRightGaps = function (fillUpCount) {
        var rows = $();
        for (var g = 0; g < fillUpCount; g++) {
            var row = diceRow.clone();
            rightTable.append(row);
            rows = rows.add(row);
        }
        return rows;
    };

    this.removeSelectedRows = function (selectedRows, notChecked) {
        if (!notChecked) {
            $.each(selectedRows, function () {
                var rightInputEl = $(this).find("input[type='hidden']");
                var leftInputEl = leftPanel.find("input[value=" + rightInputEl.val() + "]");
                if (leftInputEl.length) {
                    _self.check(leftInputEl.closest('tr'));
                }
                _self.check(leftPanel.find('.check-all').closest('tr'), false);
            });
        }
        selectedRows.remove();
        this.rightPaginator.setTotal(this.rightPaginator.getTotal() - selectedRows.length);
        this.rightPaginator.onPageClick(this.rightPaginator.getCurrentPage());
        this.fillRequiredGaps()
    };

    this.addSelectedRow = function (entries) {
        this.rightPaginator.setTotal(this.rightPaginator.getTotal() + entries.length);
        var emptyRows = rightTable.find(".empty");
        if (emptyRows.length < entries.length) {
            fillRightGaps(entries.length);
            if (this.rightPaginator.getPageCount() == this.rightPaginator.getCurrentPage() + 1) {
                this.rightPaginator.setCurrentPage(this.rightPaginator.getCurrentPage() + 1, true);
            }
        }
        $.each(entries, function () {
            var emptyRow = rightTable.find(".empty:first").removeClass("empty");
            emptyRow.find("td:first").text(this.name);
            emptyRow.attr("type", itemName).find("td.actions-column").attr("item", this.value).attr("type", itemName);
            emptyRow.addClass(itemName);
            emptyRow.find("input[type='hidden']").attr("name", _self.rightSideFieldName).val(this.value);
        });
        this.rightPaginator.onPageClick(this.rightPaginator.getCurrentPage());
    };

    this.fillRequiredGaps = function () {
        var rightRowCount = rightTable.find("tr.item").length;
        var leftRowCount = _self.leftPaginator.getCurrentPage() > 1 ? perPageCount : leftTable.find("tr.item").length;
        var fillUpCount = rightRowCount ? ((leftRowCount - rightRowCount) < 0 ? 0 : (leftRowCount - rightRowCount)) : leftRowCount;
        if (rightRowCount != 0 && fillUpCount == perPageCount) {
            return;
        }
        var alreadyFilledCount = perPageCount < 0 ? 0 : rightTable.find("tr.empty").length;
        if (fillUpCount < alreadyFilledCount) {
            rightTable.find("tr.empty").filter(":lt(" + (alreadyFilledCount - fillUpCount) + ")").remove();
        } else {
            fillRightGaps(fillUpCount - alreadyFilledCount);
        }
        _self.rightPaginator.onPageClick(_self.rightPaginator.getCurrentPage())
    };

    this.rightPanelPageReload = function (page) {
        rightTable.find("tr:not(:first)").hide();
        var perpage = _self.rightPaginator.all ? ( _self.rightPaginator.getTotal() > 10 ? _self.rightPaginator.getTotal() : 10) : _self.rightPaginator.getItemsPerPage();
        var offsetIndex = (page - 1) * perpage;
        if (offsetIndex < 1) {
            offsetIndex = 0;
        }
        rightTable.find("tr:gt(" + offsetIndex + "):lt(" + perpage + ")").show();
    };

    this.selectLeftTableRows = function () {
        rightTable.find("tr.item input[type=hidden]").each(function () {
            var value = $(this).val();
            var leftPanelRow = _self.leftTable.find('tr.item input[value="' + value + '"]');
            if (leftPanelRow.length) {
                leftPanelRow.closest("tr").trigger('click');
            }
        });
    };

    this.bindRightPanel = function () {
        rightTable.on("click", ".actions-column", function (ev) {
            var targetElement = $(ev.target);
            var thisRow = $(ev.target).closest("tr");
            if (targetElement.hasClass("move-up") || targetElement.hasClass("move-down")) {
                var isUp = targetElement.hasClass("move-up");
                var immediateRow = isUp ? thisRow.prev() : thisRow.next();
                if (immediateRow.length && (isUp ? immediateRow.has("th").length == 0 : !immediateRow.is(".empty"))) {
                    thisRow.swap(immediateRow);
                    if (immediateRow.is(":hidden")) {
                        thisRow.hide();
                        immediateRow.show();
                    }
                    rightTable.find("th:eq(0)").sortablecolumn("resetSortState");
                    rightTable.scrollbar("content", rightTable.find("th:eq(0)"))
                }
                rightTable.trigger("change")
            }
            else if (targetElement.hasClass("remove") || targetElement.hasClass("remove-all")) {
                _self.removeSelectedRows(targetElement.hasClass("remove") ? thisRow : rightTable.find("tr.item"));
            }
        });

        rightTable.find("th:eq(0)").sortablecolumn({});
        rightTable.bind("sort", function () {
            rightTable.scrollbar("content", rightTable.find("th:eq(0)"))
        });
        rightPanel.find('right-paginator').paginator({
            className: 'fee-pagination right-pagination'
        });
        this.rightPaginator = rightPanel.find(".fee-pagination").obj();
        this.rightPaginator.onPageClick = this.rightPanelPageReload;
    };

    this.bindTablePanel = function (panel, afterClick) {
        panel = panel || this.configPanel;
        panel.find("input[type=checkbox]").checkbox();

        panel.find("table tr:not(.fee-ignore) .wcui-checkbox").off("click");
        panel.find(".check-all .wcui-checkbox").off("click");

        panel.find("table tr:not(.fee-ignore)").on("click", function () {
            var $this = $(this);
            var currentCheckbox = $this.find("input[type=checkbox]");
            if (currentCheckbox.hasClass('single')) {
                var previousState = currentCheckbox.is(":checked");
                panel.find("input[type=checkbox]").removeAttr('checked').prop("checked", false);
                panel.find('.wcui-checkbox').removeClass('unchecked checked');
                panel.find('.selected').removeClass('selected');
                _self.check($this, !previousState);
            } else {
                _self.check($this);
            }
            var fancyAllChecked = panel.find(".check-all");
            var totalCheckBoxLength = panel.find("table tr:not(.fee-ignore)").find("input[type=checkbox]").length;
            var checkLength = panel.find("table tr:not(.fee-ignore)").find("input[type=checkbox]:checked").length;
            if (checkLength < totalCheckBoxLength) {
                _self.check(fancyAllChecked, false);
            } else if (checkLength == totalCheckBoxLength) {
                _self.check(fancyAllChecked, true);
            }
            if (afterClick && $.isFunction(afterClick)) {
                afterClick($this);
            }
        });
        panel.find(".check-all").on("click", function () {
            var isChecked = $(this).find("input[type=checkbox]:checked").length > 0;
            panel.find("table tr:not(.fee-ignore)").each(function () {
                _self.check($(this), !isChecked);
                if (afterClick && $.isFunction(afterClick)) {
                    afterClick($(this));
                }
            });
            _self.check($(this), !isChecked);
        });

    };

    /**
     * initialize left table when we use multi table feature
     */
    this.initLeftTablePanel = function () {
        function afterBindTable(currentRow) {
            var name = currentRow.find("td:first").text();
            var leftInputEl = currentRow.find("input[type=checkbox]");
            var rightInputEl = _self.rightPanel.find("input[value=" + leftInputEl.val() + "]");
            if (leftInputEl.is(":checked") && rightInputEl.length < 1) {
                _self.addSelectedRow([{name: name, value: leftInputEl.val()}])
            } else if (!leftInputEl.is(":checked") && rightInputEl.length) {
                _self.removeSelectedRows(rightInputEl.closest("tr"), true)
            }
        }

        this.bindTablePanel(_self.leftPanel, afterBindTable);
    };

    /**
     * Main method for multi table base page
     */
    this.initMultiTablePanel = function () {
        this.initLeftTablePanel();
        this.bindRightPanel();
        this.fillRequiredGaps();
        this.selectLeftTableRows();
    };

    this.initSearch = function (searchUrl, afterLoad, extraParams) {
        var searchPanel = this.configPanel.find(".fee-search-panel");
        searchPanel.find('button').on('click', function () {
            var currEl = $(this);
            currEl.attr('disabled', true);
            var formParams = $.extend({
                uuid: _self.widgetUUID,
                type: _self.widgetType
            }, searchPanel.serializeObject());
            if (extraParams) {
                $.extend(formParams, $.isFunction(extraParams) ? extraParams() : (typeof extraParams == 'object' ? extraParams : {}));
            }
            loadAjaxContent(searchUrl, formParams).then(function (resp) {
                if ($.isFunction(afterLoad)) {
                    afterLoad(resp);
                } else {
                    _self.configPanel.find('.fee-config-body').html(resp);
                    _self.init();
                }
                currEl.attr('disabled', false);
            });
        });
        var buttonAutoTriggerInterval;
        searchPanel.find('input').on('keyup', function (ev) {
            if (ev.keyCode === '13') {
                searchPanel.find('button').trigger('click');
                if (buttonAutoTriggerInterval) {
                    clearTimeout(buttonAutoTriggerInterval);
                    buttonAutoTriggerInterval = undefined;
                }
            } else {
                if (!buttonAutoTriggerInterval) {
                    buttonAutoTriggerInterval = setTimeout(function () {
                        searchPanel.find('button').trigger('click');
                    }, 2000);
                }
            }
        });
        searchPanel.find("select").on('change', function () {
            searchPanel.find('button').trigger('click');
        });
    };

    this.initSortable = function (paginationUrl, afterLoad, extraParams) {
        var $table = this.configPanel.find("table.sortable-table");
        var sortBy = $table.data("sortby");
        sortBy = sortBy ? sortBy.split("_") : null;

        $table.find("tr th").each(function () {
            var $th = $(this), sortable = $th.data("sortable");
            if (sortable) {
                $th.addClass("sortable");
                if (sortBy && sortBy[0] == sortable) {
                    if (sortBy[1] == "ASC") {
                        $th.addClass("sort-up");
                    }
                    else {
                        $th.addClass("sort-down");
                    }
                }
            }
        });

        $table.find("tr th.sortable").click(function () {
            var $th = $(this);
            var params = {
                offset: 0,
                uuid: _self.widgetUUID,
                type: _self.widgetType
            };
            if ($th.hasClass("sort-down")) {
                $th.removeClass("sort-down");
                params.sortBy = "";
            }
            else if ($th.hasClass("sort-up")) {
                $th.removeClass("sort-up").addClass("sort-down");
                params.sortBy = $th.data("sortable") + "_DESC";
            }
            else {
                $th.addClass("sort-up");
                params.sortBy = $th.data("sortable") + "_ASC";
            }
            $table.data("sortby", params.sortBy);
            if (extraParams) {
                $.extend(params, $.isFunction(extraParams) ? extraParams() : (typeof extraParams == 'object' ? extraParams : {}));
            }
            loadAjaxContent(paginationUrl, params).then(function (resp) {
                if ($.isFunction(afterLoad)) {
                    afterLoad(resp);
                } else {
                    _self.configPanel.find('.fee-config-body').html(resp);
                    _self.init();
                }
            });
        });
    };

    this.initPagination = function (paginationUrl, afterLoad, extraParams) {
        function bindPageClick(pageNo, currPaginationEl) {
            var paginatorObj = currPaginationEl.find('.fee-pagination').obj();
            var params = {
                max: paginatorObj.getItemsPerPage(),
                offset: paginatorObj.getItemsPerPage() * (pageNo - 1),
                uuid: _self.widgetUUID,
                type: _self.widgetType
            };
            if (extraParams) {
                $.extend(params, $.isFunction(extraParams) ? extraParams() : (typeof extraParams == 'object' ? extraParams : {}));
            }
            if (paginationUrl) {
                loadAjaxContent(paginationUrl, params).then(function (resp) {
                    if ($.isFunction(afterLoad)) {
                        afterLoad(resp);
                    } else {
                        _self.configPanel.find('.fee-config-body').html(resp);
                        _self.init();
                    }
                });
            }
        }

        var paginationEl = this.configPanel.find('paginator');

        paginationEl.each(function () {
            var currPaginationEl = $(this);
            var pageUrl = currPaginationEl.attr("url");
            if (!paginationUrl && pageUrl) {
                paginationUrl = app.baseUrl + pageUrl
            }
            var parentElement = currPaginationEl.parent();
            currPaginationEl.paginator({
                className: 'fee-pagination',
                onPageClick: function (pageNo) {
                    bindPageClick(pageNo, parentElement);
                }
            });
        });
        this.leftPaginator = this.leftPanel.find('.fee-pagination').obj();
    };

    this.initEditor = function (elements, configs) {
        configs = configs === undefined || configs == null ? {} : configs;
        elements.each(function () {
            var textAreaElement = $(this);
            textAreaElement.redactor({
                air: configs.air === undefined ? false : configs.air,
                callbacks: {
                    focus: function () {
                        var validator = textAreaElement.data("validator-filed-inst");
                        if (validator) validator.clear()
                    },
                    blur: function () {
                        var validator = textAreaElement.data("validator-filed-inst");
                        if (validator) validator.validate()
                    },
                    change: function (html) {
                        if (configs.change !== undefined) {
                            configs.change(html);
                        }
                    }
                },
                imageUpload: app.baseUrl + 'app/uploadWceditorImage',
                imageManagerJson: app.baseUrl + 'app/wceditorImages',
                buttons: ['source', 'format', 'bold', 'italic', 'lists', 'image', 'video', 'table', 'link', 'align'],
                plugins: ['source', 'table', 'video', 'imagemanager', 'definedlinks', 'alignment', 'iconic']
            });
        })

    };

    this.floatingPopup = function (refContext, config, contentSetting, contentLoaded) {
        return this.frontEndInstance.floatingPopup(refContext, config, contentSetting, contentLoaded);
    };

    this.initRowCheckboxMultipleSelection = function (selected_rows, callback) {
        var $self = this, $table = $self.configPanel.find("table");
        $table.find(".check-one").each(function () {
            var $this = $(this);
            var checked = $.inArray($this.attr("item"), selected_rows) >= 0;
            $this.prop("checked", checked);
        });
        if ($table.find(".check-one").length == $table.find(".check-one:checked").length) {
            $table.find(".check-all").prop("checked", true);
        }
        $table.find(".check-one").on("change", function () {
            var $this = $(this), checked = $this.is(":checked");
            if (checked) {
                if ($table.find(".check-one").length == $table.find(".check-one:checked").length) {
                    $table.find(".check-all").prop("checked", true);
                }
                selected_rows.push($this.attr("item"));
                if (!$this.hasClass("multiple")) {
                    selected_rows = [$this.attr("item")];
                    $table.find(".check-one:not(.check-one." + $this.attr("item") + ")").prop("checked", false);
                }
            }
            else {
                $table.find(".check-all").prop("checked", false);
                selected_rows = $.grep(selected_rows, function (val) {
                    return val !== $this.attr("item");
                });
            }
            callback(selected_rows);
        });
        $table.find(".check-all").on("change", function () {
            var $this = $(this), checked = $this.is(":checked");
            if (checked) {
                $table.find(".check-one:not(:checked)").each(function () {
                    var $this = $(this);
                    selected_rows.push($this.attr("item"));
                });
                $table.find(".check-one").prop("checked", true);
            }
            else {
                $table.find(".check-one:checked").each(function () {
                    var $this = $(this);
                    selected_rows = $.grep(selected_rows, function (val) {
                        return val !== $this.attr("item");
                    });
                });
                $table.find(".check-one").prop("checked", false);
            }
            callback(selected_rows);
        });
    };

    this.widgetContentPlacement = function (hostElement, widgetElement) {

        app.FrontEndEditor.utils.setAnimation(widgetElement, 'animated fadeInDown');
        if (hostElement.find('.fee-widget-content').length) {
            if (widgetElement.children(".fee-overlay").length < 1) {
                widgetElement.append(this.frontEndInstance.layout.template.widgetOverlay.clone());
            }
            hostElement.find('.fee-widget-content').find(".fee-add-content").before(widgetElement);
        } else {
            widgetElement.append(this.frontEndInstance.layout.template.widgetOverlay.clone());
            var newBlockPanel = this.frontEndInstance.layout.getWidgetWithGridBlock(widgetElement);
            var rowPanel = hostElement.closest('.fee-widget-row');
            var isAppendAfter = hostElement.hasClass('fee-after') || hostElement.parent('.fee-after').length;
            rowPanel[isAppendAfter ? 'after' : 'before'](newBlockPanel);
        }
    };
};