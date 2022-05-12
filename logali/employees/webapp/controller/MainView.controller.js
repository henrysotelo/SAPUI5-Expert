//import { get } from "http";

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

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: function () {
               
                var oView = this.getView();
   
                var oJSONModelEmployees = new JSONModel();
                oJSONModelEmployees.loadData("./localService/mockdata/Employees.json");
                oView.setModel(oJSONModelEmployees, "jsonEmployees");

                var oJSONModelCountry = new JSONModel();
                oJSONModelCountry.loadData("./localService/mockdata/Countries.json");
                oView.setModel(oJSONModelCountry, "jsonCountry");

                var oJSONModeConfig = new JSONModel({
                    visibleId: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false,
                });

                oView.setModel(oJSONModeConfig, "jsonModeConfig");
            },

            onFilter: function () {
                var oJSONCountry = this.getView().getModel("jsonCountry").getData();
                var filters = [];

                if (oJSONCountry.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountry.EmployeeId));
                }

                if (oJSONCountry.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountry.CountryKey ));
                }

                var oList = this.getView().byId("tableEmployees");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },

            onClearFilter: function(){
                var oModel = this.getView().getModel("jsonCountry");
                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            },

            showPostalCode: function(oEvent){
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("jsonEmployees");
                var objectContext = oContext.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);
            },

            onShowCity: function(){
                var oJSONModeConfig = this.getView().getModel("jsonModeConfig");
                oJSONModeConfig.setProperty("/visibleCity", true);
                oJSONModeConfig.setProperty("/visibleBtnShowCity", false);
                oJSONModeConfig.setProperty("/visibleBtnHideCity", true);
            },

            onHideCity: function(){
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
            }
        });
    });
