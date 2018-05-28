app.FrontEndEditor.widget.spacer = function () {
    app.FrontEndEditor.widget.spacer._super.constructor.apply(this, arguments);
};

var _spacer = app.FrontEndEditor.widget.spacer.inherit(app.FrontEndEditor.widgetBase);

_spacer.render = function (existValues, cachedData) {
    var widgetConfigPanel = $(this.getInlineWidgetConfigPanel());
    this.configPanel = widgetConfigPanel;
    var inputElement = $("<input type='text' placeholder=\"Enter spacer height\" validation='required number' class=\"spacerHeight\">");
    if (cachedData && cachedData.serialized.params) {
        var cacheParams = JSON.parse(cachedData.serialized.params);
        inputElement.val(cacheParams.height);
    }
    widgetConfigPanel.find('.fee-config-body').append(inputElement);
    return widgetConfigPanel;
};

_spacer.init = function (contentElement) {
};

_spacer.getWidgetValue = function () {
    var height = this.configPanel.find('.spacerHeight').val();
    return '<div class="spacer" style="height:' + height + 'px"><span>Spacer-' + height + '</span></div>';
};
_spacer.beforeSave = function (data) {
    return $.extend(data, {
        params: '{"height": "' + this.configPanel.find('.spacerHeight').val() + '"}'
    });
};