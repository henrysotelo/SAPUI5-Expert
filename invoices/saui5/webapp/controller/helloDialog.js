// @ts-ignore
sap.ui.define([
    "sap/ui/base/ManagedObject", 
    "sap/ui/core/Fragment"],
    /**
     * 
     * @param {typeof sap.ui.base.ManagedObject} ManagedObject 
     * @param {typeof sap.ui.core.Fragment} Fragment 
     */
    function (ManagedObject, Fragment) {

        return ManagedObject.extend('logaligroup.saui5.controller.helloDialog', {
            constructor: function (oView) {
                this._oView = oView;
            },

            exit: function () {
                delete this._oView;
            },

            open: function () {
                const oView = this._oView;

                if (!oView.byId('helloDialog')) {

                    let oFragmentController = {
                        onCloseDialog: function () {
                            oView.byId("helloDialog").close();
                            console.log('Cerrar... sotelo');
                        }
                    };

                    Fragment.load({
                        id: oView.getId(), //Identificardor
                        name: "logaligroup.saui5.view.helloDialog",
                        controller: oFragmentController
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                        //console.log(oDialog);
                    });
                } else {
                    oView.byId('helloDialog').open();
                }
            }

        });

    });