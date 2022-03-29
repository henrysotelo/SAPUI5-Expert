// @ts-nocheck
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {

    "use strict";
    sap.ui.require(["logaligroup/saui5/test/unit/AllTests"], function () {
        QUnit.start();
    });
});