sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			 concatenateStringWithHyphen: function (a, b){
			  	return a + " - " + b;
			  },
			  
			  concatenateString: function (a, b){
			  	return a +  b;
			  },
			formatPurchaseDate : function (date) {
				return "Date: " + date;
			},
			
			formatLocation: function(long, lat){
				return "(" + long + "," + lat + ")" ;
			},
			
			formatCatchId: function(catchId){
					return "Catch ID: " + catchId;
			},
			formatOwner : function (owner) {
				return "Holder: " + owner;
			},
			userState :  function (state) {

				if (state === "ENABLED") {
					return "Success";
				} else {
					return "Error";
				}
			},
			
			splitRoles :  function (commaSeperatedRoles) {

				if(commaSeperatedRoles && commaSeperatedRoles.length > 0){
					var roles = commaSeperatedRoles.split(",");
					return roles;
				}
				else{
					return "";
				}
			},
			
			splitCommaSeperatedValues :  function (commaSeperatedValues) {

				if(commaSeperatedValues && commaSeperatedValues.length > 0){
					var roles = commaSeperatedValues.split(",");
					return roles;
				}
				else{
					return "";
				}
			},
			
			formatRoles :  function (roles) {

				if(roles && roles.length > 0){
					roles = roles.replace("PLS_", "");
					roles = roles.replace("PLS_", "");
					roles = roles.replace("PLS_", "");
					return roles;
				}
				else{
					return "";
				}
			}
			
			
		};

	}
);