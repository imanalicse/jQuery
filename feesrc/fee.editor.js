app.FrontEndEditor = function () {
    // define property
    this.window = $(window);
    this.pageBody = $("body");
    this.widgetClass = "widget";
    this.contentSaveUrl = "widget/saveContents";
    this.newDocks = [];
    this.removedWidgets = [];
    this.cachedWidgets = {};
    this.cachedWidgetData = {};
    this.activeMedia = '';
    this.gridSelector = ".grid-block";
    this.editableBlockSelector = this.gridSelector + ", .widget-container:not(.grid-block)";
    this.isResponsive = false;
    this.modifiedDocks = [];
    this.activeSection = undefined;
    this.simpleEditorInstance = undefined;

    this.WIDGET_TYPE = {
        COLUMN: 'column',
        WIDGET: 'widget'
    };
    this.WIDGETS = {
        twoColumn: {label: "2 Column", inlineEdit: false, type: this.WIDGET_TYPE.COLUMN},
        threeColumn: {label: "3 Column", inlineEdit: false, type: this.WIDGET_TYPE.COLUMN},
        spacer: {label: "Spacer", inlineEdit: true, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.spacer'},
        html: {label: "Html", inlineEdit: true, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.html'},
        article: {label: "Article", inlineEdit: false, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.article'},
        image: {label: "Image", inlineEdit: false, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.image'},
        navigation: {label: "Navigation", inlineEdit: false, popup: true, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.navigation'},
        product: {label: "Product", inlineEdit: false, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.product'},
        category: {label: "Category", inlineEdit: false, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.category'},
        gallery: {label: "Gallery", inlineEdit: false, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.gallery'},
        snippet: {label: "snippet", inlineEdit: false, popup: true, type: this.WIDGET_TYPE.WIDGET, popupTitle: 'widget.snippet'}

    };

    this.css = new CssParser('').parse();

    var handleInitialLogin = function () {
        if (app.admin_id) return;
        bm.embeddedLogin({ajax_url: app.baseUrl + "page/embeddedLogin", title: null}, function (resp) {
            app.login_feemail = resp.operator_feemail;
            app.admin_id = resp.operator_id
        });
    };

    var trackAjaxCaller = false;

    this.ajaxCallee = function (ajaxUrl, dataParams, loaderWapper) {
        if (!trackAjaxCaller) {
            if(!$(document).hasClass("loader"))
            {
                bm.mask(loaderWapper, '<div><span class="loader"></span></div>');
            }

            trackAjaxCaller = true;
            return bm.ajax({
                url: ajaxUrl,
                data: dataParams,
                response: function () {
                    trackAjaxCaller = false;
                },
                success: function (resp) {
                    return $.when(resp);
                },
                error: function (xhr, status, resp) {
                    bm.unmask(loaderWapper);
                    bm.notify(resp.message, resp.status);
                },
                complete: function(xhr, status, resp) {
                    bm.unmask(loaderWapper);
                }
            });
        }
    };

    this.init = function () {
        handleInitialLogin();
        // define plugins as variable to avoid redundant function call or access as variable
        this.layout = this.layoutBuilder();
        this.style = this.styleBuilder();
        this.portlet = this.portletBuilder();
        this.component = this.uiComponent();
        this.events = this.eventBuilder();
        this.header = this.header();
        this.common = this.commonFunctions();

        // call initialize function
        this.initializeEditor();

    };
    this.init();
};

app.FrontEndEditor.widget = {};

window.addEventListener("load", function load(event) {
    var editorInstance = new app.FrontEndEditor();
    app.FrontEndEditor.settingPanel.init(editorInstance);
});