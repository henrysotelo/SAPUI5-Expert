sap.ui.define([
    "logaligroup/employees/controller/Base.controller",
    'logaligroup/employees/model/formatter',
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller } Controller
     * @param {typeof sap.m.MessageBox } MessageBox
     */
    function (Base, formatter, MessageBox) {
        'use strict';
        return Base.extend("logaligroup.employees.controller.EmployeeDetails", {

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
                odata.push({ index: index + 1, _ValitateDate: false, EnabledSave: false });
                incidencenModel.refresh();
                newInciden.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newInciden);
            },

            onDeleteIncidence: function (oEvent) {

                var contextjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

                MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confimDeleteIncidence"), {

                    onClose: function (oAction) {

                        if (oAction == "OK") {
                            this._bus.publish("incidence", "onDeleteIncidence",
                                {
                                    IncidenceId: contextjObj.IncidenceId,
                                    SapId: contextjObj.SapId,
                                    EmployeeId: contextjObj.EmployeeId
                                });
                        }
                    }.bind(this)
                });
            },

            onSaveIncidence: function (oEvent) {
                var incidence = oEvent.getSource().getParent().getParent();
                var incidenceRow = incidence.getBindingContext("incidenceModel");
                this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
            },

            updateIncidenceCreationDate: function (oEvent) {
                let context = oEvent.getSource().getBindingContext("incidenceModel");
                let contextObj = context.getObject();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();


                if (!oEvent.getSource().isValidValue()) {
                    contextObj._ValitateDate = false;
                    contextObj.CreationDateState = "Error";
                    MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                        title: "Error",
                        onClose: null,
                        styleClass: "",
                        actions: MessageBox.Action.Close,
                        emphasizedAction: null,
                        inicialFocus: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });

                } else {
                    contextObj._ValitateDateX = true;
                    contextObj._ValitateDate = true;
                    contextObj.CreationDateState = "None";
                };

                if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }

                context.getModel().refresh();
            },

            updateIncidenceReason: function (oEvent) {
                let context = oEvent.getSource().getBindingContext("incidenceModel");
                let contextObj = context.getObject();

                if (oEvent.getSource().getValue()) {
                    contextObj.ReasonX = true;
                    contextObj.ReasonState = "None"
                } else {
                    contextObj.ReasonState = "Error"
                };

                if (contextObj._ValitateDate && oEvent.getSource().getValue()) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }

                context.getModel().refresh();
            },

            updateIncidenceType: function (oEvent) {
                let context = oEvent.getSource().getBindingContext("incidenceModel");
                let contextObj = context.getObject();

                if (contextObj._ValitateDate && contextObj.Reason) {
                    contextObj.EnabledSave = true;
                } else {
                    contextObj.EnabledSave = false;
                }
                contextObj.TypeX = true;

                context.getModel().refresh();
            }
        });
    });