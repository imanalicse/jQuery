function formeoRadioCheckboxValidation($selector) {
	$selector.find(".f-field-group[required='true']").each(function (index, element) {
		var $element = $(element);
		var radio = $element.find("input[type='radio']").last();
		if (radio.length > 0) {
			radio.rules('add', {
				required: true
			});
		}

		var checkbox = $element.find("input[type='checkbox']").last();
		if (checkbox.length > 0) {
			checkbox.rules('add', {
				required: true
			});
		}
	});
}

function minMaxNumberOfChoiceValidation() {
	$.validator.addMethod("min_max_choice_validation", function(value, element, params) {
		var $field_group = $(element).closest('.f-field-group');
		var min_number_of_choices = $field_group.attr("min_number_of_choices");
		var max_number_of_choices = $field_group.attr("max_number_of_choices");
		var checked_length = $field_group.find('input[type="checkbox"]:checked').length;
		if (min_number_of_choices <= checked_length && checked_length <= max_number_of_choices) {
			return true
		}
		$.validator.messages.min_max_choice_validation = `Please choose  at least ${min_number_of_choices} and at most ${max_number_of_choices} options`;
		return false
	}, $.validator.messages.min_max_choice_validation);
	$.validator.addClassRules({
		min_max_choice_validation: {
			min_max_choice_validation : true
		}
	});
}