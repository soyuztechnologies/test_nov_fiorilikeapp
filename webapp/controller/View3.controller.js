sap.ui.define([
    'ey/fin/ar/controller/BaseController',
	"sap/ui/core/routing/History"
], function(BaseController, History) {
    'use strict';
    return BaseController.extend("ey.fin.ar.controller.View3",{
        onInit: function(){
            //Step 1: get Router
            this.oRouter = this.getOwnerComponent().getRouter();
            //Step 2: attach the route match handler
            this.oRouter.getRoute("wonderwomen").attachMatched(this.herculis, this);
        },        
        herculis: function(oEvent){
            //Extract the fruit id passed by view1 when user clicked the item
            var sIndex = oEvent.getParameter("arguments").supplierId;
            //Rebuild the element path
            var sPath = "/supplier/" + sIndex;
            //Self view to be bound with element address
            this.getView().bindElement(sPath);

        },
        onBack: function(){
            var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("spiderman", {}, true);
			}
        }
    });
});