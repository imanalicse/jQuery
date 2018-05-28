app.FrontEndEditor.prototype.commonFunctions = (function () {
    var _self = this;

    this.getFileName = function (filePath, isExtension) {
        return filePath.filename(isExtension);
    };

    String.prototype.filename = function(extension){
        var s= this.replace(/\\/g, '/');
        s= s.substring(s.lastIndexOf('/')+ 1);
        return extension? s.replace(/[?#].+$/, ''): s.split('.')[0];
    };
    return this;
});