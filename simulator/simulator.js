(function(window,document,undefined){
	"use strict";

	let count = 1,
		storeID;

	function lib(obj){
		
		const main = k("div",{
			class: "main",
		},[
			k("div",{
				class: "sim"
			},[
				k("div",{
					class: "telephone"
				},[
					k("div",{
						class:["bg","animate","jackInTheBox"]
					}),
					k("div",{
						class:"arc"
					})
				])
			]),
			k("div",{
				class: "codes",
			},[
				k("div",{
					id: "code1",
					class: ["code","n1"]
				},[
					k("pre",{
						class: ["line-numbers","language-javascript"],
						data: {
							src: "./code1.js"
						}
					})
				]),
				k("div",{
					id: "code2",
					class: ["code","n2","hide"]
				},[
					k("pre",{
						class: ["line-numbers","language-javascript"],
						data: {
							src: "./code2.js"
						}
					})
				])
			]),
			k("div",{
				class: "req"
			},[
				k("div",{
					class: "card"
				},[
					k("button",{
						class: "btn-req",
						on:{
							click: apiCall
						}
					},"Let's try!"),
					k("div",{
						id: "key",
						class: ["key"]
					})
				])
			])
		]);

		function request(obj){
			return new Promise((resolve,reject)=>{
				var xhr = new XMLHttpRequest();
				var dataS = "";
				var dataL = +Object.keys(obj.data).length;
				for(var key in obj.data)
				{
					dataS += key+"="+obj.data[key]+(dataL>1?"&":"");
					dataL--;
				}
	            xhr.open(obj.method,obj.url,true);
	            /*if (typeof obj.cors === "boolean" && obj.cors === true) xhr.withCredentials = true;*/
	            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.onloadend = function()
				{
					resolve(xhr.responseText);
				}
				/*xhr.onload = function()
				{
					resolve(xhr.responseText);
					console.log(xhr);
				}*/
	            xhr.send(obj.data ? dataS : null);
	        });
		}

		function apiCall(){
			const button = document.querySelector(".btn-req"),
				bg = document.querySelector(".bg");
				button.innerText = "";
				button.style.backgroundImage = "url('img/ring.gif')";

			if(count === 1){
				bg.classList.remove("jackInTheBox");
				bg.classList.add("shakeIt");
				bg.classList.add("infinite");
				count++;
				request({
					url: "https://us-central1-blip-c1e83.cloudfunctions.net/createTestStore",
					method: "POST",
					cors: true,
					data:{
				        "storeName": "Test Store",
				        "storeLogo": "Your store logo URL",
				        "storeBackground": "Your store background URL",
				        "locationLat": "43.698184",
				        "locationLong": "-79.48899",
				        "city": "Your city",
				        "country": "CA",
				        "line1": "Your line 1 address",
				        "postalCode": "L5L 6A2",
				        "province": "ON",
				        "businessName": "Test Business",
				        "businessTaxId": "000000000",
				        "firstName": "Your name",
				        "lastName": "Your last name",
				        "email": "Your email"
				    }
				}).then(function(res){
					console.log(res);

					const fCode = document.querySelector("#code1"),
						sCode = document.querySelector("#code2"),
						str = sCode.querySelectorAll(".string")[3],
						key = document.querySelector("#key");

					button.style.backgroundImage = "none";
					button.innerText = "Make Delivery!";
					str.innerText = storeID = res;
					key.innerHTML = "<b>Your Store ID: </b><br />"+storeID,
					key.classList.add('animate');
					key.classList.add('fadeInDown');
					key.style.display = "block"
					bg.classList.remove("infinite");
					bg.classList.remove("shakeIt");
					fCode.classList.add("animate");
					fCode.addEventListener("animationend",function(){
						fCode.classList.add("hide")
						sCode.style.left = 0;
					},true);
					fCode.classList.add("slideOutLeft");
					sCode.classList.add("animate");
					sCode.classList.remove("hide");
					sCode.addEventListener("animationend",function(){

					},true);
					sCode.classList.add("slideInRight");
				});
			}else if (count === 2){
				count++;
				request({
					url: "https://us-central1-blip-c1e83.cloudfunctions.net/makeDeliveryRequest",
					method: "POST",
					cors: true,
					data:{
				        "storeID": storeID,
				        "deliveryLat": "43.668184",
				        "deliveryLong": "-79.49899",
				        "deliveryMainInstruction": "Eg. Deliver order 1234",
				        "deliverySubInstruction": "Eg. Deliver to John Smith at front door",
				        "originLat": "43.698184",
				        "originLong": "-79.48899",
				        "pickupMainInstruction": "Eg. Pickup from My business",
				        "pickupSubInstruction": "Eg. Come to the back door",
				        "recieverName": "John Smith",
				        "recieverNumber": "XXX-XXX-XXXX",
				        "pickupNumber": "XXX-XXX-XXXX"
				    }
				}).then(function(res){

					const bg = document.querySelector(".bg");

					bg.classList.remove("shakeIt");
					bg.addEventListener("animationend",function(){
						
						bg.classList.remove("lightSpeedOut");
						bg.style.backgroundSize = "30%";
						bg.style.backgroundImage = "url('img/Pickup_Icon.jpg')";
						bg.classList.add("fadeIn");

					},true);
					bg.classList.add("lightSpeedOut");

					button.style.backgroundImage = "none";
					button.innerText = "Done!";

				});
			}
		}

		k.mount(obj.el,main);
	}

	window.simulator = lib;

})(window,document)