const express = require('express');
const request = require('request');

const router = express();

const api_key = "MrunalDe-MrunalAp-PRD-d2eb4905c-3e24c023";

router.get('/', function (req, res) {

    var keyword = req.query.keyword;
    var priceFrom = req.query.priceFrom;
    var priceTo = req.query.priceTo;
    var condition = req.query.condition;
    var returnAccepted = req.query.returnAccepted;
    var shipping = req.query.shipping;
    var sortBy = req.query.sortBy;  
    
    var url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${api_key}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${keyword}`;
    var filterarray = [];
    var urlfilter = "";

    // referred from ebay apis tutorial
    function buildURLArray() {
        for (var i = 0; i < filterarray.length; i++) {
            var itemfilter = filterarray[i];
            for (var index in itemfilter) {
                if (itemfilter[index] !== "") {
                    if (itemfilter[index] instanceof Array) {
                        for (var r = 0; r < itemfilter[index].length; r++) {
                            var value = itemfilter[index][r];
                            urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value;
                        }
                    }
                    else {
                        urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
                    }
                }
            }
        }
    }

    if (sortBy) {
        url += `&sortOrder=${sortBy}`;
    }

    if (priceFrom !== undefined) {
        filterarray.push(
            {
                "name": "MinPrice",
                "value": priceFrom,
                "paramName": "Currency",
                "paramValue": "USD"
            });
    }

    if (priceTo !== undefined) {
        filterarray.push(
            {
                "name": "MaxPrice",
                "value": priceTo,
                "paramName": "Currency",
                "paramValue": "USD"
            });
    }

    if (condition) {
        filterarray.push(
            {
                "name": "Condition",
                "value": condition,
                "paramName": "",
                "paramValue": ""
            });
    }

    if (returnAccepted) {
        filterarray.push(
            {
                "name": "ReturnsAcceptedOnly",
                "value": true,
                "paramName": "",
                "paramValue": ""
            });
    } else {
        filterarray.push(
            {
                "name": "ReturnsAcceptedOnly",
                "value": false,
                "paramName": "",
                "paramValue": ""
            });
    }

    if (shipping) {
        if(shipping.includes("free")) {
            filterarray.push(
                {
                    "name": "FreeShippingOnly",
                    "value": true,
                    "paramName": "",
                    "paramValue": ""
                });
        } else {
            filterarray.push(
                {
                    "name": "FreeShippingOnly",
                    "value": false,
                    "paramName": "",
                    "paramValue": ""
                });
        }
        if(shipping.includes("expedited")) {
            filterarray.push(
                {
                    "name": "ExpeditedShippingType",
                    "value": "Expedited",
                    "paramName": "",
                    "paramValue": ""
                });
        }
    }

    buildURLArray(filterarray);

    url += urlfilter;
    console.log("url = " + url);
    request.get(url, (errorResponse, response, data) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        jsonObj = JSON.parse(data);
        searchResult = jsonObj.findItemsAdvancedResponse[0].searchResult;
        
        result = [];
        
        if (searchResult[0]["@count"] == "0") {
            res.send(result);
            return;
        }
        var ebayDefaultUrl = "https://thumbs1.ebaystatic.com/pict/04040_0.jpg";
        var expectedDefaultUrl = "https://csci571.com/hw/hw8/images/ebayDefault.png";

        item = (searchResult[0]["item"]);
        for (var i = 0; i < item.length; i++) {
            try {
                itemToAdd = {};
                item1 = item[i];
                itemToAdd["count"]=searchResult[0]["@count"];
                console.log(itemToAdd["count"]);
                itemToAdd["title"] = item1["title"][0];
                itemToAdd["viewItemURL"] = item1["viewItemURL"][0];
                itemToAdd["galleryURL"] = item1["galleryURL"][0];
                // if(itemToAdd["galleryURL"]==ebayDefaultUrl)
                // {
                //     itemToAdd["galleryURL"]=expectedDefaultUrl;
                // }
                itemToAdd["currentPrice"] = item1["sellingStatus"][0]["currentPrice"][0]["__value__"];
                itemToAdd["location"] = item1["location"][0];
                itemToAdd["categoryName"] = item1["primaryCategory"][0]["categoryName"][0];
                itemToAdd["condition"] = item1["condition"][0]["conditionDisplayName"][0];
                itemToAdd["shippingType"] = item1["shippingInfo"][0]["shippingType"][0];
                if ("shippingServiceCost" in item1["shippingInfo"][0]) {
                    itemToAdd["shippingServiceCost"] = item1["shippingInfo"][0]["shippingServiceCost"][0]["__value__"];
                }
                itemToAdd["topRatedListing"]=item1["topRatedListing"][0];
                console.log(itemToAdd["topRatedListing"]);
                itemToAdd["shipToLocations"] = item1["shippingInfo"][0]["shipToLocations"][0];
                itemToAdd["expeditedShipping"] = item1["shippingInfo"][0]["expeditedShipping"][0];
                itemToAdd["oneDayShippingAvailable"] = item1["shippingInfo"][0]["oneDayShippingAvailable"][0];
                itemToAdd["bestOfferEnabled"] = item1["listingInfo"][0]["bestOfferEnabled"][0];
                itemToAdd["buyItNowAvailable"] = item1["listingInfo"][0]["buyItNowAvailable"][0];
                itemToAdd["listingType"] = item1["listingInfo"][0]["listingType"][0];
                itemToAdd["gift"] = item1["listingInfo"][0]["gift"][0];
                if ("watchCount" in item1["listingInfo"][0]) {
                    itemToAdd["watchCount"] = item1["listingInfo"][0]["watchCount"][0];
                }
                itemToAdd["productId"] = item1["itemId"][0];

                itemToAdd['shippingInfo'] = item1['shippingInfo'][0];
    
                result.push(itemToAdd);
            } catch (error) {
                continue;
            }
        }
        res.send(result);
        console.log(url);
    });
});



router.get('/productId', function (req, res) {
    var productId = req.query['productId'];
    var url="http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=MrunalDe-MrunalAp-PRD-d2eb4905c-3e24c023&siteid=0&version=967&ItemID="+productId+"&IncludeSelector=Description,Details,ItemSpecifics";
    request.get(url, (errorResponse, response, data) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        result = [];
        jsonObj = JSON.parse(data);
        l=[];
        Item_tag=[]
        l.push(jsonObj);
       // nameValue= [];
        


        l1=l[0]["Item"];
        Item_tag.push(l1);
        console.log(Item_tag.length);
         for (var i = 0; i < Item_tag.length; i++) {
            try {
                itemToAdd = {};
                itemToAdd['PictureURL']=Item_tag[0]["PictureURL"];
                
                
                extra=Item_tag[0]['ItemSpecifics']['NameValueList'];
               
                for(i=0;i<extra.length;i++)
                {
                    if(extra[i]['Name'] =='Brand')
                    {
                        itemToAdd["BrandValue"]=extra[i]['Value'][0];
                        break;
                    }
                    else
                    {
                    itemToAdd["BrandValue"]= null;
                    }
                }
                
                if(Item_tag[0]["Subtitle"] != undefined)
                {
                itemToAdd["Subtitle"]=Item_tag[0]["Subtitle"];
                console.log("gtjttj"+itemToAdd["Subtitle"]);
                }
                else{
                    itemToAdd["Subtitle"]= null;
                    console.log("abc");
                }
                
                itemToAdd['NameValueList']=Item_tag[0]['ItemSpecifics']['NameValueList'];
                count=0;
                nameValue=[];
            
                NameList=(Item_tag[0]['ItemSpecifics']['NameValueList']);
                console.log(NameList);
                console.log("Name list size"+NameList.length)
                for( i=0; i <NameList.length; i++ ){
                    if (NameList[i]['Name'] != 'Brand')
                    {
                        nameValue.push(NameList[i]['Value']);
                        count++;
                    }
                }
            
                
                only5values=[];
                if(count>5)
                {
                    for(i=0;i<5;i++)
                    {
                        only5values.push(nameValue[i]);
                    }
                    itemToAdd["NameValueList1"] = only5values;
                }
                else
                    itemToAdd["NameValueList1"]=nameValue;
                    
                itemToAdd['Seller']=Item_tag[0]["Seller"]
                itemToAdd['User ID']=Item_tag[0]["Seller"]['UserID'];
                itemToAdd['Feedback Rating Star']=Item_tag[0]["Seller"]['FeedbackRatingStar'];
                itemToAdd['Feedback Score']=Item_tag[0]["Seller"]['FeedbackScore'];
                itemToAdd['Positive Feedback Percent']=Item_tag[0]["Seller"]['PositiveFeedbackPercent'];
                
                itemToAdd['Return Policy']=Item_tag[0]["ReturnPolicy"];
                itemToAdd['Refund']= Item_tag[0]["ReturnPolicy"]['Refund'];
                itemToAdd['Returns Within']=Item_tag[0]["ReturnPolicy"]['ReturnsWithin'];
                itemToAdd['Returns Accepted']=Item_tag[0]["ReturnPolicy"]['Returns Accepted'];
                itemToAdd['Shipping Cost Paid By']=Item_tag[0]["ReturnPolicy"]['ShippingCostPaidBy'];
                itemToAdd['International Returns Accepted']=Item_tag[0]["ReturnPolicy"]['InternationalReturnsAccepted'];
               
            result.push(itemToAdd);
            } catch (error) {
                continue;
            }

        } 
        res.send(result);
        //res.send(jsonObj);
        console.log(url);
    });
   
    // item = (searchResult[0]["item"]);
       
});

module.exports = router;