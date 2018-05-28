app.FrontEndEditor.widget.html = function () {
    app.FrontEndEditor.widget.html._super.constructor.apply(this, arguments);
};

var _html = app.FrontEndEditor.widget.html.inherit(app.FrontEndEditor.widgetBase);

_html.render = function () {
    return this.configPanel;
};

_html.init = function (hostElement) {
    var widgetConfigPanel = $("<div/>").addClass('fee-widget-config-panel widget-html');
    this.configPanel = widgetConfigPanel;

    this.textAreaElement = $("<textarea class=\"htmlEditor\"></textarea>");

    var innerBody = $("<div class='fee-pu-content-body'></div>");
    innerBody.append(this.textAreaElement);

    innerBody.find(".htmlEditor").redactor({
        focus: true,
        plugins: ['fontcolor', 'fontsize', 'bufferbuttons', 'source']
    });

    this.configPanel.append(innerBody);
    this.configPanel.append("<div class=\"fee-button-wrapper fee-pu-content-footer\">\n" +
        "            <button class=\"fee-save fee-pu-button\" type=\"submit\" style=\"\">Save</button>\n" +
        "            <button class=\"fee-cancel fee-pu-button\" type=\"button\" style=\"\">Cancel</button>\n" +
        "        </div>");

    this.bindEvents(hostElement);

};

_html.getEditApiUrl = function () {
    return 'widget/save' + this.widgetType.capitalize() + 'Widget';
}

_html.getContentIdKey = function () {
    return "id";
}

_html.getContentValueKey = function () {
    return "content";
}

_html.addAdditionalData = function (data) {
}

_html.getContentId = function () {
    return "";
}


_html.getContentValue = function () {
    var widgetValue =  this.configPanel.clone();
    widgetValue.removeClass('fee-widget-row fee-widget-column fee-widget-row-active fee-widget-column-active fee-active-state fee-widget-selected-container');
    widgetValue.find(".fee-overlay").remove();
    widgetValue.find(".fee-widget-menu").remove();
    widgetValue.filter(".fee-overlay,.fee-border-overlay,.fee-widget-chooser,.fee-widget-command,.fee-after,.fee-before,.bmui-resize-handle,.fee-resize-info,.bmui-sortable-placeholder,.fee-add-content,.fee-menu-bar,.fee-floating-editor-menu").replaceWith("");

    return widgetValue.html();
};

_html.bindEvents = function (hostElement) {

    var widgetPanel = this.configPanel;
    //var hostElement;

    var _self = this;
    this.configPanel.find(".fee-save").click(function (e) {
        var content = _self.configPanel.find('.htmlEditor').val();

        var widgetUUID = _self.widgetUUID;

        var cachedData = _self.frontEndInstance.cachedWidgetData[widgetUUID];

        var url = app.baseUrl + _self.getEditApiUrl();

        _self.frontEndInstance.ajaxCallee(url, {
            content: content,
            widgetType: 'html',
            uuid: widgetUUID,
            containerId: $('body').find('.page-id').val(),
            containerType: 'page'
        },
            _self.configPanel).then(function (resp) {

            var parentElement = widgetPanel.parents('.fee-widget-chooser:first').length > 0 ? widgetPanel.parents('.fee-widget-chooser:first') : widgetPanel;
            var widgetElement = _self.frontEndInstance.layout.widget.update(parentElement, resp.html, _self.widgetType, widgetUUID, typeof cachedData !== 'undefined');

            _self.widgetContentPlacement(hostElement, widgetElement);

            var rowPanel = hostElement.closest('.fee-widget-row');
            widgetElement.data('data-cache', resp['serialized']);
            _self.frontEndInstance.cachedWidgetData[widgetUUID] = resp;
            var widgetData = JSON.parse(resp.serialized);
            _self.frontEndInstance.cachedWidgetData[widgetUUID]['serialized'] = widgetData;

            _self.frontEndInstance.events.save(function () {
                _self.frontEndInstance.layout.setColumnAsEqualHeight(rowPanel);
                //_self.frontEndInstance.portlet.restoreSortable(true);
                if (_self.frontEndInstance.popupInstance) {
                    _self.frontEndInstance.popupInstance.close();
                    widgetElement.closest('.fee-widget-chooser').find('.fee-add-widget').text('+ ' + $.i18n.prop("add.content"));
                    widgetElement.closest('.fee-widget-chooser').find('.fee-item-list').hide();
                }
            });
        });
    });

    this.configPanel.find(".fee-cancel").click(function (e) {
        _self.frontEndInstance.popupInstance.close()
    });
};

_html.beforeSave = function (data) {
    return true;
};
