app.FrontEndEditor.widget.article = function () {
    app.FrontEndEditor.widget.article._super.constructor.apply(this, arguments);
};

var _ar = app.FrontEndEditor.widget.article.inherit(app.FrontEndEditor.widgetBase);

_ar.init = function () {
    var _self = this;
    var panel = this.configPanel;
    panel.find(".article-section,.fee-section-box.fee-search-panel,.fee-table").updateUi();

    var addPanel = panel.find('.fee-add-panel');
    var backButton = panel.find('.fee-back-button');
    var addButton = panel.find('.fee-add-button');
    var configurePanel = panel.find('.article-list-container');
    var saveButton = panel.find(".fee-save");
    var cancelButton = panel.find(".fee-cancel");
    var articleSelectedRowsElm = panel.find(".articleSelectedRows");
    var articleSelectedValues = articleSelectedRowsElm.val();
    if (articleSelectedValues) {
        _self.articleSelectedRows = articleSelectedValues.split(",");
    }

    this.initEditor(addPanel.find('textarea'));
    addButton.on('click', function (ev) {
        addPanel.show();
        configurePanel.hide();
        backButton.show();
        addButton.parent().hide();
        saveButton.show();
        cancelButton.show();
        ev.preventDefault();
    });
    backButton.on('click', function () {
        configurePanel.show();
        addPanel.hide();
        addButton.parent().show();
        backButton.hide();
        saveButton.hide();
        cancelButton.hide();
    });

    backButton.trigger("click");

    if (panel.find(".hideCreateSection").val() === "1") {
        panel.find(".fee-header-top").remove();
    }
    var $searchText = panel.find("[name='searchText']");
    var extraParams = function () {
        var articleTitle = panel.find("#articleTitle").val();
        var selectFormOnly = panel.find(".selectFormOnly").val();
        return {
            widgetId: _self.widgetId, articleTitle: articleTitle,
            selectFormOnly: selectFormOnly === "1", sectionFilter: panel.find("#sectionFilter").val(),
            sortBy: panel.find("table.sortable-table").data("sortby"),
            searchText: $searchText.val(), singleSelect: panel.find(".singleSelect").val() === "1"
        };
    };

    function afterPaginationOrSorting(response) {
        _self.configPanel.find(".article-list-container").html($(response).find(".article-list-container").html());
        _self.initSortable(app.baseUrl + "frontEndEditor/articleConfig?onlyBody=true", afterPaginationOrSorting, extraParams);
        _self.initPagination(app.baseUrl + "frontEndEditor/articleConfig?onlyBody=true", afterPaginationOrSorting, extraParams);
        panel.find(".fee-table").updateUi();
        _self.articleSelectionForWidget();
    }

    this.initSearch(app.baseUrl + "frontEndEditor/articleConfig?onlyBody=true", afterPaginationOrSorting, extraParams);
    this.initPagination(app.baseUrl + "frontEndEditor/articleConfig?onlyBody=true", afterPaginationOrSorting, extraParams);
    this.initSortable(app.baseUrl + "frontEndEditor/articleConfig?onlyBody=true", afterPaginationOrSorting, extraParams);
    panel.on("keypress", "form", function (event) {
        return event.keyCode !== 13;
    });
    _self.articleSelectionForWidget();
};

_ar.articleSelectionForWidget = function () {
    var _self = this;
    this.configPanel.find('.fee-table .fee-insert-btn').on('click', function () {
        var currEl = $(this);
        _self.configPanel.find(".articleSelectedRows").val(currEl.closest('tr').attr('data-id'));
        _self.configPanel.find(".config-form").trigger("submit");
    });
};

_ar.getContentValue = function () {
    var widgetValue =  this.configPanel.find(".article-content").clone();
    widgetValue.removeClass('fee-widget-row fee-widget-column fee-widget-row-active fee-widget-column-active fee-active-state fee-widget-selected-container');
    widgetValue.filter(".fee-overlay,.fee-border-overlay,.fee-widget-chooser,.fee-widget-command,.fee-after,.fee-before,.bmui-resize-handle,.fee-resize-info,.bmui-sortable-placeholder,.fee-add-content,.fee-menu-bar,.fee-floating-editor-menu").replaceWith("");

    return widgetValue.html();
}

_ar.getEditApiUrl = function ()
{
    return 'widget/save' + this.widgetType.capitalize() + 'Widget';
}

_ar.getContentIdKey = function ()
{
    return "article";
}

_ar.getContentValueKey = function ()
{
    return "content";
}

_ar.addAdditionalData = function (data) {
}

_ar.getContentId = function () {
    var articleId =  this.configPanel.find(".article-item").data("article-id");

    return articleId;
}

_ar.beforeSave = function (ajaxSettings) {
    var $article_name = this.configPanel.find("#articleName");
    if ($article_name.length > 0 && $article_name.is(":visible")) {
        if ($.trim($article_name.val()).length === 0) {
            bm.notify($.i18n.prop("article.name.required"), "alert");
            return false
        }
    }
    var titleValue = this.configPanel.find("input[name=title]").val();
    ajaxSettings.data = {
        display_option: 'full',
        clazz: '',
        article_title: 'hide',
        params: JSON.stringify({"title": titleValue, "article_title": "hide", "display_option": "full"})
    };
    _ar.selectedValue = -1;
    return true;
};