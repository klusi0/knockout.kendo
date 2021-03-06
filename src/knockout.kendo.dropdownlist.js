ko.bindingHandlers.kendoDropDownList = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        /// <summary>
        /// Method called right after binding ViewModel to element that has "kendoDropDownList" binding handler applied to it.
        /// </summary>
        /// <param name="element">The DOM element involved in this binding</param>
        /// <param name="valueAccessor">A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value.</param>
        /// <param name="allBindingsAccessor"> A JavaScript function that you can call to get all the model properties bound to this DOM element. Like valueAccessor, call it without any parameters to get the current bound model properties.</param>
        /// <param name="viewModel">The view model object that was passed to ko.applyBindings. Inside a nested binding context, this parameter will be set to the current data item (e.g., inside a with: person binding, viewModel will be set to person).</param>

        var configuration = valueAccessor();

        var accessDataItemValue = !configuration.dataValueField ? function (dataItem) { return dataItem; } : function (dataItem) { return dataItem[configuration.dataValueField]; };
        var control = null;
        var controlDataSource = null;
        var valueToSet = configuration.value;
        var rebindValue = null;
		if (configuration.dataSource) {
			rebindValue = function (value) {
				value = value ? value : valueToSet;
				var total = controlDataSource.total();
				for (var itemIndex = 0; itemIndex < total; itemIndex++) {
					if (accessDataItemValue(controlDataSource.at(itemIndex)) == value) {
						control.value(value);
						return;
					}
				}
				control.value(null);
			};
		} else {
			rebindValue = function (value) {
				control.value(value ? value : valueToSet);
			};
		}

        if (valueToSet != null) {
            if (ko.isObservable(valueToSet)) {
                valueToSet.subscribe(function (value) {
                    valueToSet = value;
                    rebindValue();
                });
                valueToSet = valueToSet();
            }
        }

        if (ko.isObservable(configuration.dataSource)) {
            controlDataSource = new kendo.data.DataSource({ data: configuration.dataSource() });
            configuration.dataSource.subscribe(function (value) {
                controlDataSource.cancelChanges();
                for (var index = 0; index < value.length; index++) {
                    controlDataSource.add(value[index]);
                }
                rebindValue();
            });
        } else if ($.isArray(configuration.dataSource)) {
            controlDataSource = new kendo.data.DataSource({ data: configuration.dataSource });
        } else if (configuration.dataSource) {
            // Assuming that this data source is native kendo data source.
            controlDataSource = configuration.dataSource;
        }

        if (controlDataSource)
            configuration.dataSource = controlDataSource;
        else if (configuration.dataSource)
            delete configuration.dataSource;

        control = $(element).kendoDropDownList(configuration)
                            .data("kendoDropDownList");
        rebindValue();

        bindEnable(control, configuration);
		bindIsBusy(control, configuration);

        if (configuration.value != null && ko.isObservable(configuration.value)) {
			if (configuration.dataSource) {
				control.bind("select", function (e) {
					if (!e) {
						configuration.value(null);
					}

					configuration.value(accessDataItemValue(this.dataItem(e.item.index())));
				});
				control.bind("change", function (e) {
					if (!e) {
						configuration.value(null);
					}

					configuration.value(accessDataItemValue(this.dataItem(this.selectedIndex)));
				});
			} else {
				control.bind("select", function (e) {
					if (!e) {
						configuration.value(null);
					}

					configuration.value(this.value());
				});
				control.bind("change", function (e) {
					if (!e) {
						configuration.value(null);
					}

					configuration.value(this.value());
				});
			}
        }

        bindEventHandlers(control, configuration.event);
        applyStyles($(control.element).parent(), configuration.css);
    }
};