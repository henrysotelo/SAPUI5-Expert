sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.m.MessageToast} MessageToast 
     **/
    function (Controller, MessageToast) {
        'use strict';
        return Controller.extend('logaligroup.saui5.controller.App', {
            //Funcion Init
            oninit: function () {
                //Model, datos
                //this.getView().setModel(Models.createRecipient());
                //i18n textos
                //var i18nModel = new ResourceModel({ bundleName : 'logaligroup.saui5.i18n.i18n', locale:'es' });
                //this.getView().setModel(i18nModel, 'i18n');
            },
            //Funcion onShowHello
            onShowHello: function () {
                //Modelo i18n
                var oBundle = this.getView().getModel('i18n').getResourceBundle();
                var sRecipient = this.getView().getModel().getProperty('/recipient/nombre');
                var sMsg = oBundle.getText('helloMessage', [sRecipient]);
                MessageToast.show(sMsg);

                //alert('Hola Isabel');
                //MessageToast.show("$20'000.000 fueron transferidos a Isabel Marin Puerta")
            }
        });
    });