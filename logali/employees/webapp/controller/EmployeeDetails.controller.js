sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'logaligroup/employees/model/formatter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller } Controller
     */
    function (Controller, formatter) {
        'use strict';
        return Controller.extend("logaligroup.employees.controller.EmployeeDetails", {

            Formatter:formatter,

            onInit: function () {
                
            },

            onCreateIncidence: function () {
                var tableIncidence = this.getView().byId("tableIncidence");
                var newInciden = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
                var incidencenModel = this.getView().getModel("incidenceModel");
                var odata = incidencenModel.getData();
                var index = odata.length;
                odata.push({ index: index + 1 });
                incidencenModel.refresh();
                newInciden.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newInciden);
            },
        
            onDeleteIncidence: function(oEvent){
                var tableIncidence = this.getView().byId("tableIncidence");
                var rowIncidence = oEvent.getSource().getParent().getParent();
                var incidenceModel = this.getView().getModel("incidenceModel");
                var odata = incidenceModel.getData();
                var contextObj = rowIncidence.getBindingContext("incidenceModel");

                odata.splice(contextObj.index - 1, 1);

                for(var i in odata){
                    odata[i].index = parseInt(i) + 1;
                };

                incidenceModel.refresh();
                tableIncidence.removeContent(rowIncidence);

                for (var j in tableIncidence.getContent()) {
                    tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
                }
            }
        });
    });