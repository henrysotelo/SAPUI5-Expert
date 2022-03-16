// @ts-ignore
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.m.MessageToast} MessageToast 
     */
    function (Controller, MessageToast) {
        'use strict';

        return Controller.extend('logaligroup.saui5.controller.helloPanel', {
            //Función onInit
            onInit: function () { },

            //Función onShowHello
            onShowHello: function () {
                //read text from i18n model
                var oBundle = this.getView().getModel('i18n').getResourceBundle();
                var sRecipient = this.getView().getModel().getProperty('/recipient/id');
                var sMsg = oBundle.getText('helloMessage', [sRecipient]);
                MessageToast.show(sMsg);
            },
            //Abril panel
            onOpenDialog: function () {
                this.getOwnerComponent().openHelloDialog();

              //  const oView = this.getView();

              //  if (!this.byId("helloDialog")) {
              //      Fragment.load({
              //          id: oView.getId(), //Identificardor
              //          name: "logaligroup.saui5.view.helloDialog",
              //          controller: this
              //      }).then(function (oDialog) {
              //          oView.addDependent(oDialog);
              //          oDialog.open();
              //          //console.log(oDialog);
              //      });
              //  } else{
              //      this.byId("helloDialog").open();
              //  }
            }
            //Cerrar
            //onCloseDialog: function () {
            //    this.byId("helloDialog").close();
            //    console.log('Cerrar... sotelo');
            //}
        });
    });