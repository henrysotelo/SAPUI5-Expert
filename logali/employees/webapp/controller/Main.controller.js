sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     */
    function (Controller, JSONModel) {
        'use strict';
        return Controller.extend('logaligroup.employees.controller.Main', {

            onInit: function () {

                var oView = this.getView();

                var oJSONModelEmployees = new JSONModel();
                oJSONModelEmployees.loadData("./localService/mockdata/Employees.json");
                oView.setModel(oJSONModelEmployees, "jsonEmployees");

                var oJSONModelCountry = new JSONModel();
                oJSONModelCountry.loadData("./localService/mockdata/Countries.json");
                oView.setModel(oJSONModelCountry, "jsonCountry");

                var oJSONModelLayouts = new JSONModel();
                oJSONModelLayouts .loadData("./localService/mockdata/Layouts.json");
                oView.setModel(oJSONModelLayouts, "jsonLayouts");

                var oJSONModeConfig = new JSONModel({
                    visibleId: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false,
                });

                oView.setModel(oJSONModeConfig, "jsonModeConfig");

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            },

            showEmployeeDetails: function(Category, nameEvent, path){

                var detailView = this.getView().byId("detailEmployee");
                detailView.bindElement("jsonEmployees>" + path);

                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsBeginExpanded");
            }

        });
    });