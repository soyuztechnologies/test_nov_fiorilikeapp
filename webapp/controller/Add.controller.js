sap.ui.define([
    'ey/fin/ar/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel'
], function(BaseController, MessageBox, MessageToast, JSONModel) {
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