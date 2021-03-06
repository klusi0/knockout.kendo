ko.bindingHandlers.kendoTimePicker = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		/// <summary>
		/// Method called right after binding ViewModel to element that has "kendoTimePicker" binding handler applied to it.
		/// </summary>
		/// <param name="element">The DOM element involved in this binding</param>
		/// <param name="valueAccessor">A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value.</param>
		/// <param name="allBindingsAccessor"> A JavaScript function that you can call to get all the model properties bound to this DOM element. Like valueAccessor, call it without any parameters to get the current bound model properties.</param>
		/// <param name="viewModel">The view model object that was passed to ko.applyBindings. Inside a nested binding context, this parameter will be set to the current data item (e.g., inside a with: person binding, viewModel will be set to person).</param>

		var configuration = $.extend({
			css: {},
			enable: true,
			event: {},
			format: "h:mm tt",
            interval: 30,
			max: new Date(0, 0),
			min: new Date(0, 0),
			value: null
		}, valueAccessor());

		var control = null;
		var valueToSet = configuration.value;
		
		if (valueToSet != null) {
			if (ko.isObservable(valueToSet)) {
				valueToSet.subscribe(function (value) {
					control.value(value);
				});
				valueToSet = valueToSet();
			}
		}
		
		control = $(element).kendoTimePicker({
		    format: configuration.format,
            interval: configuration.interval,
			max: configuration.max,
			min: configuration.min,
			value: valueToSet
		}).data("kendoTimePicker");
		
		bindEnable(control, configuration);

		if (configuration.value != null && ko.isObservable(configuration.value)) {
			control.bind("change", function (e) {
				if (!e) {
					configuration.value(null);
				}

				configuration.value(this.value());
			});
		}

		bindEventHandlers(control, configuration.event);
		applyStyles($(control.element).parent().parent(), configuration.css);
	}
};