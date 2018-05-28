app.FrontEndEditor.widget.category = function () {
    app.FrontEndEditor.widget.category._super.constructor.apply(this, arguments);
};

var _ct = app.FrontEndEditor.widget.category.inherit(app.FrontEndEditor.widgetBase);

_ct.init = function () {
    var _self = this;
    var panel = this.configPanel;
    this.rightSideFieldName = 'category';
    var loadLeftPanel = function () {
        _self.initLeftTablePanel();
        _self.leftTable = panel.find('.left-table');
        _self.selectLeftTableRows();
        _self.initPagination(undefined, function (resp) {
            _self.leftPanel.html(resp);
            loadLeftPanel();
        });
        _self.leftPanel.updateUi();
    };
    this.initSearch(app.baseUrl + "frontEndEditor/categoryConfig?onlyLeft=true", function (resp) {
        _self.leftPanel.html(resp);
        loadLeftPanel();
    });
    this.initPagination(undefined, function (resp) {
        _self.leftPanel.html(resp);
        loadLeftPanel();
    });
    this.initMultiTablePanel();
    this.initPage();
    panel.updateUi();
    panel.on("keypress", "form", function (event) {
        return event.keyCode != 13;
    });
};

_ct.beforeSave = function (ajaxSettings) {
    var configParams = this.lastPage.find('.category-configuration').serializeObject();
    ajaxSettings.data = {
        params: JSON.stringify(configParams || {})
    };
    return true;
};