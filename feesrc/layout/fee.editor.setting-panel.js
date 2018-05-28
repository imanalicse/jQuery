app.FrontEndEditor.settingPanel = function () {
    var pageBody, editorInstance = {};
    var popupInstance;

    var root_selector_menu_entries = [
        {
            ui_class: "edit",
            action: "edit"
        } ,
        {
            ui_class: "remove",
            action: "remove"
        }
    ];

    var selectMedia = function (panel) {
        var $this = $(this), screenWidth = $this.attr('data-screen');
        panel.find('.fee-media-chooser.active').removeClass('active');
        $this.closest(".fee-add-btn").find(".fee-add-item i").attr("class", $this.find("i").attr("class"));
        panel.find(".fee-add-menu-active").removeClass("fee-add-menu-active");
        $this.addClass('active');
        addMediaScreen(screenWidth);
    };

    var addMediaScreen = function addMediaScreen(screenClass) {
        var media = bm.queryParams('mediaPreview');
        var iframePreviewElement = pageBody.find('.fee-media-preview');
        var mediaPreviewPanel = pageBody.find('.fee-media-preview-panel');
        if (media !== "true") {
            if (mediaPreviewPanel.length < 1) {
                mediaPreviewPanel = $("<div class='fee-media-preview-panel " + screenClass + "'><div class='fee-preview-wrapper'></div>");

                var previewSelector = "<div class='top-panel'><div class='url-panel'><div class='reload-icon'><i class=\"fa fa-repeat\"></i></div>" +
                    "<div class='url'></div></div>" +
                    "<div class=\"fee-add-btn media-selector\" data-type=\"media-selector\">\n" +
                    "        <ul class=\"fee-add-menu media-selector\">\n" +
                    "            <li class=\"fee-media-chooser active\" data-screen=\"full\">\n" +
                    "                <i class=\"fa fa-desktop\"></i>\n" +
                    "                <span class=\"fee-title\">Desktop Mode</span>\n" +
                    "            </li>\n" +
                    "            <li class=\"fee-media-chooser fee-tab-landscape\" data-screen=\"ipad-landscape\">\n" +
                    "                <i class=\"fa fa-tablet\"></i>\n" +
                    "                <span class=\"fee-title\">Tablet Mode (landscape 1024px)</span>\n" +
                    "            </li>\n" +
                    "            <li class=\"fee-media-chooser\" data-screen=\"ipad-portait\">\n" +
                    "                <i class=\"fa fa-tablet\"></i>\n" +
                    "                <span class=\"fee-title\">Tablet Mode (768px)</span>\n" +
                    "            </li>\n" +
                    "            <li class=\"fee-media-chooser fee-mobile-landscape\" data-screen=\"mobile-landscape\">\n" +
                    "                <i class=\"fa fa-mobile\"></i>\n" +
                    "                <span class=\"fee-title\">Mobile Mode (landscape 767px)</span>\n" +
                    "            </li>\n" +
                    "            <li class=\"fee-media-chooser\" data-screen=\"mobile-portait\">\n" +
                    "                <i class=\"fa fa-mobile\"></i>\n" +
                    "                <span class=\"fee-title\">Mobile Mode (479px)</span>\n" +
                    "            </li>\n" +
                    "        </ul>\n" +
                    "    </div><div class='close-button'><button class='fee-btn close'>Close</button></div></div>"
                mediaPreviewPanel.find(".fee-preview-wrapper").append(previewSelector)
            } else {
                mediaPreviewPanel.removeAttr('class').addClass("fee-media-preview-panel " + screenClass);
                pageBody.find('>*:not(iframe,.fee-admin-bar)').hide();
                mediaPreviewPanel.show();
            }
            mediaPreviewPanel.find('.fee-media-chooser').on('click', function (ev) {
                selectMedia.call(this, mediaPreviewPanel)
                ev.preventDefault()
            });
            mediaPreviewPanel.find(".close-button .close").on("click", function () {
                pageBody.find('>*:not(iframe,.fee-admin-bar)').show();
                $("body").removeClass("fee-preview");
                $("body").find(".popup-mask,.div-mask").remove();
                mediaPreviewPanel.remove();
            })
            if (iframePreviewElement.length < 1) {
                var currentUrl = window.location.href;
                if (currentUrl.indexOf('?') > -1) {
                    currentUrl = currentUrl.replace('&mediaPreview=true', '') + '&mediaPreview=true';
                } else {
                    currentUrl = currentUrl + '?mediaPreview=true';
                }
                mediaPreviewPanel.hide();
                mediaPreviewPanel.find(".fee-preview-wrapper").append("<div class='iframe-panel'><iframe frameborder='0' src='" + currentUrl + "' class='fee-media-preview'/></div>");
                mediaPreviewPanel.find(".top-panel .url").text(currentUrl)
                pageBody.append(mediaPreviewPanel);
                bm.mask($('body'), '<div><span class="loader"></span></div>');
                pageBody.find('.fee-media-preview').on('load', function () {
                    window.top.$('body').addClass("fee-preview");
                    bm.unmask(window.top.$('body'));
                });
            }
        } else {
            window.top.$('body').find('>*:not(iframe,.fee-admin-bar)').hide().removeClass("fee-preview");
            if (iframePreviewElement.length < 1) {
                window.top.$('.fee-media-preview-panel').show();
            } else {
                window.top.$('.fee-media-preview-panel').removeClass(screenClass).hide();
            }
            pageBody.find('.fee-admin-bar').remove();
        }
    };

    var afterPopupLoaded = function (content, config, popupObject, reload) {
        config = $.extend({}, {
            auto_clear_dirty: true,
            auto_close_on_success: true,
            disable_on_submit: true,
            disable_on_invalid: true,
            disable_button_text: undefined,
            submit_n_cancle: true,
            modify_ui: true,
            scrollable: true
        }, config);
        content.updateUi();
        var _success = (config.ajax && config.ajax.success) || config.success;
        var form = content.find("form").not(".search-form"), submitButtons = form.find(".submit-button");
        if (form.length > 0) {
            form.attr("class").split(" ").every(function () {
                var button = submitButtons.filter("." + this + "-submit");
                if (button.length) {
                    submitButtons = button;
                    return false;
                }
            });
        }
        form = form.form({
            //submitButton: template.find(".toolbar-btn.save").add(submitButtons),
            ajax: content.find(".edit-popup-form").attr("no-ajax") == null,
            disable_on_submit: config.disable_on_submit,
            disable_on_invalid: config.disable_on_invalid,
            disable_button_text: config.disable_button_text,
            preSubmit: function (ajaxSettings) {
                $.extend(ajaxSettings, {
                    response: config.response,
                    error: config.error
                }, config.ajax, {
                    success: function (result) {
                        if (_success) {
                            _success.apply(this, arguments);
                        }

                        if (reload === true) {
                            var noticeSelector = $(".fee-common-popup-content .notice");
                            noticeSelector.addClass("success").html("<p>Page has been created successfully</p>").show();

                            setTimeout(function() {
                                var currentUrl = window.location.href;
                                currentUrl = currentUrl.split("?")[0] + "?id="+  result.pageId;
                                window.location = currentUrl;

                                noticeSelector.removeClass("success").html("").hide();

                                if (popupObject) {
                                    popupObject.close(1);
                                }

                            }, 1500);

                        } else {
                            if ($.isFunction(reload)) {
                                reload();
                            }
                        }
                    }
                });
                if (config.beforeSubmit) {
                    return config.beforeSubmit.call(content, form, ajaxSettings ? (ajaxSettings.data = ajaxSettings.data || {}) : null);
                }
            }
        });
        if (popupObject) {
            content.find('.cancel-button').on('click', function () {
                popupObject.close(1);
            });
        }
        form.find(".prefill-value-to").change(function () {
            var value = $(this).val();
            var $prefill = form.find($(this).data("prefill-value-to"));
            if ($.trim(value).length > 0 && $prefill.length > 0 && $.trim($prefill.val()).length == 0) {
                $prefill.val(value);
            }
        });

        content.on("content-change", function (ev, added, removed) {
            if (added) {
                form.obj(ValidationPanel).attach(added.filter("[validation]").add(added.find("[validation]")));
            }
            if (removed) {
                form.obj(ValidationPanel).detach(removed.filter("[validation]").add(removed.find("[validation]")));
            }
        });
    };

    return {
        init: function (frontEndEditorInstance) {
            editorInstance = frontEndEditorInstance;
            pageBody = $("body");
            var adminBar = pageBody.find('.fee-admin-bar');
            pageBody.updateUi();

            var chosen = $(".fee-page-list").data("wcuiChosen");
            if(chosen !== undefined) {
                var rootMenus = "<span class='actions'>";
                root_selector_menu_entries.forEach(function (menu) {
                    rootMenus += '<span class="tool-icon ' + menu.ui_class + '" action="' + menu.action + '"></span>'
                });
                rootMenus += "</span>";

                chosen.results_data.forEach(function (item) {
                    item.html = '<span class="text">' + item.html + '</span>' + rootMenus
                });

                var result_select = chosen.result_select;
                chosen.result_select = function (evt) {
                    var $this = this, target = $(evt.target);
                    if (target.is(".tool-icon")) {
                        var item = $this.results_data[$this.result_highlight.data("optionArrayIndex")];
                        var action = target.attr("action");
                        if (action === 'edit') {
                            var pageInfo = {
                                id: item.value
                            }
                            pageForm(pageInfo);
                        } else if (action === "remove") {

                            bm.confirm($.i18n.prop("confirm.delete", 'page'), function () {
                                var ajaxUrl = app.baseUrl + 'frontEndEditor/deletePage';
                                bm.ajax({
                                    url: ajaxUrl,
                                    data: {id: item.value},
                                    type: 'post',
                                    error: function (jqXHR, textStatus, errorThrown) {
                                    },
                                    success: function (response) {
                                        if (response.status == 'success') {
                                            location.reload();
                                        }
                                    }
                                });
                            }, true);
                        }
                        //$this.results_hide();
                    } else {
                        return result_select.call(this, arguments);
                    }
                };
            }

            adminBar.find('.fee-edit-page select').on('change', function () {
                $(this).closest('form').submit();
            });
            var media = bm.queryParams('mediaPreview');
            var iframePreviewElement = pageBody.find('.fee-media-preview');

            adminBar.find(".fee-preview").on("click", function () {
                addMediaScreen("full");
            });

            if (media === 'true') {
                editorInstance.layout.disableEditor();
            }
            if (media === 'true' && iframePreviewElement.length < 1) {
                var parentMediaScreen = window.top.$('.fee-admin-bar .fee-media-chooser .fa.active').closest('.fee-media-chooser').attr('data-screen');
                addMediaScreen(parentMediaScreen);
            } else {
                if (editorInstance) {
                    adminBar.find('.fee-save').on('click', function (ev) {
                        if (editorInstance) {
                            editorInstance.save(function () {
                                bm.notify($.i18n.prop("page.successfully.saved"), "alert");
                            });
                        }
                        ev.preventDefault();
                    });

                    adminBar.find('.fee-media-chooser').on('click', function (ev) {
                        selectMedia.call(this, adminBar);
                        ev.preventDefault()
                    });

                    adminBar.find('.fee-am-btn.fee-gap').on('click', function (ev) {
                        adminBar.find('.fee-am-btn.fee-no-gap').removeClass('fee-active');
                        $(this).addClass("fee-active");
                        pageBody.removeClass("fee-no-gap-body");
                        ev.preventDefault();
                    });
                    adminBar.find('.fee-am-btn.fee-no-gap').on('click', function (ev) {
                        adminBar.find('.fee-am-btn.fee-gap').removeClass('fee-active');
                        pageBody.addClass("fee-no-gap-body");
                        $(this).addClass("fee-active");
                        ev.preventDefault();
                    });

                    adminBar.find('.fee-am-btn.fee-no-gap').trigger('click');

                    adminBar.find('.fee-add-item.add-new-page').on('click', function () {
                        pageForm();
                    });

                    function pageForm(pageInfo) {

                        var popupConfig = {
                            width: '500px',
                            //title: $.i18n.prop('add.page'),
                            clazz: "fee-page-popup fee-popup",
                            animation_clazz: "animated zoomIn",
                            closing_animation_clazz: "animated fadeOutDown",
                            draggable: false,
                            show_title: false,
                            show_close: false,
                            maximizable: false,
                            minimizable: false
                        };
                        var reload = true;
                        var ajaxUrl = app.baseUrl + 'frontEndEditor/addPage';

                        if(!$(document).hasClass("loader"))
                        {
                            bm.mask($('body'), '<div><span class="loader"></span></div>');
                        }

                        bm.ajax({
                            url: ajaxUrl,
                            dataType: 'html',
                            type: 'get',
                            success: function (resp) {
                                popupConfig.content = $(resp);
                                popupConfig.events = {
                                    content_loaded: function (contentEl) {
                                        afterPopupLoaded($(contentEl.content), {}, contentEl, reload);
                                        console.log(contentEl.content);
                                        if(pageInfo !== undefined){
                                            var popupContent = $(contentEl.content);

                                            var pageForm = popupContent.find("form");

                                            var ajaxUrl = app.baseUrl + 'frontEndEditor/getPage';
                                            bm.ajax({
                                                url: ajaxUrl,
                                                data: { id: pageInfo.id},
                                                type: 'get',
                                                success: function (response) {
                                                    if(response.length){
                                                        var page = response[0];
                                                        var html  = "<input type='hidden' name='id' value='"+page.id+"'>";
                                                        pageForm.append(html);
                                                        pageForm.find("input[name='name']").val(page.name);
                                                        pageForm.find("input[name='title']").val(page.title);
                                                        var layoutId = page.layout.id;
                                                        if(layoutId){
                                                            var layoutSelector = pageForm.find("[name='layoutid']");
                                                            layoutSelector.val(layoutId).trigger("chosen:updated");
                                                        }

                                                        /*var navigationSelector = pageForm.find("[name='linkedNavigations']");
                                                        var chosen = navigationSelector.data("wcuiChosen");*/

                                                        console.log(page)
                                                    }

                                                }
                                            });

                                        }
                                    }
                                };
                                popupInstance = editorInstance.component.renderPopup(popupConfig);

                            },
                            error: function (xhr, status, resp) {
                                bm.unmask($('body'));
                                bm.notify(resp.message, "WC Editor Error");
                            },
                            complete: function(xhr, status, resp) {
                                bm.unmask($('body'));
                            }
                        })
                    }

                }
            }
        }
    };
}();