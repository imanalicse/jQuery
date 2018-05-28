app.FrontEndEditor.utils = (function () {

    return {
        getUuid: function (element) {
            var elementId = element.attr("id");
            return elementId ? elementId.substring(elementId.indexOf('wi-') > -1 ? 3 : 6) : "";
        },
        setAnimation: function (element, animationClass) {
            element.addClass(animationClass);
            setTimeout(function () {
                element.removeClass(animationClass)
            }, 300);
        },
        getCssParser: function (styleElement) {
            var cssString = styleElement && styleElement.length ? styleElement.html() : "";
            return new CssParser(cssString).parse();
        },
        copyCss: function (newUuid, prevElement) {
            var prevUuid = this.getUuid(prevElement);
            var elementCssParser = this.getCssParser($('#style-store-' + prevUuid));
            var oldCss = elementCssParser.toString();
            var newCss = oldCss.replace(new RegExp(prevUuid, "g"), newUuid);
            this.persistCss(newUuid, new CssParser(newCss).parse());
        },
        persistCss: function (uuid, css) {
            var tag_def = uuid ? "#style-store-" + uuid : "#stored-css";
            var tag = $("head").find(tag_def);
            if (!tag.length) {
                tag = $("<style id='style-store-" + uuid + "'></style>");
                $("head").append(tag)
            }
            if (css) {
                tag.text(css.toString());
            }
        },
        removeCssStore: function (element) {
            var uuid = this.getUuid(element);
            $('#style-store-' + uuid).remove();
        }
    }
})();