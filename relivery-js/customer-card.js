jQuery(document).ready(function ($) {


    var pageBody = $("body");

    var cardForm = pageBody.find(".card-form");

    if (cardForm.length) {

        var customerModel = storageData.get("customerModel");

        if(customerModel === null){
            window.location.href = home_url;
        }

        $.ajax({
            type: "GET",
            url: webapiuri + "/card/type",
            success: function (response) {
                var optionHtml = "<option value=''>Please select card</option>";
                $.each(response.data, function (index, value) {
                    optionHtml += "<option value='" + value.id + "'>" + value.name + "</option>";
                });
                cardForm.find(".card-type").html(optionHtml);
            }
        });

        var validator =  cardForm.validate({
            rules: {
                cardNumber: {
                    required: true
                },
                cardName: {
                    required: true
                },
                cardTypeId: {
                    required: true
                },
                expirydate: {
                    required: true
                }
            },
            messages: {
                cardNumber: "Card Number is required",
                cardName: {
                    required: "Card Name is required"
                },
                cardTypeId: {
                    required: "Card Type is required"
                },
                expirydate: {
                    required: "Expiry Date is required"
                }
            }
        });

        cardForm.find(".submit").on("click", function () {
            var _self = $(this);

            var submitErrorListSelector = cardForm.find(".submit-error-list");
            submitErrorListSelector.empty();

            var cardData = cardForm.serializeFormObject();
            var customerModel = storageData.get("customerModel");

            customerModel.customer.termsAndConditions = true;
            customerModel.customer.mobile = "";

            var customerApiModel = {};
            customerApiModel.customer = customerModel.customer;
            customerApiModel.preferredTimes = bindApiPreferredTimes(customerModel.preferredTimes);

            if(_self.hasClass("card-add")){
                var isValidForm = cardForm.valid();
                if(!isValidForm){
                    return false;
                }
                customerApiModel.card = cardData;
            }else{
                customerApiModel.card = null;
            }

            $.ajax({
                type: "POST",
                data: JSON.stringify(customerApiModel),
                contentType: "application/json",
                url: identitywebapiuri + "/account/register/customer/full",
                error: function (jqXHR, textStatus, errorThrown) {

                    var jsonResponse = jqXHR.responseJSON;
                    var cardErrorObj = {};
                    var errorList = "";
                    var formError = false;
                    if(jsonResponse.data.length){
                        var data = jsonResponse.data;
                        for (var i = 0; i <data.length; i++ ){
                            var error = data[i];
                            if(error.source == 'Card.CardNumber'){
                                formError = true;
                                cardErrorObj['cardNumber'] = error.message;
                                continue;
                            }
                            if(error.source == 'Card.ExpiryDate'){
                                formError = true;
                                cardErrorObj['expirydate'] = error.message;
                                continue;
                            }
                            errorList += "<li>" +error.message+ "</li>"
                        }
                    }
                    submitErrorListSelector.html(errorList);
                    if(formError){
                        validator.showErrors(cardErrorObj);
                    }
                },
                success: function (response) {
                    if(response.status.code==200){
                        storageData.remove("customerModel");
                        storageData.remove("selectedAddress");
                        window.location.href = home_url + "/success";
                    }else{
                        console.log("Please try again", response);
                    }
                }
            });
        });
    }
    
    
    function bindApiPreferredTimes(prefTimes) {
        var preferredTimes = [];
        $.each(prefTimes, function (day, times) {
            if(times.length){
                for (var i =0; i < times.length; i++){
                    var time = times[i];
                    var obj = {
                        //customerId: 0,
                        startTime: time.startTime+":00:00",
                        endTime: time.endTime+":00:00",
                        day: day
                    }
                    preferredTimes.push(obj);
                }
            }
        });
       return preferredTimes;
    }
});
