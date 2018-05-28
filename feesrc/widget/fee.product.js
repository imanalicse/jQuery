app.FrontEndEditor.widget.product = function () {
    app.FrontEndEditor.widget.product._super.constructor.apply(this, arguments);
};

var _pr = app.FrontEndEditor.widget.product.inherit(app.FrontEndEditor.widgetBase);

_pr.init = function () {
    var _self = this;
    var panel = this.configPanel;
    this.rightSideFieldName = 'product';
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
    this.initSearch(app.baseUrl + "frontEndEditor/productConfig?onlyLeft=true", function (resp) {
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

_pr.beforeSave = function (ajaxSettings) {
    var configParams = this.lastPage.find('.product-configuration').serializeObject();
    ajaxSettings.data = {
        params: JSON.stringify(configParams || {})
    };
    return true;
};