sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "ey/fin/ar/util/formatter"
], function(Controller, Formatter) {
    'use strict';
    return Controller.extend("ey.fin.ar.controller.BaseController",{
        //global variable in base controller available in all child controllers
        formatter:Formatter,
        reuseCode: function(){
            
        }
    });
});