jQuery(document).ready(function ($) {


    var pageBody = $("body");

    var preferredTimeForm = pageBody.find(".preferred-delivery-content");

    if (preferredTimeForm.length) {

        var customerModel = storageData.get("customerModel");

        if(customerModel === null){
            window.location.href = home_url + "/registration";
        }

        // global variable
        var timeWidthFormSelector = ".time-with-form-wrapper";

        var preferredTimeDom = $("<div class=\"time-with-form-wrapper\">\n" +
            "        <span class=\"time-row time-display\">\n" +
            "            <span class=\"time-display-fields\">\n" +
            "                <span class=\"preferred-time start-time-label\"></span>\n" +
            "                <span class=\"preferred-time end-time-label\"></span>\n" +
            "            </span>\n" +
            "            <span class=\"time-row-edit\">\n" +
            "                <span class=\"edit-time\"></span>\n" +
            "                <span class=\"delete-time\"></span>\n" +
            "            </span>\n" +
            "        </span>\n" +
            "        <span class=\"time-form-wrapper\"></span>\n" +
            "    </div>");

        preferredTimeListDom();

        function preferredTimeListDom() {
            var customerModel = storageData.get("customerModel");
            if(customerModel != null) {
                var preferredTimes = customerModel.preferredTimes;
                $.each(preferredTimes, function (day, times) {
                    if (times.length) {
                        var row = preferredTimeForm.find("." + day + "-row");
                        var timeFormWrapper = row.find(".item-preferred-middle").empty();
                        for (var i = 0; i < times.length; i++) {
                            var time = times[i];
                            var timeDom = preferredTimeDom.clone();
                            timeDom.closest(timeWidthFormSelector).attr("data-position", i);
                            timeDom.find(".start-time-label").html(getDisplayHour(time.startTime));
                            timeDom.find(".end-time-label").html(getDisplayHour(time.endTime));
                            timeFormWrapper.append(timeDom);
                        }
                    }
                });
            }
        }

        var timeForm = $("<form class=\"preferred-time-form\">\n" +
            "        <div class=\"start-time-row\">\n" +
            "            <label for=\"startTime\">Start</label>\n" +
            "            <select name=\"startTime\" class=\"start-time time-option\">\n" +
            "                <option value=\"\">08:00</option>\n" +
            "            </select>\n" +
            "        </div>\n" +
            "        <div class=\"end-time-row\">\n" +
            "            <label for=\"endTime\">End</label>\n" +
            "            <select name=\"endTime\" class=\"end-time time-option\">\n" +
            "                <option value=\"\">08:00</option>\n" +
            "            </select>\n" +
            "        </div>\n" +
            "        <span class=\"message error\"></span>\n" +
            "        <div class=\"footer-panel action-control\">\n" +
            "            <button class='btn-submit' value=\"Submit\">Save</button> \n" +
            "            <button type='button' class='btn-close' value=\"Cancel\">Cancel</button> \n" +
            "        </div>\n" +
            "    </form>");


        var blankTimeForm = "<span class=\"time-row time-display\">\n" +
            "                                        <span class=\"\">\n" +
            "                                            <span class=\"preferred-time\"></span>\n" +
            "                                            <span class=\"preferred-time\"></span>\n" +
            "                                        </span>\n" +
            "                                    </span>\n" +
            "                                    <span class=\"time-form-wrapper\"></span>";

        var timeOptions = "";
        var timeStarValue = 7;
        for (var i = 7; i <= 21; i++) {
            var hour = i;
            var displayHour = getDisplayHour(hour);
            timeOptions += "<option value=" + hour + ">" + displayHour + "</option>";
        };

        timeForm.find(".time-option").empty().append(timeOptions);

        function getDisplayHour(hour) {
            var displayHour = hour;
            var meridiemType = hour < 12 ? 'am':'pm';
            if(hour > 12){
                displayHour = hour - 12;
            }
            displayHour = displayHour + ".00" + meridiemType;

            return displayHour;
        }

        var actionEvent = {
            init: function () {
                this.delete();
                this.edit();
                //this.hover();
            },
            delete: function () {
                preferredTimeForm.find(".delete-time").on("click", function () {
                    var _self = $(this);
                    var row = _self.closest(".row-preferred");
                    var day = row.attr("data-day");
                    var position = _self.closest(timeWidthFormSelector).attr("data-position");

                    // update session data
                    var customerModel = storageData.get("customerModel");
                    var preferredTimes = customerModel.preferredTimes;
                    preferredTimes[day].splice(position, 1);
                    customerModel.preferredTimes = preferredTimes;
                    storageData.set("customerModel", customerModel);

                    var customerModel = storageData.get("customerModel");
                    if(customerModel.preferredTimes[day].length) {
                        _self.closest(timeWidthFormSelector).remove();
                    }else{
                        _self.closest(timeWidthFormSelector).html(blankTimeForm);
                    }
                });
            },
            edit: function () {
                preferredTimeForm.find(".edit-time").on("click", function () {
                    var _self = $(this);
                    var row = _self.closest(".row-preferred");
                    var day = row.attr("data-day");
                    var timeFromWrapper = _self.closest(timeWidthFormSelector);
                    var position = timeFromWrapper.attr("data-position");

                    preferredTimeForm.find(".preferred-time-form").removeClass("form-opened-error");
                    if(row.find(".preferred-time-form").length){
                        //row.find(".preferred-time-form").find(".btn-close").trigger("click");
                        row.find(".preferred-time-form").addClass("form-opened-error");
                        return false;
                    } else if(preferredTimeForm.find(".preferred-time-form").length){
                        preferredTimeForm.find(".preferred-time-form").addClass("form-opened-error");
                        return false;
                    }

                    timeFromWrapper.find(".time-form-wrapper").empty().append(timeForm);

                    var customerModel = storageData.get("customerModel");

                    if(customerModel.preferredTimes == undefined){
                        customerModel.preferredTimes = {}
                    }

                    if(customerModel.preferredTimes[day] ==undefined){
                        customerModel.preferredTimes[day] = [];
                    }

                    var preferredTimes = customerModel.preferredTimes;

                    var timeFromWrapper = _self.closest(timeWidthFormSelector);
                    if(position != undefined) {
                        var formData = preferredTimes[day][position];
                        timeFromWrapper.find(".start-time").val(formData.startTime);
                        timeFromWrapper.find(".end-time").val(formData.endTime);
                        timeFromWrapper.find(".preferred-time-form").attr("data-action-type", 'edit');
                    }else{
                        timeFromWrapper.find(".start-time").val(timeStarValue);
                        timeFromWrapper.find(".end-time").val(timeStarValue);
                        timeFromWrapper.find(".preferred-time-form").attr("data-action-type", 'add');
                    }

                    formEvent.init();
                    timeFromWrapper.find(".time-display").hide();
                });
            },
            hover: function () {
                preferredTimeForm.find(timeWidthFormSelector).on("mouseenter", function () {
                    var _self = $(this);
                    _self.find(".time-row-edit").show();
                });
                preferredTimeForm.find(timeWidthFormSelector).on("mouseleave", function () {
                    var _self = $(this);
                    _self.find(".time-row-edit").hide();
                });
            }
        }

        var formEvent = {
            init: function () {
                this.submit();
                this.close();
            },
            submit: function () {
                preferredTimeForm.find(".btn-submit").on("click", function (e) {
                    e.preventDefault();
                    preferredTimeForm.find(".preferred-time-form").removeClass("form-opened-error");
                    var _self = $(this);
                    var currentRow = $(this).closest(".row-preferred");
                    var form = $(this).closest("form");
                    var formData = $(form).serializeFormObject();
                    var day = currentRow.attr("data-day");
                    var preferredTimeObj = {
                        startTime: parseInt(formData.startTime),
                        endTime: parseInt(formData.endTime)
                    };
                    form.find(".message").html("");
                    if (preferredTimeObj.startTime >= preferredTimeObj.endTime) {
                        form.find(".message").html("End time should be bigger");
                        return false;
                    }

                    var customerModel = storageData.get("customerModel");

                    if(customerModel.preferredTimes == undefined){
                        customerModel.preferredTimes = {}
                    }

                    if(customerModel.preferredTimes[day] ==undefined){
                        customerModel.preferredTimes[day] = [];
                    }

                    var preferredTimes = customerModel.preferredTimes[day];

                    // in editable mode
                    var position = _self.closest(timeWidthFormSelector).attr("data-position");
                    var actionMode = form.attr("data-action-type");
                    if(actionMode == 'edit'){
                        preferredTimes.splice(position, 1);
                    }
                    if(preferredTimes.length){
                        var is_overlap = isOverlap(preferredTimes, preferredTimeObj);
                        if(is_overlap){
                            form.find(".message").html("Preferred Time overlapped");
                            return false;
                        }
                    }

                    //var customerModel = storageData.get("customerModel");

                    if(actionMode == 'edit'){
                        customerModel.preferredTimes[day][position] = preferredTimeObj;
                    }else {
                        customerModel.preferredTimes[day].push(preferredTimeObj);
                    }
                    storageData.set("customerModel", customerModel);
                    preferredTimeListDom();

                    preferredTimeForm.find(".btn-close").trigger("click");

                    actionEvent.init();
                });
            },
            close: function () {
                preferredTimeForm.find(".btn-close").on("click", function (e) {
                    e.preventDefault();
                    preferredTimeForm.find(".preferred-time-form").removeClass("form-opened-error");
                    var formWrapper = $(this).closest(timeWidthFormSelector);
                    formWrapper.find(".message").empty();
                    var position = formWrapper.attr("data-position");

                    var actionType = formWrapper.find(".preferred-time-form").attr("data-action-type");
                    if(actionType == 'add'){
                        if(position === undefined){
                            formWrapper.html(blankTimeForm);
                        }else {
                            formWrapper.remove();
                        }
                    }else {
                        formWrapper.find(".time-form-wrapper").empty();
                        formWrapper.find(".time-display").show();
                    }
                });
            }
        }
        
        function isOverlap(preferredTimes, entryTime) {
            var overlapTimes = [];
            for(var i= 0; i < preferredTimes.length; i++){
                var existingTime = preferredTimes[i];
                if((entryTime.startTime < existingTime.endTime) && (entryTime.endTime > existingTime.startTime)){
                    overlapTimes.push(entryTime)
                }
            }
           return overlapTimes.length;
        }

        preferredTimeForm.find(".plus-button").on("click", function () {
            var currentRow = $(this).closest(".row-preferred");
            var timeFormWrapper = currentRow.find(".time-with-form-wrapper");

            currentRow.find(".item-preferred-button").attr("disabled", false);
            if(timeFormWrapper.find(".preferred-time-form").length){
                currentRow.find(".item-preferred-button").attr("disabled", true);
                return false;
            }

            var dataPosition = timeFormWrapper.attr("data-position");
            if(dataPosition == undefined){
                timeFormWrapper.remove();
            }

            var timeDom = preferredTimeDom.clone();
            currentRow.find(".item-preferred-middle").append(timeDom);
            actionEvent.init();
            currentRow.find(".time-with-form-wrapper:last").find(".edit-time").trigger("click");
        });

        actionEvent.init();
    }
});
