var storageData = {
    remove: function (key) {
        if (key) {
            sessionStorage.removeItem(key);
        }
    },
    set: function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var data = JSON.parse(sessionStorage.getItem(key));
        return data;
    }
}

jQuery(document).ready(function ($) {

    var autocompleteService = new google.maps.places.AutocompleteService();
    var searchAddressWrapper;
    var addressWrapper;
    var pageBody = $("body");

    var addressSearchField = $(".address-search-field");

    if (addressSearchField.length) {

        storageData.remove("customerModel");

        addressSearchField.keyup(function () {
            var _self = this;
            searchAddressWrapper = $(_self.closest(".address-search-wrapper"));

            var searchString = $(this).val();
            if (searchString.length > 2) {

                // var data = {
                //     text: searchString,
                //     sources: "openaddresses",
                //     'boundary.country': 'AU',
                //     api_key: 'mapzen-FUEqjhe'
                // };

                // $.ajax({
                //     type: "GET",
                //     // url: "https://search.mapzen.com/v1/autocomplete",
                //     url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchString + ".json?types=address,place&country=AU&limit=5&access_token=pk.eyJ1IjoiZWhzaGFuIiwiYSI6ImNqY3owMndmeTAybjIyd213Mzl5bGFveDEifQ.5H_qjqTRblyUTJPBFI5nSQ",
                //     // data: data,
                //     error: function (jqXHR, textStatus, errorThrown) {
                //         console.log(textStatus)
                //     },
                //     success: function (response) {
                //         autoCompleteAddresses = [];
                //         response.features.forEach(function (item) {
                //             //var label = item.properties.label.replace(", Australia", "");
                //             //autoCompleteAddresses.push(label);
                //             // autoCompleteAddresses.push(item.properties);
                //             var postalcode = 0;
                //             var state_short_code = "";
                //             var place = "";
                //             var locality = "";
                //             item.context.forEach(function(contextItem){
                //                 if(contextItem.id.indexOf("postcode.") !== -1) {
                //                     postalcode = parseInt(contextItem.text)
                //                 }
                //                 if(contextItem.id.indexOf("region.") !== -1) {
                //                     if(contextItem.short_code){
                //                         var shortCodeArr = contextItem.short_code.split("-")
                //                         if(shortCodeArr && shortCodeArr.length > 0 && shortCodeArr[1]){
                //                             state_short_code = shortCodeArr[1]
                //                         }
                //                     }
                //                     state = contextItem.text
                //                 }
                //                 if(contextItem.id.indexOf("place.") !== -1) {
                //                     place = contextItem.text
                //                 }
                //                 if(contextItem.id.indexOf("locality.") !== -1) {
                //                     locality = contextItem.text
                //                 }
                //             });
                //             var _item = {
                //                 label: item.place_name,
                //                 postalcode: postalcode,
                //                 state_short_code: state_short_code,
                //                 place: place,
                //                 locality: locality
                //             }
                //             autoCompleteAddresses.push(_item);
                //         });
                //         populateAddressDropdown(autoCompleteAddresses);
                //     }
                // });

                autocompleteService.getQueryPredictions({
                    input: searchString,
                    componentRestrictions: {
                        country: 'au'
                    },
                }, function (predictions, status) {
                    if (predictions && predictions.length > 0) {
                        var addresses = [];
                        predictions.forEach(function (prediction) {
                            addresses.push({
                                description: prediction.description,
                                place_id: prediction.place_id
                            })
                        });
                        populateAddressDropdown(addresses)
                    }
                });
            }
        });
    }

    function populateAddressDropdown(autoCompleteAddresses) {
        addressWrapper = searchAddressWrapper.find(".address-list");
        var addressList = '';
        $.each(autoCompleteAddresses, function (index, value) {
            // var label = value.label.replace(", Australia", "");
            var label = value.description;
            addressList += "<li rel='" + index + "'>" + label + "</li>";
        });
        addressWrapper.empty().append(addressList);
        var ps = new PerfectScrollbar(".address-list");
        addressWrapper.find("li").on("click", function () {
            var selectedAddress = autoCompleteAddresses[$(this).attr("rel")];
            var selectedAddressText = selectedAddress.description;
            // var textArr = selectedAddressText.split(", ");
            // textArr[textArr.length - 2] = textArr[textArr.length - 2] + " " + selectedAddress.postalcode;
            // selectedAddressText = textArr.join(", ");
            storageData.remove("selectedAddress");
            pageBody.find(".center-loader").css("display", "block");
            var data = {
                customerAddress: selectedAddressText
            };
            $.ajax({
                type: "GET",
                url: webapiuri + "/customer/hasagents",
                data: data,
                success: function (response) {
                    pageBody.find(".center-loader").css("display", "none");
                    var serviceStatus = false;
                    if (response.data != null && response.data.items.length > 0) {
                        serviceStatus = true;
                        storageData.set("selectedAddress", selectedAddress);
                    }
                    servicePopup(serviceStatus);
                }
            });
        });
    }

    function servicePopup(serviceStatus) {

        if (serviceStatus) {
            var inServicePopupEl = pageBody.find(".in-service-popup");
            inServicePopupEl.fadeIn();
            inServicePopupEl.find(".save").on("click", function () {
                window.location.href = home_url + "/registration";
                inServicePopupEl.find(".cancel").trigger("click");
            });

            inServicePopupEl.find(".cancel").on("click", function (ev) {
                ev.preventDefault()
                inServicePopupEl.fadeOut();
            });

        } else {
            var outOfServicePopupEl = pageBody.find(".out-of-service-popup");
            outOfServicePopupEl.fadeIn();
            outOfServicePopupEl.find(".save").on("click", function (ev) {
                ev.preventDefault();
                //outOfServicePopupEl.find(".cancel").trigger("click");
            });

            outOfServicePopupEl.find(".cancel").on("click", function (ev) {
                ev.preventDefault();
                outOfServicePopupEl.fadeOut();
            });
        }
    }

    pageBody.on("click", function (e) {
        var curEl = $(e.target);
        if (
            curEl.closest(".address-search-wrapper").length < 1
            && curEl.closest(".in-service-popup").length < 1
            && curEl.closest(".out-of-service-popup").length < 1
        //&& curEl.closest(".poppup-body").length < 1
        ) {
            pageBody.find(".address-list").empty();
            pageBody.find(".address-search-field").val("");
        }
    });
});
