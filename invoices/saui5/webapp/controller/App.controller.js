// @ts-ignore
sap.ui.define([
    'sap/ui/core/mvc/Controller',
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     **/
    function (Controller) {
        'use strict';
        return Controller.extend('logaligroup.saui5.controller.App', {
            //Funcion Init
            oninit: function () {
                this.getView().addSyleClass(this.getOwnerComponent().getContentDensityClass());
            },
            
            onOpenDialogHeader: function(){
                this.getOwnerComponent().openHelloDialog();
            }
        });
    });