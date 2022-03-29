// @ts-ignore
sap.ui.define([
    "logaligroup/saui5/model/InvoicesFormatter",
    "sap/ui/model/resource/ResourceModel"],

    /**
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     */
    function (InvoicesFormatter, ResourceModel) {

        QUnit.module("Qnvoices Status", {
            beforeEach: function () {
                this._oResourceModel = new ResourceModel({
                    bundleUrl: sap.ui.require.toUrl("logaligroup/saui5") + "/i18n/i18n.properties"
                });
            },
            afterEach: function () {
                this._oResourceModel.destroy();
            }
        });

        QUnit.test("Sould return el estado de la factura", function (assert) {

            let oModel = this.stub();
            oModel.withArgs("i18n").returns(this._oResourceModel);

            let oViewStub = {
                getModel: oModel
            };

            let oControllerStub = {
                getView: this.stub().returns(oViewStub)
            };

            let fnIsolatedFormatter = InvoicesFormatter.invoiceStatus.bind(oControllerStub);
            //Assert
            assert.strictEqual(fnIsolatedFormatter("A"), "Nuevo", "El estado A es correcto");
            assert.strictEqual(fnIsolatedFormatter("B"), "En progreso", "El estado B es correcto");
            assert.strictEqual(fnIsolatedFormatter("C"), "Terminado", "El estado C es  correcto");

        });        

    });