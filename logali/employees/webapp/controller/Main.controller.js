sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, MessageBox) {
        'use strict';
        return Controller.extend('logaligroup.employees.controller.Main', {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("detailEmployee");
            },

            onInit: function () {

                var oView = this.getView();

                var oJSONModelEmployees = new JSONModel();
                oJSONModelEmployees.loadData("./model/json/Employees.json");
                oView.setModel(oJSONModelEmployees, "jsonEmployees");

                var oJSONModelCountry = new JSONModel();
                oJSONModelCountry.loadData("./model/json/Countries.json");
                oView.setModel(oJSONModelCountry, "jsonCountry");

                var oJSONModelLayouts = new JSONModel();
                oJSONModelLayouts.loadData("./model/json/Layouts.json");
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
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

                //otra forma de hacer la subcricción.
                this._bus.subscribe("incidence", "onDeleteIncidence", function (channeId, evenId, data) {

                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                    this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                        "',SapId='" + data.SapId +
                        "',EmployeeId='" + data.EmployeeId + "')", {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(data.EmployeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                        }.bind(this),

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                        }.bind(this)
                    });

                }, this);

            },

            showEmployeeDetails: function (Category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmployee");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

                this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);

            },

            onSaveODataIncidence: function (channeId, evenId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    };

                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {

                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);
                            MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                            //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                } else if (
                    incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {

                    var body = {
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX,
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX
                    };

                    this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId + "',SapId='" + incidenceModel[data.incidenceRow].SapId + "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                        }.bind(this),

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                        }.bind(this)
                    });
                }

                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                }
            },

            onReadODataIncidence: function (EmployeeId) {

                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId.toString())

                    ],

                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);

                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            
                            data.results[incidence]._ValitateDate = true;
                            data.results[incidence].EnabledSave = false;

                            var newIncidence
                                = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());

                            this._detailEmployeeView.addDependent(newIncidence);

                            newIncidence.bindElement("incidenceModel>/" + incidence);

                            tableIncidence.addContent(newIncidence)
                        }
                    }.bind(this),
                    error: function (e) {

                    }

                });
            }
        });
    });