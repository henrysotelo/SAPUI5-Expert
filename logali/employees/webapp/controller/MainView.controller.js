//import { get } from "http";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: function () {
                var oJSONModel = new JSONModel();
                var oView = this.getView();
                var i18nBundle = oView.getModel("i18n").getResourceBundle();

//                var oJSON = {
//                    "employeeId": "1234",
//                    "countryKey": "UK",
//                    "listCountry": [
//                        {
//                            "key": "US",
//                            "text": i18nBundle.getText('conuntryUS') //"United States"
//                        },
//                        {
//                            "key": "UK",
//                            "text": i18nBundle.getText('conuntryUK') //"United Kindom"
//                        },
//                        {
//                            "key": "ES",
//                            "text": i18nBundle.getText('conuntryES') //"Spain"
//                        }
//                    ]
//                };
                //oJSONModel.setData(oJSON);
                oJSONModel.loadData('./localService/mockdata/Employees.json');
                //oJSONModel.attachRequestCompleted(function(onEventModel){
                  //  console.log(JSON.stringify(oJSONModel.getData()));
                //});
                oView.setModel(oJSONModel)
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
