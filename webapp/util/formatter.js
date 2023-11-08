sap.ui.define([
    
], function(require, factory) {
    'use strict';
    return {
        getText: function(status){
            switch (status) {
                case "A":
                    return "Available";
                    break;
                case "O":
                        return "Out of Stock";
                        break;
                case "D":
                    return "Discontinued";
                    break;
                default:
                    break;
            }
        },
        getStatus: function(status){
            
            switch (status) {
                case "A":
                    return "Success";
                    break;
                case "O":
                        return "Warning";
                        break;
                case "D":
                    return "Error";
                    break;
                default:
                    break;
            }
        }
    }
});