sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment'
], function(BaseController, MessageBox, MessageToast, JSONModel, Fragment) {
    'use strict';
    return BaseController.extend("ey.fin.ar.controller.Add",{
        onInit: function(){
            //Create a local json model - which will hold my payload to be sent to backend (SAP)
            var payload = {
                                "PRODUCT_ID": "",
                                "TYPE_CODE": "PR",
                                "CATEGORY": "Notebooks",
                                "NAME": "",
                                "DESCRIPTION": "",
                                "SUPPLIER_ID": "0100000046",
                                "SUPPLIER_NAME": "SAP",
                                "TAX_TARIF_CODE": "1 ",
                                "MEASURE_UNIT": "EA",
                                "PRICE": "0.00",
                                "CURRENCY_CODE": "EUR",
                                "DIM_UNIT": "CM",
                                "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/OC-9595.jpg"
                            };

            this.oLocalModel = new JSONModel({
                payloadData: payload
            });

            this.getView().setModel(this.oLocalModel,"temp");
            this.setMode("Create");
        },
        setMode: function(sMode){            
            this.mode = sMode;
            if(this.mode === "Create"){
                this.getView().byId("productid").setEnabled(true);
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("idDelete").setEnabled(false);
            }else{
                this.getView().byId("productid").setEnabled(false);
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("idDelete").setEnabled(true);
            }
        },
        onLoadMostExp: function(){
            //Step 1: get the odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            //Step 2: call the function import - get the key from dropdown for category
            var category = this.oLocalModel.getProperty("/payloadData/CATEGORY");
            var that = this;
            //Step 3: in the callback when we get the data - set it to local model
            
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters:{
                    I_CATEGORY : category
                },
                success: function(data){
                    that.oLocalModel.setProperty("/payloadData", data);
                }
            });
        },
        onDelete: function(){
            //Step 1: get the odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            var that = this;
            //Step 2: ask user a confirmation for delete
            MessageBox.confirm("Would you like to delete for sure?", {
                onClose: function(status){
                    if(status === "OK"){
                        //Step 3: fire the delete call
                        var that2 = that;
                        oDataModel.remove("/ProductSet('" + that.prodId +"')",{
                            success: function(){
                                MessageToast.show("The deletion was done");
                                that2.setMode("Create");
                            }
                        });
                    }
                }
            })
            
        },
        //create a global variable for product id
        prodId: null,
        onLoadProduct: function(){
            //Step 1: What is product id entered by user on the screen
            //this.prodId = this.getView().byId("productid").getValue();
            this.prodId = this.oLocalModel.getProperty("/payloadData/PRODUCT_ID");

            //Step 2: Get the odata model object
            var oDataModel = this.getOwnerComponent().getModel();

            //Step 3: Read the single product from odata using GET call;
            var that = this;
            oDataModel.read("/ProductSet('" + this.prodId +  "')", {
                success: function(datafromSAP){
                    //Step 4: Handle the response
                    //Step 5: set the data to local model 
                    that.oLocalModel.setProperty("/payloadData", datafromSAP);
                    that.setMode("Change");
                    that.getView().byId("myPhoto").setSrc("/sap/opu/odata/sap/ZNOV_ODATA_SRV/ProductImgSet('" + datafromSAP.PRODUCT_ID + "')/$value")
                },
                error: function(){
                    //Step 4: Handle the response
                    MessageBox.confirm("Amigo, your product not Found");
                    that.setMode("Create");
                }
            });
            
        },
        onConfirmPopup: function(oEvent){
            //Step 1: get the selected item object
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step 2: from the object list item which was chosen, get the title
            var sSupplier = oSelectedItem.getTitle();
            this.oLocalModel.setProperty("/payloadData/SUPPLIER_NAME", oSelectedItem.getIntro())
            //Step 3: set the data to the same input field inside table
            this.oField.setValue(sSupplier);
            
        },
        oSupplierPopup: null,
        oField: null,
        onF4Supplier: function(oEvent){
            this.oField = oEvent.getSource();
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
                        path: "/SupplierSet",
                        template: new sap.m.ObjectListItem({
                            title:"{BP_ID}",
                            intro:"{COMPANY_NAME}",
                            number:"{CITY}",
                            numberUnit: "{COUNTRY}",
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
        onSave: function(){
            //Step 1: Get our payload from local model
            var payload = this.oLocalModel.getProperty("/payloadData");
            //Step 2: Pre-check before save data/validate
            if(!payload.PRODUCT_ID){
                MessageBox.error("Amigo, please enter a valid id");
                return;
            }
            //Step 3: Get the odata model object
            var oDataModel = this.getOwnerComponent().getModel();
            //Step 4: Trigger the POST request from odata model
            if(this.mode === "Create"){
                oDataModel.create("/ProductSet", payload, {
                    success: function(odata){
                        //Step 5: Handle success response - callback
                        MessageToast.show("Wallah! your product was created in system");
                    },
                    error: function(oErr){
                        //Step 6: Handle fails response - callback
                        console.log(oErr);
                        MessageBox.error("OOPS!! something went wrong : " + JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }else{
                oDataModel.update("/ProductSet('" + this.prodId + "')", payload, {
                    success: function(odata){
                        //Step 5: Handle success response - callback
                        MessageToast.show("Wallah! your product was CHANGED in system");
                    },
                    error: function(oErr){
                        //Step 6: Handle fails response - callback
                        console.log(oErr);
                        MessageBox.error("OOPS!! something went wrong : " + JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });
            }
            
            
        },
        onCancel: function(){
            this.setMode("Create");
            this.oLocalModel.setProperty("/payloadData",{
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000046",
                "SUPPLIER_NAME": "SAP",
                "TAX_TARIF_CODE": "1 ",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "EUR",
                "DIM_UNIT": "CM",
                "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/OC-9595.jpg"
            });
        }
    });
});