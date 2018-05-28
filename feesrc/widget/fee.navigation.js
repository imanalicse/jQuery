app.FrontEndEditor.widget.navigation = function () {
    app.FrontEndEditor.widget.navigation._super.constructor.apply(this, arguments);
};

var _nav = app.FrontEndEditor.widget.navigation.inherit(app.FrontEndEditor.widgetBase);

_nav.makeSortable = function () {
    var sortableTree = this.configPanel.find(".fee-table-sorting").sortableTreeList({
        change: function (info) {
            info.item.attr("parent", info.parent.attr("item_id") || "");
        }
    });
    this.sortable_tree = sortableTree.data('wcuiSortableTreeListObj');
};

_nav.init = function () {
    var _self = this;
    this.trackClickEvent = false;
    var panel = this.configPanel;
    panel.updateUi();
    this.makeSortable();
    bm.ajax({
        url: app.baseUrl + "frontEndEditor/createNavigation",
        dataType: "html",
        data: {title: $.i18n.prop("add.a.new.item")},
        success: function (resp) {
            _self.createItemCache = $(resp);
        }
    });

    panel.find('select[name=navigationId]').on('change', function (event, params) {
        var navigationId = $(this).val();
        if (navigationId) {
            bm.ajax({
                url: app.baseUrl + 'frontEndEditor/navigationConfig',
                data: {
                    navigationId: navigationId,
                    type: 'navigation'
                },
                dataType: 'html',
                success: function (resp) {
                    if (resp) {
                        panel.find('.fee-table-sorting').find('.bmui-stl-entry-container:not(.fee-non-remove),.fee-remove-panel').remove();
                        panel.find('.fee-table-sorting').prepend(resp);
                        panel.find('.fee-clickable-panel').show();
                        panel.find('.fee-create-panel .fee-row').remove();
                        panel.find('.fee-add-panel').hide();
                        _self.makeSortable();
                    }
                }
            });
        }

    });
    // START new navigation create 
    panel.find('.fee-navigation-create').bind('click', function () {
        panel.find('.fee-navigation-create-panel').show();
        panel.find('.fee-navigation-panel').hide();
    });

    panel.find('.fee-navigation-cancel').bind('click', function () {
        panel.find('.fee-navigation-create-panel').hide();
        panel.find('.fee-navigation-panel').show();
        panel.find('input[name=navigationTitle]').val('').removeClass('error-field-error validation-error').parent().find('.errorlist').remove();
    });

    panel.find('.fee-navigation-save').bind('click', function () {
        var navigationSelectorEl = panel.find('select.navigation-selector');
        var navigationTitleEl = panel.find('input[name=navigationTitle]');
        if (navigationTitleEl.val()) {
            bm.ajax({
                url: app.baseUrl + "frontEndEditor/saveNavigation",
                data: {name: navigationTitleEl.val()},
                dataType: 'json',
                success: function (resp) {
                    if (resp && resp.status == 'success') {
                        if (resp.instance) {
                            navigationSelectorEl.append("<option value=\"" + resp.instance.id + "\">" + resp.instance.name + "</option>");
                            navigationSelectorEl.val(resp.instance.id);
                            navigationSelectorEl.chosen("add", navigationSelectorEl.get(0).options);
                            navigationSelectorEl.trigger("change");
                        }
                        panel.find('.fee-navigation-cancel').trigger("click");
                        navigationTitleEl.removeAttr('validation').val('');
                        navigationTitleEl.parent().find('input').removeClass('error-field-error validation-error');
                        navigationTitleEl.parent().updateValidator();
                        navigationTitleEl.parent().find('.errorlist').remove();
                    }
                }
            });
        } else {
            navigationTitleEl.attr('validation', 'required maxlength[100]');
            navigationTitleEl.parent().valid();
        }
    });
    // END new navigation create 

    panel.delegate(".fee-add-button", "click", function (ev) {
        if (!_self.trackClickEvent) {
            _self.trackClickEvent = true;
            _self.createNavigationItem(panel.find('.fee-add-panel'), true);
            $(this).parent().hide();
        }
    });
    panel.delegate(".edit", "click", function (ev) {
        if (!_self.trackClickEvent) {
            _self.trackClickEvent = true;
            _self.createNavigationItem($(ev.target).closest(".bmui-stl-entry"));
        }
    });
    panel.delegate("select[name=itemRef]", "change", function (ev) {
        var currInput = $(this);
        currInput.closest('.fee-row').find('input[name=label]').val(currInput.find("option[value='" + currInput.val() + "']").text());
    });
    panel.delegate(".fee-item-save", "click", function (ev) {
        var closestRow = $(ev.target).closest('.fee-row');
        var closestItemPanel = $(ev.target).closest('.bmui-stl-entry-container').find('>.bmui-stl-entry,>.fee-add-panel');
        if (closestRow.valid()) {
            var labelValue = closestRow.find('[name=label]').val();
            var itemTypeValue = closestRow.find('[name=itemType]').val();
            var itemRefValue = closestRow.find('[name=itemRef]').val();
            var cacheData = {
                label: labelValue,
                itemType: itemTypeValue,
                itemRef: itemRefValue,
                target: '_self',
                parent: '0'
            };
            if (closestItemPanel.hasClass('fee-add-panel')) {
                var cloneItemPanel = closestItemPanel.parent().clone();
                var stlEntryPanel = cloneItemPanel.find('.fee-add-panel');
                stlEntryPanel.attr('item_id', '-1');
                stlEntryPanel.attr('entry-level', '0');
                stlEntryPanel.attr('update_cache', JSON.stringify(cacheData));
                cloneItemPanel.removeClass('fee-non-remove');
                cloneItemPanel.removeAttr('style');
                cloneItemPanel.find('.fee-row').remove();
                stlEntryPanel.removeClass('fee-add-panel').addClass('bmui-stl-entry').removeAttr('style');
                stlEntryPanel.append('<div class="table-actions action-column"><span class="tool-icon edit" title="Edit"></span><span class="tool-icon remove" title="Remove"></span></div><div class="name-column">' + labelValue + '</div>');
                panel.find('.fee-table-sorting').find('.fee-create-panel').before(cloneItemPanel);
                closestRow.find('.fee-item-cancel').trigger('click');
                _self.sortable_tree.draggable.addElement(stlEntryPanel);
            } else {
                closestItemPanel.attr('update_cache', JSON.stringify(cacheData));
                closestItemPanel.find('.name-column').text(labelValue);
                closestRow.find('.fee-item-cancel').trigger('click');
            }
        }
    });
    panel.delegate(".fee-item-cancel", "click", function (ev) {
        var closestRow = $(ev.target).closest('.bmui-stl-entry-container');
        if (closestRow.parents('.fee-create-panel').length) {
            panel.find('.fee-clickable-panel').show();
            panel.find('.fee-add-panel').hide();
        } else {
            closestRow.find('.bmui-stl-entry').show();
        }
        closestRow.find('.fee-row').remove();
        if (_self.sortable_tree) {
            _self.sortable_tree.restore();
        }
    });
    panel.delegate(".remove", "click", function (ev) {
        var deleteItem = $(ev.target).closest(".bmui-stl-entry");
        var repository = panel.find(".removed-repository");
        var deleteId = +deleteItem.attr("item_id");
        if (deleteId > 0) {
            repository.append("<input  name='removedItems' value='" + deleteId + "'>");
        }
        var childs = deleteItem.siblings(".bmui-stl-sub-container").find(".bmui-stl-entry");
        childs.each(function () {
            deleteId = +$(this).attr("item_id");
            if (deleteId > 0) {
                repository.append("<input name='removedItems' value='" + deleteId + "'>");
            }
        });
        deleteItem.closest(".bmui-stl-entry-container").remove();
    });

};

_nav.createNavigationItem = function (selectedRow, newItem) {
    var _form = selectedRow.closest('.bmui-stl-entry-container');
    if (_form.find('.fee-row').length > 0) {
        return;
    }
    _form.show();
    var data = {};
    var _self = this;
    if (this.sortable_tree) {
        this.sortable_tree.destroy();
    }
    if (selectedRow) {
        data.cache = selectedRow.attr("update_cache");
        data.id = selectedRow.attr("item_id");
        data.parent = selectedRow.attr("parent");
    }
    data.title = data.id || data.cache ? $.i18n.prop("edit.item") : $.i18n.prop("add.a.new.item");


    function populateInput(appendHtml) {
        _form.find('>.bmui-stl-entry').hide();
        _form.prepend(appendHtml);
        var typeRefColumn = _form.find('.typeRef-column');
        if (typeRefColumn.text().trim() == '') {
            typeRefColumn.hide();
        }
        var typeSelector = _form.find("#itemType");
        typeSelector.change(function () {
            var combo = this;
            setTimeout(function () {
                if (!combo.options[0].value) {
                    $(combo).chosen("remove", combo.options);
                }
            }, 50);
            var currentType = this.value;
            _form.find("button").hide();
            bm.ajax({
                //url: app.baseUrl + "navigation/loadReferenceSelectorBasedOnType",
                url: app.baseUrl + "frontEndEditor/loadReferenceSelectorBasedOnType",
                data: {type: currentType},
                dataType: "html",
                success: function (resp) {
                    typeRefColumn.html(resp).show();
                    typeRefColumn.parent().updateUi();
                    typeRefColumn.find('.create-new').remove();
                    //_form.updateValidator();
                    var itemRefInput = _form.find('select[name=itemRef]');
                    itemRefInput.closest('.fee-row').find('input[name=label]').val(itemRefInput.find("option[value='" + itemRefInput.val() + "']").text());
                    _form.find("button").show();
                }
            });
        });
        _form.updateUi();
        _self.trackClickEvent = false;
    }

    if (newItem && _self.createItemCache) {
        populateInput(_self.createItemCache.clone());
    } else {
        bm.ajax({
            url: app.baseUrl + "frontEndEditor/createNavigation",
            dataType: "html",
            data: data,
            success: function (resp) {
                resp = $(resp);
                populateInput(resp);
            }
        });
    }
};

_nav.serialize = function (wrapper) {
    var items = [];
    wrapper.find(".bmui-stl-entry:not(.fee-add-panel)").each(function (placement) {
        var item = $(this);
        var updateCache = item.attr("update_cache");
        items.push({
            id: item.attr("item_id"),
            parent: item.attr("parent"),
            placement: placement,
            update_cache: updateCache ? JSON.parse(updateCache) : undefined
        });
    });
    return items;
};

_nav.beforeSave = function (ajaxSettings) {
    var serializedObject = this.serialize(this.configPanel);
    ajaxSettings.data = {
        updatedJSON: JSON.stringify(serializedObject),
        widgetType: 'navigation',
        params: JSON.stringify({title: this.configPanel.find("input[name=title]").val(), orientation: this.configPanel.find("input[name=orientation]").val()})
    };
    return true;
};