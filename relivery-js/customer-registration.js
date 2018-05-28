jQuery(document).ready(function ($) {

    var pageBody = $("body");
    var placesService = new google.maps.places.PlacesService(document.createElement('div'));

    var registrationForm = pageBody.find(".registration-form");

    if (registrationForm.length) {

        var selectedAdd = storageData.get("selectedAddress");
        var customerModel = storageData.get("customerModel");

        if (selectedAdd == null) {
            window.location.href = home_url;
        } else {
            autoFillAddressPopulate();
        }

        if (customerModel) {
            populateFormData(registrationForm, customerModel.customer);
        }

        registrationFormValidation();

        registrationForm.find(".terms-and-condition").on("click", function () {
            var _self = $(this);
            if (_self.prop("checked")) {
                registrationForm.find(".email-exist-error-msg").html("");
                var isValidForm = registrationForm.valid();
                if (isValidForm) {
                    registrationForm.find(".submit").prop("disabled", false)
                } else {
                    _self.prop("checked", false);
                }
            }
        });
    }

    function registrationFormValidation() {

        //var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
        var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        $.validator.addMethod('password', function (value) {
            return passwordPattern.test(value);
        }, 'Invalid Password format');


        var validator = registrationForm.validate({
            rules: {
                firstName: {
                    required: true
                },
                emailAddress: {
                    required: true,
                    email: true
                },
                addressLine1: {
                    required: true
                },
                postCode: {
                    required: true,
                    digits: true,
                    minlength: 4,
                    maxlength: 4
                },
                stateId: {
                    required: true
                },
                password: {
                    required: true
                },
                confirmPassword: {
                    required: true,
                    equalTo: ".password"
                },
                termsAndConditions: {
                    required: true
                }
            },
            messages: {
                firstName: "First Name is required",
                addressLine1: "Address Line 1 is required",
                emailAddress: {
                    required: "Email is required",
                    email: "Please enter a valid email address"
                },
                password: {
                    required: "Password is required field"
                },
                confirmPassword: {
                    required: "Confirm password is required field",
                    equalTo: "Password does not match"
                },
                termsAndConditions: {
                    required: "Please accept terms and conditions"
                }
            },
            submitHandler: function (form) {

                var emailEl = $(form).find(".email");
                var email = emailEl.val().trim();
                $.ajax({
                    type: "GET",
                    url: identitywebapiuri + "/account/emailexists",
                    data: {
                        emailAddress: email
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus)
                    },
                    success: function (response) {
                        if (response.status.code == 200) {
                            validator.showErrors({
                                emailAddress: "Email already exist"
                            });

                            jQuery("html, body").animate({
                                scrollTop: parseInt(jQuery(".registration-form").offset().top) - 20
                            }, 500);

                            return false;
                        } else {
                            console.log("Email not found");
                            var customerData = $(form).serializeFormObject();
                            var customerModel = storageData.get("customerModel");
                            if (customerModel == null) {
                                customerModel = {}
                            }
                            customerModel.customer = customerData;
                            storageData.set("customerModel", customerModel);
                            //window.location.href = home_url + "/preferred-time";
                            submitRegister();
                        }
                    }
                });
            }
        });
    }

    function submitRegister() {
        var customerModel = storageData.get("customerModel");

        var customerApiModel = {};
        customerApiModel.customer = customerModel.customer;
        customerModel.customer.termsAndConditions = true;
        customerApiModel.preferredTimes = [];
        customerApiModel.card = null;
        $.ajax({
            type: "POST",
            data: JSON.stringify(customerApiModel),
            contentType: "application/json",
            url: identitywebapiuri + "/account/register/customer/full",
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (response) {
                if (response.status.code == 200) {
                    storageData.remove("customerModel");
                    storageData.remove("selectedAddress");
                    window.location.href = home_url + "/success";
                } else {
                    console.log("Please try again", response);
                }
            }
        });
    }

    $.fn.serializeFormObject = function () {
        var formData = $(this).serializeArray();
        var result = {};
        $.each(formData, function (index, value) {
            result[value.name] = value.value;
        });
        return result;
    };

    function populateFormData(form, dataObj) {

        form.find("input").each(function (index) {
            var _self = $(this);
            var name = _self.prop("name");
            var type = _self.prop("type");
            switch (type) {
                case "text":
                case "email":
                    _self.val(dataObj[name]);
                    break;
                case "checkbox":
                    if (dataObj[name] == 'on' || dataObj[name] === true) {
                        //_self.prop("checked", true);
                    }
                    break;
            }
        });

        form.find("select").each(function () {
            var _self = $(this);
            var name = _self.prop("name");
            var currentOption = _self.find("option[value=" + dataObj[name] + "]");
            currentOption.prop("selected", "selected");
        });
    }


    function statesApiDataIntegrate(state, callback) {
        $.ajax({
            type: "GET",
            url: webapiuri + "/states",
            success: function (response) {
                // var state = selectedAdd.state_short_code;
                var optionHtml = "";
                $.each(response.data, function (index, value) {
                    var selected = "";
                    if (state == value.name) {
                        selected = "selected='selected'"
                    }
                    optionHtml += "<option value='" + value.id + "' " + selected + ">" + value.name + "</option>";
                });
                registrationForm.find(".state").html(optionHtml);
                if (callback) {
                    callback()
                }
            }
        });
    }

    function autoFillAddressPopulate() {
        placesService.getDetails({placeId: selectedAdd.place_id}, function (place, status) {
            var address1 = '';
            var city;
            var postcode;
            var state;
            var country;
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (addressType === 'street_number') {
                    address1 += place.address_components[i]['short_name'] ? place.address_components[i]['short_name'] : ''
                }
                if (addressType === 'route') {
                    address1 += place.address_components[i]['long_name'] ? ', ' + place.address_components[i]['long_name'] : ''
                }
                if (addressType === 'locality') {
                    address1 += place.address_components[i]['long_name'] ? ' ' + place.address_components[i]['long_name'] : ''
                }
                if (addressType.indexOf('administrative_area_level') != -1) {
                    city = place.address_components[i]['long_name'] ? place.address_components[i]['long_name'] : ''
                    state = place.address_components[i]['short_name'] ? place.address_components[i]['short_name'] : ''
                }
                if (addressType === 'postal_code') {
                    postcode = place.address_components[i]['short_name'] ? place.address_components[i]['short_name'] : ''
                }
                if (addressType === 'country') {
                    country = place.address_components[i]['long_name'] ? place.address_components[i]['long_name'] : ''
                }
            }
            statesApiDataIntegrate(state, function () {
                registrationForm.find(".address-line-1").val(address1);
                registrationForm.find(".city").val(city);
                registrationForm.find(".post-code").val(postcode);
            });
        })
    }

    var popupEl = pageBody.find(".terms-and-conditons-popup");
    $(".terms-and-conditons").on("click", function (ev) {
        ev.preventDefault();
        popupEl.fadeIn();
    });

    popupEl.find(".cancel").on("click", function (e) {
        e.preventDefault();
        popupEl.fadeOut();
    });

    //Tooltip
    pageBody.find(".tooltip-info").on("click", function () {
        pageBody.find(".toolitp-block").toggleClass("active");
    });
    pageBody.click(function (e) {
        var curEl = $(e.target);
        if (curEl.closest('.tooltip-info').length < 1) {
            pageBody.find(".toolitp-block").removeClass("active");
        }
    });
});
