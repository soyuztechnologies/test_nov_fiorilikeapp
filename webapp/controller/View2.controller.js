sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function(BaseController, History, Fragment, Filter, FilterOperator, MessageBox, MessageToast) {
    'use strict';
    return BaseController.extend("ey.fin.ar.controller.View2",{
        onInit: function(){
            //Step 1: get Router
            this.oRouter = this.getOwnerComponent().getRouter();
            //Step 2: attach the route match handler
            this.oRouter.getRoute("superman").attachMatched(this.herculis, this);
        },        
        herculis: function(oEvent){
            //Extract the fruit id passed by view1 when user clicked the item
            var sIndex = oEvent.getParameter("arguments").fruitId;
            //Rebuild the element path
            var sPath = "/" + sIndex;
            //Self view to be bound with element address
            this.getView().bindElement(sPath,{
                expand:"To_Supplier"
            });

        },
        oCityPopup: null,
        oSupplierPopup: null,
        oFieldInsideTable: null,
        onFilter: function(oEvent){
            //Inside the callback/promise function you will not be allowed
            //to access controller object directly hence we need to create
            //a local variable which will be in scope for callback/promise function
            //https://www.youtube.com/watch?v=RMsTYQe_3Jg&pp=ygUXYW51YmhhdiB1aTUgdGhhdCA9IHRoaXM%3D
            var that = this;
            //Step 1: Create a object of the fragment
            //IF lo_alv IS NOT BOUND -- only then we create the ALV object
            //Only when the fragment is created first time, we create its object
            //Next time, its already there in global variable hence we dont need to create 
            //we just need to open it
            if(!this.oSupplierPopup){
                Fragment.load({
                    name: 'ey.fin.ar.fragments.popup',
                    id: 'supplier',
                    controller: this
                })
                //Step 2: it returns the promise, in which we receive our fragment object
                //https://www.youtube.com/watch?v=zY6gnfxgb9I&pp=ygUScHJvbWlzZSBpbiBzYXAgdWk1
                .then(function(oFragment){
                    //Here inside promise function, we cannot access this pointer
                    //this.oCityPopup will not work, hence we need to create a local variable
                    //for this pointer to be able to access inside here
                    //initialize my global variable in first run
                    that.oSupplierPopup = oFragment;

                    //We have remote control to control our TV, in same manner we have
                    //Remote control of our fragment is the object of our fragment
                    that.oSupplierPopup.setTitle("Select your suppliers");

                    //Allow my parasite(fragment) to access body parts(model) using immunity(view)
                    that.getView().addDependent(oFragment);
                    //Step 3: logic to bind data with fragment (select dialog)
                    oFragment.bindAggregation("items",{
                        path: "/supplier",
                        template: new sap.m.ObjectListItem({
                            title:"{name}",
                            intro:"{city}",
                            number:"{sinceWhen}",
                            numberUnit: "{person}",
                            icon:"sap-icon://supplier"
                        })
                    });
                    //Step 4: open the fragment box
                    oFragment.open();
                });
            }else{
                //just open the already existing fragment object for city
                this.oSupplierPopup.open();
            }
        },
        onF4Help: function(oEvent){
            this.oFieldInsideTable = oEvent.getSource();
            console.log("My Current City Value is ---->  " + oEvent.getSource().getValue())
            //Inside the callback/promise function you will not be allowed
            //to access controller object directly hence we need to create
            //a local variable which will be in scope for callback/promise function
            //https://www.youtube.com/watch?v=RMsTYQe_3Jg&pp=ygUXYW51YmhhdiB1aTUgdGhhdCA9IHRoaXM%3D
            var that = this;
            //Step 1: Create a object of the fragment
            //IF lo_alv IS NOT BOUND -- only then we create the ALV object
            //Only when the fragment is created first time, we create its object
            //Next time, its already there in global variable hence we dont need to create 
            //we just need to open it
            var that = this;
            if(!this.oCityPopup){
                Fragment.load({
                    name: 'ey.fin.ar.fragments.popup',
                    id: 'cities',
                    controller: this
                })
                //Step 2: it returns the promise, in which we receive our fragment object
                //https://www.youtube.com/watch?v=zY6gnfxgb9I&pp=ygUScHJvbWlzZSBpbiBzYXAgdWk1
                .then(function(oFragment){
                    //Here inside promise function, we cannot access this pointer
                    //this.oCityPopup will not work, hence we need to create a local variable
                    //for this pointer to be able to access inside here
                    //initialize my global variable in first run
                    that.oCityPopup = oFragment;

                    //We have remote control to control our TV, in same manner we have
                    //Remote control of our fragment is the object of our fragment
                    that.oCityPopup.setTitle("Cities");
                    that.oCityPopup.setMultiSelect(false);
                    //Allow my parasite(fragment) to access body parts(model) using immunity(view)
                    that.getView().addDependent(oFragment);
                    //Step 3: logic to bind data with fragment (select dialog)
                    oFragment.bindAggregation("items",{
                        path: "/cities",
                        template: new sap.m.ObjectListItem({
                            title:"{name}",
                            intro:"{famousFor}",
                            number:"{population}",
                            numberUnit: "{state}",
                            icon:"sap-icon://home",
                            attributes: [new sap.m.ObjectAttribute({text: "{famousFor}"}),
                                        new sap.m.ObjectAttribute({text: "{population}"})]
                        })
                    });
                    //Step 4: open the fragment box
                    oFragment.open();
                });
            }else{
                //just open the already existing fragment object for city
                this.oCityPopup.open();
            }
            
            //alert("this functionality is under construction 😊");
        },
        onSave: function(){
            MessageBox.confirm("Would you like to order fruits?",{
                title: "Confirmation Anubhav",
                onClose: this.onCloseMessage
            });
        },
        onCloseMessage: function(status){
            if(status === "OK"){
                MessageToast.show("Your order has been confirmed");
            }else{
                MessageBox.error("Order was cancelled");
            }
        },
        onConfirmPopup: function(oEvent){
            //Since we are reusing the fragment for Supplier and Cities
            //The code is triggering here, the good news is each fragment object has
            //unique identifier, so we can use that identifier to check
            var sId = oEvent.getSource().getId();
            //Step 1: get the selected item object
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step 2: from the object list item which was chosen, get the title
            var sCity = oSelectedItem.getTitle();
            if(sId === "cities--dialog"){
                //Step 3: set the data to the same input field inside table
                this.oFieldInsideTable.setValue(sCity);
            }else{
                var aFilters = [];
                //it was due to supplier popup - TODO
                var aSelectedItems = oEvent.getParameter("selectedItems");
                //Loop at all items one by one and build a filter array
                for (let i = 0; i < aSelectedItems.length; i++) {
                    const element = aSelectedItems[i];
                    var oFilter = new Filter("name", FilterOperator.EQ, element.getTitle());
                    aFilters.push(oFilter);
                }
                var oMainFilter = new Filter({
                    filters: aFilters,
                    and: false
                });
                //Inject this filter inside the table control
                var oTable = this.getView().byId("idTabSupplier");
                oTable.getBinding("items").filter(oMainFilter);
            }

            
        },
        onSelectSupplier: function(oEvent){
             //Step 1: Get to know which item did user click on
             var oSelectedItem = oEvent.getParameter("listItem");
             //Step 2: Extract the path of the selected item /fruits/index
             var sPath = oSelectedItem.getBindingContextPath();
             //Navigate
             var sIndex = sPath.split("/")[sPath.split("/").length - 1];
             this.oRouter.navTo("wonderwomen",{
                supplierId: sIndex
             });
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

            // //Step 1 : get the mother object - container (appCon)
            // var oAppCon = this.getView().getParent();
            // //Step 2: Mother can talk to another child (Navigate to second view)
            // oAppCon.to("idView1");
        }
    });
});