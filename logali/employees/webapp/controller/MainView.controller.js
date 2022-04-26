//import { get } from "http";

sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: function () {

            },

            onValidate: function(){
                var inputEmployees = this.byId("inputEmployees");
                var valueEmployees = inputEmployees.getValue();
                
                if(valueEmployees.length === 6){
                    this.getView().byId("labelCountry").setVisible(true);
                    this.getView().byId("slCountry").setVisible(true)
                }else{
                    this.getView().byId("labelCountry").setVisible(false);
                    this.getView().byId("slCountry").setVisible(false);
                }
            }
        });
    });
