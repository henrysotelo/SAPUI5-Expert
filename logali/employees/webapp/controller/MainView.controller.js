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
                var oJSONModel = new JSONModel();
                var oView = this.getView();
                //var i18nBundle = oView.getModel("i18n").getResourceBundle();
                //                var oJSON = {
                //                    "EmployeeId": "1234",
                //                    "CountryKey": "",
                //                    "ListCountry": [
                //                        {
                //                            "Key": "US",
                //                            "Text": i18nBundle.getText('conuntryUS') //"United States"
                //                        },
                //                        {
                //                            "Key": "UK",
                //                            "Text": i18nBundle.getText('conuntryUK') //"United Kindom"
                //                        },
                //                        {
                //                            "Key": "ES",
                //                            "Text": i18nBundle.getText('conuntryES') //"Spain"
                //                        }
                //                    ]
                //                };
                // oJSONModel.setData(oJSON);
                oJSONModel.loadData("./localService/mockdata/Employees.json");
                //oJSONModel.attachRequestCompleted(function(onEventModel){
                //     console.log(JSON.stringify(oJSONModel.getData()));
                // });
                oView.setModel(oJSONModel)
            },

            onFilter: function () {
                var oJSON = this.getView().getModel().getData();
                var filters = [];

                if (oJSON.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
                }

                if (oJSON.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey ));
                }

                var oList = this.getView().byId("tableEmployees");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },

            onClearFilter: function(){
                var oModel = this.getView().getModel();
                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
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
