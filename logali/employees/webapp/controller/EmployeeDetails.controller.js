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

            Formatter: formatter,

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
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

            onDeleteIncidence: function (oEvent) {

                var contextjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

                this._bus.publish("incidence", "onDeleteIncidence",
                    {
                        IncidenceId: contextjObj.IncidenceId,
                        SapId: contextjObj.SapId,
                        EmployeeId: contextjObj.EmployeeId
                    });
            },

            onSaveIncidence: function (oEvent) {
                var incidence = oEvent.getSource().getParent().getParent();
                var incidenceRow = incidence.getBindingContext("incidenceModel");
                this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
            },

            updateIncidenceCreationDate: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObj = context.getObject();
                contextObj.CreationDateX = true;
            },

            updateIncidenceReason: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObj = context.getObject();
                contextObj.ReasonX = true;
            },

            updateIncidenceType: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObj = context.getObject();
                contextObj.TypeX = true;

            }
        });
    });