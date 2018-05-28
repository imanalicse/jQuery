app.FrontEndEditor.widget.image = function () {
    app.FrontEndEditor.widget.image._super.constructor.apply(this, arguments);
};

var _img = app.FrontEndEditor.widget.image.inherit(app.FrontEndEditor.widgetBase);

_img.render = function () {
    return this.configPanel;
};

_img.init = function () {
    this.configPanel.updateUi();
};

_img.bindEvents = function (hostElement) {

    var _self = this;
    var widgetPanel = this.configPanel;

    this.configPanel.find("input[type='file']").on("change", function () {
        if (this.files && this.files[0]) {
            var file = this.files[0];
            var FR = new FileReader();
            FR.onload = function () {
                var imgSrc = FR.result;
                _self.configPanel.find("img").attr('src', imgSrc);
                _self.configPanel.find(".image-name").text(file.name);
                var imageSize = ((file.size)/1000) +" KB";
                _self.configPanel.find(".image-size").text(imageSize);
            };
            FR.readAsDataURL(this.files[0]);
        }
    });

    _self.configPanel.find('form').form({
        ajax: true,
        preSubmit: function (ajaxSettings) {
            $.extend(ajaxSettings, {}, null, {
                success: function (response) {
                    if(response.url) {
                        console.log("response ", response);
                        //currentElement.attr('src', resp.url);

                        //var content = _self.configPanel.find('.htmlEditor').val();
                        var content = "<img src='"+response.url+"'> Hello image content";

                        var widgetUUID = _self.widgetUUID;

                        var cachedData = _self.frontEndInstance.cachedWidgetData[widgetUUID];

                        var url = app.baseUrl + _self.getEditApiUrl();

                        _self.frontEndInstance.ajaxCallee(url, {
                                content: content,
                                widgetType: 'image',
                                uuid: widgetUUID,
                                containerId: $('body').find('.page-id').val(),
                                containerType: 'page'
                            },
                            _self.configPanel).then(function (resp) {
                            console.log("resp ", resp);
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
                                _self.frontEndInstance.portlet.restoreSortable(true);
                                if (_self.frontEndInstance.popupInstance) {
                                    _self.frontEndInstance.popupInstance.close();
                                    widgetElement.closest('.fee-widget-chooser').find('.fee-add-widget').text('+ ' + $.i18n.prop("add.content"));
                                    widgetElement.closest('.fee-widget-chooser').find('.fee-item-list').hide();
                                }
                            });
                        });


                    }
                    //_self.frontEndInstance.popupInstance.close();
                }
            });
        }
    });

    this.configPanel.find(".cancel-button").on("click", function () {
        _self.frontEndInstance.popupInstance.close();
    });
};

_img.beforeSave = function (ajaxSettings) {
    var titleValue = this.configPanel.find("input[name=title]").val();
    ajaxSettings.data = {"alt_text": titleValue, "link_target": "_self"};
    return true;
};