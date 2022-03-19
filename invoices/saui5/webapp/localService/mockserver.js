//@ts-nocheck
sap.ui.define([
    'sap/ui/core/util/MockServer',
    'sap/ui/model/json/JSONModel',
    'sap/base/util/UriParameters',
    'sap/base/Log'
],

    /**
     * @param {typeof sap.ui.core.util.MockServer } MockServer  
     * @param {typeof sap.ui.model.json.JSONModel } JSONModel  
     * @param {typeof sap.base.util.UriParameters } UriParameters  
     * @param {typeof sap.base.log } Log  
     */

    function (MockServer, JSONModel, UriParameters, Log) {
        'use strict';
        var oMockServer,
            _sAppPath =  "logaligroup/saui5/",
            _sJsonFilesPath = _sAppPath + "localService/mockdata";

        var oMockServerInterface = {

            /**
             * @protected
             * @param {object} oOptionsParameter 
             * @returns{Promise}
             */

            init: function (oOptionsParameter) {

                var oOptions = oOptionsParameter || {};

                return new Promise(function (fnResolve, fnReject) {

                    var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                        oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function() {

                        var oUriParameters = new UriParameters(window.location.href);

                        //parse manifest for local
                        var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        var oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/mainService");
                        var sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                        //Ensure
                        var sMockServerUrl = oMainDataSource.uri && new URI(oMainDataSource.uri).absoluteTo(sap.ui.require.toUrl(_sAppPath)).toString();

                        //Crear a mock server
                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            })
                        } else {
                            oMockServer.stop();
                        }

                        //Configure mock server
                        MockServer.config({
                            autoRespod : true,
                            autoRespondAfter : (oOptions.delay || oUriParameters.get("serverDelay") || 500)
                        })

                        //simulate  all 
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        })

                        var aRequests = oMockServer.getRequests();

                        // Error
                        var fnResponse = function (iErrCode, sMessage, aRequest) {
                            aRequest.response = function (oXhr) {
                                oXhr.respond(iErrCode, { "Content-Type": "text/plain;charset=utf-8" }, sMessage);
                            };
                        };

                        //Simulate metadata error 
                        if (oOptions.metadataError || oUriParameters.get("metadataError")) {
                            aRequests.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexof("$metadata") > -1) {
                                    fnResponse(500, "metadata error", aEntry);
                                }
                            });
                        };

                        //Simular request error
                        var sErrorParam = oOptions.errorType || oUriParameters.get("errorType");
                        var iErrorCode = sErrorParam === "badRequest" ? 400 : 500;

                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        };

                        //Set requests and start server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();
                        
                        Log.info("Running ... app sotelo");
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function() {
                        var sError = "Failed to load the application manifest";

                        Log.error(sError);
                        fnReject(new Error(sError));
                    });

                });

            }
        };

        return oMockServerInterface;

    }); 