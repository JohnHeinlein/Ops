// ==UserScript==
// @name         Ops Item Specifics
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://ops.sunnking.com/Inventory/Process*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=css-tricks.com
// @require      http://code.jquery.com/jquery-3.7.0.min.js
// @require      https://raw.githubusercontent.com/davidshimjs/qrcodejs/master/qrcode.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// ==/UserScript==

/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true); // No conflict mode. Importing a new jq breaks ops' version and prevents some devexpress functions from firing.

function db(fun,str){if(debug) console.log(`[specifics.${fun}] ${str}`);}
const debug = false;

$(document).ready(function(){
    $("head").append('<script src="https://code.jquery.com/ui/1.13.3/jquery-ui.js"></script>'); // Inject Jquery UI framework so other injected DOM elements can call its functions
    getAccessToken().then(function(){               // First get a valid access token
        getDefaultCategoryTreeId().then(function(){ // Then initialize the root of the "Category tree" for the US store.
            injectCSS();
            initUI();                               // Inject custom UI. From here, functionality is handled by code in event listeners
        });
    });
});

// Inject CSS that's been precompiled from LESS.
function injectCSS(){
    // When not in debug, cache the stylesheet locally.
    // This will allow this script to be portable.
    // Otherwise, I use Stylus for live edits with a LESS preprocessor, then compile and minify it to store in the below variable.
    if(!debug){
        var css = `#jd-ebay-panel,#jd-ebay-panel #jd-ebay-aspect-table td,#jd-ebay-panel #jd-ebay-aspect-table tr{height:fit-content}#jd-ebay-panel,#jd-ebay-panel button:not(#jd-ebay-restore){color:#f8f8f8;box-shadow:1px 1px 3px #000!important;filter:unset!important}#jd-ebay-panel fieldset input,.jd-hidden{display:none}.jd-hidden{transform:scale(0);pointer-events:none}.jd-warning{animation:1s linear infinite alternate both jd-warning;transition:padding .1s linear;padding:0 5px;border-width:2px;margin-top:2px;margin-bottom:2px}@keyframes jd-warning{from{border-color:pink}to{border-color:red}}.jd-loading{position:relative}.jd-loading .jd-load-container{position:absolute;height:100%;width:100%;top:0}.jd-loading .jd-load-container i{font-size:25px;line-height:25px;color:#ff5722;position:absolute;margin:0!important;left:calc(50% - 25px/2);top:calc(50% - 25px/2);animation:1s linear infinite both loading}@keyframes loading{from{transform:rotate(0)}to{transform:rotate(360deg)}}.jd-loading .jd-load-container .jd-blur{position:absolute;height:100%;width:100%;backdrop-filter:blur(10px)}#AssetDetails_Top tr:nth-child(4),#AssetDetails_Top tr:nth-child(5){border-color:red;border-radius:5px;transition:padding .1s linear,border-width .2s linear,margin .1s linear}#jd-ebay-panel{display:flex;flex-flow:column;z-index:1;width:500px;max-height:500px;overflow-y:hidden;overflow-x:hidden;scrollbar-width:thin;background-color:#121212;border-radius:10px;border:unset!important;position:absolute!important;right:0;bottom:0;transition:transform .1s ease-out,box-shadow .1s ease-out}#jd-ebay-panel .jd-header{position:sticky;top:0;width:500px}#jd-ebay-panel .jd-header p{margin-bottom:0;padding-left:5px;background-color:#ff5722;font-size:14pt;user-select:none}#jd-ebay-panel .jd-header #jd-ebay-restore{position:absolute;top:0;right:0;border:unset;height:100%;background-color:transparent;font-size:12pt;color:#fff}#jd-ebay-panel .jd-header #jd-ebay-restore:hover{color:#000}#jd-ebay-panel #jd-ebay-body{display:flex;flex-flow:column;overflow-y:hidden}#jd-ebay-panel.ui-draggable-dragging{transform:scale(1.05);box-shadow:0 0 10px #000!important}#jd-ebay-panel #jd-ebay-table-container{overflow-y:auto}#jd-ebay-panel table{width:100%;margin:0!important}#jd-ebay-panel table tr th{text-align:center;border-bottom:1px solid #000}#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-value,#jd-ebay-panel table tr td,#jd-ebay-panel table tr th{padding:5px}#jd-ebay-panel table tr td:not(:first-child),#jd-ebay-panel table tr th:not(:first-child){border-left:1px solid #000}#jd-ebay-panel table tr:hover{background-color:#333}#jd-ebay-panel #jd-ebay-aspect-table td:first-child,#jd-ebay-panel #jd-ebay-aspect-table th:first-child{width:150px;text-align:right;padding:0 10px 0 0;height:100%}#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-recommended .jd-aspect-name,#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-required .jd-aspect-name{font-weight:700}#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-required .jd-aspect-name{color:red!important}#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-recommended .jd-aspect-name{color:green!important}#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-value input,#jd-ebay-panel #jd-ebay-aspect-table .jd-aspect-value select,#jd-ebay-panel #jd-ebay-controls #jd-ebay-confirm,#jd-ebay-panel #jd-ebay-controls #jd-ebay-suggest,#jd-ebay-panel .jd-catSelectButt{width:100%}#jd-ebay-panel #jd-ebay-aspect-table fieldset{display:flex;flex-flow:row wrap;gap:5px;justify-content:space-around}#jd-ebay-panel #jd-ebay-aspect-table fieldset label{flex-grow:1;margin:0;text-align:center;user-select:none}#jd-ebay-panel #jd-ebay-aspect-table fieldset label.ui-checkboxradio-checked{background-color:#ff5722}#jd-ebay-panel button:not(#jd-ebay-restore){background-color:#454545;border-radius:10px;border:unset!important;transition:background-color .1s linear;padding:5px}#jd-ebay-panel button:not(#jd-ebay-restore):hover{background-color:#22caff;color:#121212}#jd-ebay-panel #jd-ebay-controls{display:flex;position:sticky;top:0;flex-flow:row wrap;gap:5px;padding:10px}#jd-ebay-panel #jd-ebay-controls #jd-ebay-load-specs,#jd-ebay-panel #jd-ebay-controls #jd-ebay-save-specs{flex-grow:1}#jd-ebay-panel i{margin-right:5px}#jd-ebay-panel .fa-floppy-disk{color:green}#jd-ebay-panel .fa-arrows-rotate{color:red}#jd-ebay-panel fieldset label{border:1px solid #f6f6f6;padding:2px;border-radius:5px}#jd-ebay-panel #jd-ebay-warning{width:100%;margin:0;padding:5pt 0;text-align:center;font-weight:700;color:red;background-color:pink;border-radius:10px}`;
        var style = `<style id="jd-item-specifics-sheet" media="all">${css}</style>`;
        $('head').append($(style));
    }
}

// *************************
// EBAY API SETUP
// *************************
var accessToken = ''; // Populated with the starting "getAccessToken" call
var defaultCategoryTreeID = '' // populated with starting getDefaultCategoryTreeID() call

// https://developer.ebay.com/my/keys
const sbxID = 'JohnHein-itemSpec-SBX-572726e2f-17b95316'; // Sandbox App ID
const sbxSecret = 'SBX-72726e2fd023-a083-4c6c-8bf4-1c73'; // Sandbox secret
const prodID = 'JohnHein-itemSpec-PRD-e72b2ae15-53a2e679'; // Prod App ID
const prodSecret = 'PRD-72b2ae15a962-601b-43ee-9bfd-5d2a'; //Prod secret

// Set keys depending on whether we're in sandbox mode
const sandbox = false;
const apiID = sandbox? sbxID : prodID;
const apiSecret = sandbox? sbxSecret : prodSecret;
const b64client = btoa(`${apiID}:${apiSecret}`);
const apiURL = sandbox? 'api.sandbx.ebay.com' : 'api.ebay.com';

// ==================================================
// API Functions
// ==================================================

// Returns access token required to get suggested aspects
function getAccessToken(){
    return new Promise(function(resolve,reject){
        // https://developer.ebay.com/api-docs/static/oauth-client-credentials-grant.html
        var url = `https://${apiURL}/identity/v1/oauth2/token`; // e.g. Production URL https://api.ebay.com/identity/v1/oauth2/token
        GM_xmlhttpRequest({
            method:"POST",
            url:url,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                "Authorization":`Basic ${b64client}`
            },
            data:`grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope`,
            onload: function(response){
                db('getAccessToken',`Response received\n\t[${response.status}] ${response.statusText}`);

                resolve(accessToken = JSON.parse(response.responseText).access_token);
                reject(); // Need to read docs again on what this does exactly
            }
        });
    });
}

// Fetch the "root ID" of the "Category Tree" for the USA store, from the eBay API
function getDefaultCategoryTreeId(marketplace_id = 'EBAY_US'){
    return new Promise(function(resolve,reject){
        var url = `https://${apiURL}/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=${marketplace_id}`;
        GM_xmlhttpRequest({
            method:"GET",
            url:url,
            headers:{
                "Authorization":"Bearer " + accessToken,
                "Accept":"application/json",
                "Accept-Encoding":"gzip"
            },
            onload: function(response){
                defaultCategoryTreeID = JSON.parse(response.responseText).categoryTreeId;

                db('getDefaultCategoryTreeId',`${response.status} ${response.statusText}: ${defaultCategoryTreeID}`);
                if(debug) console.log(JSON.parse(response.responseText)); // for interactive debug console

                resolve(JSON.parse(response.responseText));
            }
        });
    });
}

// Return list of category suggestions for given search query (typically the title of the ad)
function getCategorySuggestions(query){
    return new Promise(function(resolve,reject){
        if(sandbox){
            console.log(`[getCategorySuggestions] API Call not supported in sandbox mode!`);
            reject("getCategorySuggestions API Call not supported in sandbox mode!");
            return; //Do I need this after reject?
        }
        db('getCategorySuggestions',`Query:'${query}'\nCategory ID:${defaultCategoryTreeID}`);

        var q = encodeURIComponent(query); // URI encode the query string for the URL below
        var url = `https://${apiURL}/commerce/taxonomy/v1/category_tree/${defaultCategoryTreeID}/get_category_suggestions?q=${q}`;
        GM_xmlhttpRequest({
            method:"GET",
            url:url,
            headers:{
                "Authorization":"Bearer " + accessToken,
                "Accept":"application/json",
                "Accept-Encoding":"gzip"
            },
            onload: function(response){
                var suggestions = JSON.parse(response.responseText).categorySuggestions;
                db('getCategorySuggestions',`${response.status} ${response.statusText}\nURL: ${url}`);
                resolve(suggestions);
            }
        });
    });
}

// Get the list of item aspects for a specific category
function getAspects(catId){
    return new Promise(function(resolve,reject){
        var url = `https://${apiURL}/commerce/taxonomy/v1/category_tree/0/get_item_aspects_for_category?category_id=${catId}`;
        GM_xmlhttpRequest({
            method:"GET",
            url:url,
            headers:{
                "Authorization":"Bearer " + accessToken,
                "Accept":"application/json",
                "Accept-Encoding":"gzip"
            },
            onload: function(response){
                db("getAspects", `${response.status} ${response.statusText}`);
                if(debug) console.log(JSON.parse(response.responseText).aspects);
                resolve(JSON.parse(response.responseText).aspects);
            }
        });
    });
}

// ==================================================
// UI Functions
// ==================================================

// Generate the bulk of the necessary UI and attach functions once they're injected
function initUI(){
    const panel =
    `<div id="jd-ebay-panel">
        <div class="jd-header">
          <p class='ui-widget-header'>Item Specifics</p>
          <button id='jd-ebay-restore'><i class='fa-solid fa-down-right'></i></button>
        </div>
        <div id="jd-ebay-body">
        <div id="jd-ebay-controls">
            <p id='jd-ebay-warning'class='jd-hidden'>Select a Product to begin!</p>
            <button id="jd-ebay-suggest" class=""><i class="fa-solid fa-magnifying-glass"></i>Suggest Categories</button>
            <button id="jd-ebay-confirm" class="jd-hidden"><i class="fa-solid fa-right-to-bracket"></i>Transfer to Notes</button>
            <button id="jd-ebay-save-specs" class="jd-hidden"><i class='fa-solid fa-pen'></i>Save to Product</button>
            <button id="jd-ebay-load-specs" class="jd-hidden"><i class='fa-regular fa-floppy-disk'></i>Load from Product</button>
        </div>
        <div id="jd-ebay-suggestions"></div>
        <div id="jd-ebay-table-container">
             <table id='jd-ebay-category-table' class='jd-hidden'>
                 <thead>
                     <tr>
                       <th></th>
                       <th>ID</th>
                       <th>Name</th>
                     </tr>
                 </thead>
                 <tbody></tbody>
             </table>
             <table id='jd-ebay-aspect-table' class='jd-hidden'>
                 <thead>
                     <tr>
                       <th>Category ID</th>
                       <th id='jd-ebay-catID'></th>
                     </tr>
                     <tr>
                       <th>Aspect</th>
                       <th>Value</th>
                     </tr>
                 </thead>
                 <tbody></tbody>
             </table>
        </div>
        </div>
    </div>`;

    // Allow menu to be dragged using JQUI
    $("body").append($(panel).draggable({handle: 'p.ui-widget-header'}));

    // Hook up functionality once appended to DOM
    $("#jd-ebay-suggest").on("click",getSuggestions);
    $("#jd-ebay-confirm").on("click",confirmSpecifics);

    $("#jd-ebay-save-specs").on("click",saveSpecs);
    $("#jd-ebay-load-specs").on("click",loadSpecs);

    // Return UI to bottom right
    $("#jd-ebay-restore").on("click",function(){
        $("#jd-ebay-panel").css({
            "left": "unset",
            "top": "unset"
        });
    });

    // Listen for changes to Product field and update the UI if we find a local spec sheet.
    $("#products_list").on("change",function(){
        $("#jd-ebay-warning").addClass("jd-hidden");
        $("#jd-ebay-suggest").removeClass("jd-hidden");

        // Check for locally-stored spec information
        getSpecs(getProdStr()).then(function(specs){
            if(specs != "NONE"){
                $("#jd-ebay-load-specs").removeClass("jd-hidden");
            }else{
                $("#jd-ebay-load-specs").addClass("jd-hidden");
            }
        });
    });
    $("#products_list").trigger("change"); // Run above event listener as a check on load

    // Remove fancy warning animations.
    $("#products_list").on("change",function(){
        if($("#products_list").val() != ""){
            $("#AssetDetails_Top tr:nth-child(5)").removeClass("jd-warning");
        }
    });
    $("#Process_Type").on("change",function(){
        if($("#Process_Type option:selected")[0] != "undefined"){
            $("#AssetDetails_Top tr:nth-child(4)").removeClass("jd-warning")
        }
    });
}

// Get suggestions for item category based on the text in the "product" field. Then, construct UI containing results
// Called by #jd-ebay-suggest click event
function getSuggestions(){
    if(!validateFields()){ // First ensure that the necessary fields are populated
        $("#jd-ebay-warning").removeClass("jd-hidden");
        return
    }else{
        loading($("#jd-ebay-body"),true); // Add loading icon
        $("#jd-ebay-warning").addClass("jd-hidden"); // Remove warning in case it existed previously
        $("#jd-ebay-suggest").toggleClass("jd-hidden");

        //Retrieve the text of the Product field
        var itemModel = $("#products_list").val();

        db("getSuggestions",`Getting suggested categories for "${itemModel}"...`);

        // Add loading icon
        getCategorySuggestions(itemModel).then(function(suggestions){
            suggestions.forEach(sugg => {
                $('#jd-ebay-category-table tbody').append( catAsTr(sugg.category.categoryId, sugg.category.categoryName) );
            });
            $('#jd-ebay-panel .jd-catSelect').on("click",function(){
                $("#jd-ebay-confirm").toggleClass("jd-hidden");
                $("#jd-ebay-save-specs").toggleClass("jd-hidden");

                // Check if we've already saved specs locally to Tampermonkey
                // The async call makes this a little uglier than it should be
                var specsExist = false;
                getSpecs(getProdStr()).then(function(specs){
                    db("getSuggestions.getCategorySuggestions.specsExist", "Checking for extant specs...");
                    if(specs != "NONE"){
                        db("getSuggestions.getCategorySuggestions.specsExist","Specs exist, adding load specs button");
                        //$("#jd-ebay-load-specs").removeClass("jd-hidden");
                        $("#jd-ebay-save-specs")[0].innerText = "Overwrite saved specs"
                        $("#jd-ebay-save-specs").prepend($(`<i class="fa-solid fa-arrows-rotate"></i>`));
                    }else{
                        db("getSuggestions.getCategorySuggestions.specsExist","Specs do not exist; stub");
                    }
                });

                chooseCategory(
                    this.parentElement.children[1].innerHTML,
                    this.parentElement.children[2].innerText
                );
            });
            loading($("#jd-ebay-body"),false); // Add loading icon
            $("#jd-ebay-category-table").toggleClass("jd-hidden"); // Show category table
        });
        db("getSuggestions",`Done!`);
    }
}

// Called once a category is selected from the first list of options
function chooseCategory(catId, catText){
    loading($("#jd-ebay-body"),true); // Add loading icon
    db("chooseCategory",`Chosen cat ${catId}, getting aspects...`);

    $("#jd-ebay-category-table").toggleClass("jd-hidden");
    $("#jd-ebay-aspect-table").toggleClass("jd-hidden");

    // Add category ID
    $("#jd-ebay-catID")[0].innerText = `${catId}: ${catText}`;

    getAspects(catId).then(function(aspects){
        aspects.forEach(aspect => {
            $('#jd-ebay-aspect-table').append(aspectAsTr(aspect));
        });

        // Add extra configuration to controls once they're in the DOM
        $("fieldset input[type='checkbox']").checkboxradio({icon: false}); // JQUI

        // Allow for text field when "other" is selected
        $(".jd-aspect-select").on("change",function(){
            if( $(this).children(":selected")[0].innerText == "Other"){
                $(this).parent().append(`<input class='jd-aspect-select-other'>`);
            }else{
                $(this).parent().children('.jd-aspect-select-other').remove();
            }
        });
        loading($("#jd-ebay-body"),false); // Add loading icon
    });
};

// Get formatted specifics and add to Notes field.
function confirmSpecifics(){
    var notes = parseSpecs();
    setNotes(notes);
    $("#jd-ebay-panel").toggleClass("jd-hidden");
}

// Parse item specifics and return a string representation
function parseSpecs(){
    var toNotes =
        '\n====================' +
        '\nEBAY ITEM SPECIFICS' +
        `\n${$("#jd-ebay-catID")[0].innerText}` +
        '\n====================\n';

    $(".jd-aspect").each(function(){
        var name = $(this).children(".jd-aspect-name")[0].innerHTML;
        var control = $(this).children(".jd-aspect-value").children()[0];
        var value = '';

        // Normal dropdown
        db("confirmSpecifics",`${control}`);
        console.log(control);

        if($(control).hasClass("jd-aspect-select")){
            value = $(control).children(":selected")[0].innerText;
            if(typeof value == 'undefined'){value = ""}
            if(value == "Other"){
                console.log($(control));
                value = $(control).parent().children('.jd-aspect-select-other').val();
            }

        // Text field
        }else if($(control).hasClass("jd-aspect-input")){
            value = $(control).val();

        // Multi-select
        }else if($(control).hasClass("jd-aspect-multi")){
            $(control).children('.ui-checkboxradio-checked').each(function(){
                value += `${this.innerText}, `;
            })
            value = value.slice(0, -2); // Remove last comma when we're done
        }
        //if(value == "") value = "-";
        if(value != ""){
            toNotes += `${name}: ${value}\n`;
        }
    });
    return toNotes;
}

// Append content to notes field
function setNotes(notes){
    $("#Notes_textarea")[0].value += notes;
}

// Get locally-stored specifics for given Type + Product string
async function getSpecs(prodStr){ // prodStr := `${typeStr} ${prodStr}`
    return await GM.getValue(prodStr, "NONE");
}

// Check for content in both Type and Product field. Used to prevent suggestions before necessary information is present.
// Returns true iff both fields are populated
function validateFields(){
    var valid = true;

    // Check Type field
    var typeRow = $("#AssetDetails_Top tr:nth-child(4)");
    if(typeof $("#Process_Type option:selected")[0] == "undefined"){
        typeRow.addClass("jd-warning");
        valid = false;
    }else{
        typeRow.removeClass("jd-warning");
    }

    // Check Product field
    var prodRow = $("#AssetDetails_Top tr:nth-child(5)");
    if($("#products_list").val() == ""){
       prodRow.addClass("jd-warning");
       valid = false;
    }else{
       prodRow.removeClass("jd-warning");
    }

    return valid;
}

// ==================================================
// Local Storage Functions
// ==================================================

// Store given tuple (Type + Product),(Formatted specs string) locally
async function setSpecs(prodStr, prodSpecs){
    GM_setValue(prodStr,prodSpecs);
}

// Store given specs locally, indexed by (Type + Product). Pulls from UI automatically
function saveSpecs(){
    setSpecs(getProdStr(),parseSpecs());
}

// Load specs from local storage and put in Notes field
function loadSpecs(){
    getSpecs(getProdStr()).then(function(specs){
        setNotes(specs);
    });
    //$("#jd-ebay-panel").toggleClass("jd-hidden");
}

// Get combo of Type and Product fields
function getProdStr(){
    try{
        var typeStr = $("#Process_Type option:selected")[0].innerText;
        var prodStr = $("#products_list").val();

    }catch (e){db("ERR: getProdStr","Fields not loaded");}
    return `${typeStr} ${prodStr}`;
    //return $("#Process_Type option:selected")[0].innerText + " " + $("#products_list").val();
}

// ==================================================
// HTML Generation functions
// ==================================================
function catAsTr(catId,catName){
    return $(`
      <tr class='jd-catSugg'>
        <td class="jd-catSelect"><button class="jd-catSelectButt">Select</button></td>
        <td class="jd-catID">${catId}</td>
        <td class="jd-catName">${catName}</td>
      </tr>
    `);
}

// Convert aspect JSON from eBay API into usable chunk of HTML
// https://developer.ebay.com/api-docs/commerce/taxonomy/resources/category_tree/methods/getItemAspectsForCategory
function aspectAsTr(aspect){
    db("aspectAsTr",`Generating HTML for aspect:`);

    var constraints = aspect.aspectConstraint;

    // Style the element depending on whether the aspect is required, or only recommended
    var usage = '';
    if(aspect.aspectConstraint.aspectRequired){
        usage = 'required';
    }else if(aspect.aspectConstraint.aspectUsage == "RECOMMENDED"){
        usage = 'recommended';
    }

    // Generate table row for aspect
    var aspectTr = $(`
    <tr class='jd-aspect jd-aspect-${usage}'>
      <td class='jd-aspect-name'>${aspect.localizedAspectName}</td>
      <td class='jd-aspect-value'>
        ${makeControl()}
      </td>
    </tr>
    `);

    // Generate input fields depending on the type of data that the aspects require
    function makeControl(){
        if(constraints.itemToAspectCardinality == "SINGLE"){
            if(constraints.aspectMode == "FREE_TEXT" || constraints.aspectMode == "SELECTION_ONLY"){
                if(typeof aspect.aspectValues == 'undefined'){
                    return makeInput();
                }else{
                    return makeSelect();
                }
            }else{
                return `<p style='color:red'>Unsupported aspectMode: ${constraints.aspectMode}</p>`;
            }
        }else if(constraints.itemToAspectCardinality == "MULTI"){
            if(typeof aspect.aspectValues == 'undefined'){
                return makeInput();
            }else{
                return makeMultiSelect();
            }
        }else{
            return `<p style='color:red'>Unsupported cardinality: ${constraints.itemToAspectCardinality}</p>`;
        }
    }

    function makeSelect(){
        var aspectValues = aspect.aspectValues;
        console.log(aspect);

        var options = `<option value='0'></option>\n`;
        options += `<option value='other'>Other</option>\n`;

        aspectValues.forEach(function(element,index){
            options += `<option value='${index + 1}'>${element.localizedValue}</option>\n`;
        });
        return `<select class='jd-aspect-select'>${options}</select>`;
    }
    function makeInput(){
        return `<input class='jd-aspect-input'>`;
    }
    function makeMultiSelect(){
        var values = aspect.aspectValues;
        if (typeof values == 'undefined'){return `<p style="color: red">Err parsing aspectValues for ${aspect.localizedAspectName}</p>`}
        var legend = aspect.localizedAspectName;
        var ctrl = `<fieldset class='jd-aspect-multi'>${makeCheckboxes(values)}</fieldset>`;

        function makeCheckboxes(values){
            var toRet = "";
            values.forEach(function(value,index){
                var label = `<label for='${legend}-${index}'>${value.localizedValue}</label>`;
                var checkbox = `<input type='checkbox' name='${legend}-${index}' id='${legend}-${index}'>`;
                toRet += (checkbox + label);
            });
            return toRet;
        }
        return ctrl;
    }

    return aspectTr;
}

function loading(element, enabled){
    if(enabled){
        element.append(`
            <div class="jd-load-container">
              <div class="jd-blur"></div>
              <i class="fa-solid fa-spinner"></i>
            </div>
        `.trim());
        element.toggleClass("jd-loading");
    }else{
        element.children(".jd-load-container").remove();
        element.toggleClass("jd-loading");
    }
}
