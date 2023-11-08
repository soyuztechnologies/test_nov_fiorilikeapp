sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    //inherit from standard SAP UI5 dependency - inheritence
    return UIComponent.extend("ey.fin.ar.Component",{
        //4 important sections of each Component file
        metadata: {
            manifest: "json"
        },
        //Constructor of our current class
        init: function(){
            //We need to call parent class constructor  super->constructor()
            UIComponent.prototype.init.apply(this);

            //Step 1: get the router object
            var oRouter = this.getRouter();
            //Step 2: call initilize
            oRouter.initialize();
        },
        //This is where we create our first view object
        // createContent: function(){
        //     //here is our object of Root View
        //     var oRoot = new sap.ui.view({
        //         id: "idRootView",
        //         viewName: "ey.fin.ar.view.App",
        //         type: "XML"
        //     });
            
        //     //Step 2: Create other view objects
        //     var oView1 = new sap.ui.view({
        //         id: "idView1",
        //         viewName: "ey.fin.ar.view.View1",
        //         type: "XML"
        //     });

        //     var oView2 = new sap.ui.view({
        //         id: "idView2",
        //         viewName: "ey.fin.ar.view.View2",
        //         type: "XML"
        //     });

        //     var oEmpty = new sap.ui.view({
        //         id: "idEmpty",
        //         viewName: "ey.fin.ar.view.Empty",
        //         type: "XML"
        //     });

        //     //Step 3: get the container control object - App
        //     var oAppCon = oRoot.byId("appCon");

        //     //Step 4: Add our views inside that - view1 gets the preference but 
        //     //        v2 still gets added in backgroud
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);
            
        //     return oRoot;


        // },
        //Destrcutor of this class
        destroy: function(){

        }

    });
});