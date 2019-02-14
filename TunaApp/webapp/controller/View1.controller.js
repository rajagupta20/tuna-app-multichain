sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"tuna/TunaApp/model/formatter",
	"tuna/TunaApp/utils/GlobalVariable",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, formatter, GlobalVariable, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("tuna.TunaApp.controller.View1", {
		
		formatter: formatter,
		 onInit: function () {
		    // set explored app's demo model on this sample
		    
		    
		    // GlobalVariable.multiChainRpcUrl = "/multichain/" + this.getView().byId("multiChainInstanceId").getValue() + "/rpc";
		    GlobalVariable.multiChainRpcUrl = GlobalVariable.MULTICHAIN_URL_PREFIX + GlobalVariable.MULTICHAIN_INSTANCE_ID + "/rpc";
						
			this.loadMultichainData();			
		  },
		  
		  onSearch: function(evnt){
		  	
		  	var searchKey = evnt.getSource().getValue();
		  	
		  	if(searchKey.length <=0){
		  		this.loadMultichainData();
		  		return;
		  	}
		  	
		  	
		  	var that= this;
		  	var carObjJson =  {
								cars: []
		  					};
		  	var jsonObj = {
            			"jsonrpc" : "2.0",
						"method": "liststreamkeyitems",
						"params": [GlobalVariable.STREAM_NAME, searchKey]
					};
			
				var headerValue = {
					'apikey' : GlobalVariable.API_KEY
				};
			$.ajax({
	            url : GlobalVariable.multiChainRpcUrl,
	            type : 'POST',
	            headers: headerValue,
	            contentType: 'application/json',
	            data :  JSON.stringify(jsonObj),
	            dataType : "json",
	            success : function(data) {
	            	
	            	if(data.result.length > 0){
		            	var lastIndex = data.result.length - 1;
	            		var obj = data.result[lastIndex].data.json;
	            		
	            		obj.id = data.result[lastIndex].keys[0];
						carObjJson.cars.push(obj);
	            	}
	            	var oModel = new sap.ui.model.json.JSONModel(carObjJson);
		    		that.getView().setModel(oModel);
	            },
	           error: function (xhr, ajaxOptions, thrownError) {
	        		MessageBox.error(xhr.responseText);								
	          }
			});
			
					  
		  
		  },

		  loadMultichainData: function(){
		  	var that= this;
		  	var carObjJson =  {
								cars: []
		  					};
		  	var jsonObj = {
            			"jsonrpc" : "2.0",
						"method": "liststreamitems",
						"params": [GlobalVariable.STREAM_NAME]
					};
			
				var headerValue = {
					'apikey' : GlobalVariable.API_KEY
				};
			$.ajax({
	            url : GlobalVariable.multiChainRpcUrl,
	            type : 'POST',
	            headers: headerValue,
	            contentType: 'application/json',
	            data :  JSON.stringify(jsonObj),
	            dataType : "json",
	            success : function(data) {
	            	
	            	for (var i=0; i<data.result.length; i++) {
	            		var obj = data.result[i].data.json;
	            		
	            		obj.id = data.result[i].keys[0];
	            		carObjJson.cars = that.removeObjectByKey(obj.id, carObjJson.cars);
						carObjJson.cars.push(obj);
	            	}
	            	
	            	var oModel = new sap.ui.model.json.JSONModel(carObjJson);
		    		that.getView().setModel(oModel);
	            },
	           error: function (xhr, ajaxOptions, thrownError) {
	        		MessageBox.error(xhr.responseText);								
	          }
		  });
			
					  
		  
		  },
		
		  onListItemPress: function (evt) {
		    this.getView().byId("transferVehicleButton").setEnabled(true);
		  },
		  
		  onPressCreateVehicle: function(evnt){
				
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment( "CreateVehicleEntryFragment", "tuna.TunaApp.view.CreateVehicleDialog", this);
					this.getView().addDependent(this._oDialog);
				}
				else{
					this._oDialog.destroy();
					this._oDialog = null;
					this._oDialog = sap.ui.xmlfragment( "CreateVehicleEntryFragment", "tuna.TunaApp.view.CreateVehicleDialog", this);
					this.getView().addDependent(this._oDialog);
				}
				// var tempModel = new JSONModel(this.getView().getController().currentMasterData);
				// this._oDialog.setModel(tempModel);
				
				var metadataModel = new JSONModel("model/Metadata.json");
				metadataModel.setSizeLimit(500);
				this._oDialog.setModel(metadataModel, "metadataModel");
					
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialog.open();
			
		  },
		  
		  onClickSave: function(evnt){
				
				var that = this;
				var responseJsonObj = {};
				var catchId;
				var inputCatchId = sap.ui.core.Fragment.byId("CreateVehicleEntryFragment", "inputCatchId");
				if(!inputCatchId.getValue() || inputCatchId.getValue().length === 0){
					MessageBox.error("Enter Catch ID");
					return;
				}
				else{
					catchId = inputCatchId.getValue();
				}
				
				var inputLongitude = sap.ui.core.Fragment.byId("CreateVehicleEntryFragment", "inputLongitude");
				if(!inputLongitude.getValue() || inputLongitude.getValue().length === 0){
					MessageBox.error("Enter Longitude");
					return;
				}
				else{
					responseJsonObj.longitude = inputLongitude.getValue();
				}
				
				var inputLatitude = sap.ui.core.Fragment.byId("CreateVehicleEntryFragment", "inputLatitude");
				if(!inputLatitude.getValue() || inputLatitude.getValue().length === 0){
					MessageBox.error("Enter latitude");
					return;
				}
				else{
					responseJsonObj.latitude = inputLatitude.getValue();
				}
				
				var inputHolder = sap.ui.core.Fragment.byId("CreateVehicleEntryFragment", "inputHolder");	
				if(inputHolder.getSelectedItem().getProperty("text")  === "-- Select Owner --"){
					MessageBox.error("Select Holder");
					return;
				}
				else{
					responseJsonObj.holder = inputHolder.getSelectedItem().getProperty("text");
				}
					
				var inputDateOfCatching = sap.ui.core.Fragment.byId("CreateVehicleEntryFragment", "inputDateOfCatching");	
					 
				 if(inputDateOfCatching.getDateValue()){
				 	var oDate = inputDateOfCatching.getDateValue().toDateString();
				 	responseJsonObj.date = oDate;
				 }
				 else{
				 	MessageBox.error("Enter Date of Catching");
				    return;
				 }
				 
				var jsonObj = {
        			"jsonrpc" : "2.0",
					"method": "publish",
					"params": [GlobalVariable.STREAM_NAME, catchId, {"json": responseJsonObj}]
				};
			 
				var headerValue = {
					'apikey' : GlobalVariable.API_KEY
				};
				
				$.ajax({
	            url : GlobalVariable.multiChainRpcUrl,
	            type : 'POST',
	            headers: headerValue,
	            contentType: 'application/json',
	            data :  JSON.stringify(jsonObj),
	            dataType : "json",
	            success : function(data) {
	            	MessageBox.information("Record Created Successfully");
	            	that.loadMultichainData();		
	            	that._oDialog.close();
	            },
	           error: function (xhr, ajaxOptions, thrownError) {
	        		MessageBox.error(xhr.responseText);								
	          }
		  }); 
					 
		  	
		  },
		  
		  onClickCancel: function(evnt){
				this._oDialog.close();
		  },
		  
		  onClickCancelTransfer: function(evnt){
				this._oDialog2.close();
		  },
		  
		  onPressTransferVehicle: function(evnt){
		  	var oList = this.getView().byId("vehicleList");
		  	
		  	if( oList.getSelectedItem() === null){
		  		MessageBox.error("Select a record from the list");
		  		return;
		  	}
		  	var catchId = oList.getSelectedItem().getProperty("title").split(":")[1].trim();
		  	var longitude = oList.getSelectedItem().getProperty("numberUnit").substring(1, oList.getSelectedItem().getProperty("numberUnit").length -1).split(",")[0];
		  	var latitude = oList.getSelectedItem().getProperty("numberUnit").substring(1, oList.getSelectedItem().getProperty("numberUnit").length -1).split(",")[1];
		  	var currentOwner = oList.getSelectedItem().getAttributes()[1].getProperty("text").substring(7);
		  	var dateOfPurchase = oList.getSelectedItem().getAttributes()[0].getProperty("text").substring(6);
		  	
		  	if (!this._oDialog2) {
					this._oDialog2 = sap.ui.xmlfragment( "TransferVehicleEntryFragment", "tuna.TunaApp.view.TransferVehicleDialog", this);
					this.getView().addDependent(this._oDialog2);
				}
				else{
					this._oDialog2.destroy();
					this._oDialog2 = null;
					this._oDialog2 = sap.ui.xmlfragment( "TransferVehicleEntryFragment", "tuna.TunaApp.view.TransferVehicleDialog", this);
					this.getView().addDependent(this._oDialog2);
				}
				
				var metadataModel = new JSONModel("model/Metadata.json");
				metadataModel.setSizeLimit(500);
				this._oDialog2.setModel(metadataModel, "metadataModel");
					
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog2);
				this._oDialog2.open();
				
				var inputLatitude = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputLatitude");
				inputLatitude.setValue(latitude);
				
				var inputCurrentHolder = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputCurrentHolder");
				inputCurrentHolder.setValue(currentOwner);
				
				var inputCatchId = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputCatchId");
				inputCatchId.setValue(catchId);
				
				var inputLongitude = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputLongitude");
				inputLongitude.setValue(longitude);
				
				var inputDateOfCatching = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputDateOfCatching");
				inputDateOfCatching.setValue(dateOfPurchase);
		  },
		  
		  onClickTransfer: function(evnt){
				
				var that = this;
				var responseJsonObj = {};
				var registrationNo;

				var inputLatitude = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputLatitude");
				responseJsonObj.latitude = inputLatitude.getValue();
				
				
				var inputCatchId = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputCatchId");
				registrationNo = inputCatchId.getValue();
				
				var inputLongitude = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputLongitude");
				responseJsonObj.longitude = inputLongitude.getValue();
				
				
				var inputNewHolder = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputNewHolder");	
				if(inputNewHolder.getSelectedItem().getProperty("text")  === "-- Select Owner --"){
					MessageBox.error("Select New Holder");
					return;
				}
				else{
					responseJsonObj.holder = inputNewHolder.getSelectedItem().getProperty("text");
				}
					
				var inputDateOfCatching = sap.ui.core.Fragment.byId("TransferVehicleEntryFragment", "inputDateOfCatching");	
				var oDate = inputDateOfCatching.getValue();
				responseJsonObj.date = oDate;
				 
				var jsonObj = {
        			"jsonrpc" : "2.0",
					"method": "publish",
					"params": [GlobalVariable.STREAM_NAME, registrationNo, {"json": responseJsonObj}]
				};
			 
				var headerValue = {
					'apikey' : GlobalVariable.API_KEY
				};
				$.ajax({
	            url : GlobalVariable.multiChainRpcUrl,
	            type : 'POST',
	            headers: headerValue,
	            contentType: 'application/json',
	            data :  JSON.stringify(jsonObj),
	            dataType : "json",
	            success : function(data) {
	            	MessageBox.information("Tuna holder changed successfully");
	            	that.loadMultichainData();		
	            	that._oDialog2.close();
	            },
	           error: function (xhr, ajaxOptions, thrownError) {
	        		MessageBox.error(xhr.responseText);								
	          }
		  }); 
					 
		  },
		  
		  removeObjectByKey: function (key, array) {
		  	
		  	var newArray = [];
		  	for (var i=0; i<array.length; i++) {
		  		if(array[i].id !== key){
		  			newArray.push(array[i]);
		  		}
		  	}
		  	return newArray;
		  }

	});
});