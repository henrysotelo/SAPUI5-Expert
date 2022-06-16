sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MasterEmployee", {

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },

            onFilter: function () {
                var oJSONCountry = this.getView().getModel("jsonCountry").getData();
                var filters = [];

                if (oJSONCountry.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountry.EmployeeId));
                }

                if (oJSONCountry.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountry.CountryKey));
                }

                var oList = this.getView().byId("tableEmployees");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },

            onClearFilter: function () {
                var oModel = this.getView().getModel("jsonCountry");
                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            },

            showPostalCode: function (oEvent) {
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("jsonEmployees");
                var objectContext = oContext.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);
            },

            showOrders: function (oEvent) {
                var ordersTable = this.getView().byId("ordersTable");
                ordersTable.destroyItems();

                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("odataNorthwind");

                var objectContext = oContext.getObject();
                var orders = objectContext.Orders;

                var ordersItems = [];

                for (var i in orders) {
                    ordersItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: orders[i].OrderID }),
                            new sap.m.Label({ text: orders[i].Freight }),
                            new sap.m.Label({ text: orders[i].ShipAddress })
                        ]
                    }));
                }

                var newTable = new sap.m.Table({
                    width: "auto",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) }),
                    ],
                    items: ordersItems
                }).addStyleClass("sapUiSmallMargin");

                ordersTable.addItem(newTable);



                var newTableJSON = new sap.m.Table();
                newTableJSON.setWidth("auto");
                newTableJSON.addStyleClass("sapUiSmallMargin");

                var columnOrderID = new sap.m.Column();
                var labelOrderID = new sap.m.Label();
                labelOrderID.bindProperty("text", "i18n>OrderID");
                columnOrderID.setHeader(labelOrderID);
                newTableJSON.addColumn(columnOrderID);

                var columnFreight = new sap.m.Column();
                var labelFreight = new sap.m.Label();
                labelFreight.bindProperty("text", "i18n>freight");
                columnFreight.setHeader(labelFreight);
                newTableJSON.addColumn(columnFreight);

                var columnShipAddress = new sap.m.Column();
                var labelShipAddress = new sap.m.Label();
                labelShipAddress.bindProperty("text", "i18n>shipAddress");
                columnShipAddress.setHeader(labelShipAddress);
                newTableJSON.addColumn(columnShipAddress);

                var columnListItem = new sap.m.ColumnListItem();

                var cellOrderID = new sap.m.Label();
                cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
                columnListItem.addCell(cellOrderID);

                var cellFreight = new sap.m.Label();
                cellFreight.bindProperty("text", "jsonEmployees>Freight");
                columnListItem.addCell(cellFreight);

                var cellShipAddress = new sap.m.Label();
                cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
                columnListItem.addCell(cellShipAddress);

                var oBindingInfo = {
                    model: "jsonEmployees",
                    path: "Orders",
                    template: columnListItem
                };

                newTableJSON.bindAggregation("items", oBindingInfo);
                newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

                ordersTable.addItem(newTableJSON);
            },


            onShowOrders: function (oEvent) {

                var isonPressed = oEvent.getSource();
                var oContext = isonPressed.getBindingContext("odataNorthwind");

                if (!this._oDialogOrders) {
                    this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                    this.getView().addDependent(this._oDialogOrders);
                }

                this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
                this._oDialogOrders.open();
            },

            onCloseOrders: function () {
                this._oDialogOrders.close();
            },

            onShowCity: function () {
                var oJSONModeConfig = this.getView().getModel("jsonModeConfig");
                oJSONModeConfig.setProperty("/visibleCity", true);
                oJSONModeConfig.setProperty("/visibleBtnShowCity", false);
                oJSONModeConfig.setProperty("/visibleBtnHideCity", true);
            },

            onHideCity: function () {
                var oJSONModeConfig = this.getView().getModel("jsonModeConfig");
                oJSONModeConfig.setProperty("/visibleCity", false);
                oJSONModeConfig.setProperty("/visibleBtnShowCity", true);
                oJSONModeConfig.setProperty("/visibleBtnHideCity", false);
            },

            onValidate: function () {
                var inputEmployees = this.byId("inputEmployees");
                var valueEmployees = inputEmployees.getValue();

                if (valueEmployees.length === 6) {
                    this.getView().byId("labelCountry").setVisible(true);
                    this.getView().byId("slCountry").setVisible(true)
                } else {
                    this.getView().byId("labelCountry").setVisible(false);
                    this.getView().byId("slCountry").setVisible(false);
                }
            },

            showEmployes: function (oEvent) {
                var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
                this._bus.publish("flexible", "showEmployee", path)
            },

            toOrderDetails: function (oEvent) {
                var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrderDetails", {
                    OrderID: orderID
                });
            }

        });
    });
