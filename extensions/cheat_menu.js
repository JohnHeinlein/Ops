// ==UserScript==
// @name         Ops Cheat Menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cheat menu to add basic tools to every page
// @author       You
// @match        https://ops.sunnking.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azurewebsites.net
// @require      http://code.jquery.com/jquery-3.7.0.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @grant        none
// ==/UserScript==

/* global $ */
this.$ = this.jQuery = jQuery.noConflict(true); // No conflict mode. Importing a new jq breaks ops' version and prevents some devexpress functions from firing.
const DEBUG_MODE = false;
function debug(func, str){ if(DEBUG_MODE) console.log(`[tweaks.${func}] ${str}`) }

$(document).ready(function(){
    injectCSS();
    addMenu(); // Add menu to page
    populateMenu();
});

// Inject CSS that's been precompiled from LESS.
function injectCSS(){
    // When not in debug, cache the stylesheet locally.
    // This will allow this script to be portable.
    // Otherwise, I use Stylus for live edits with a LESS preprocessor, then compile and minify it to store in the below variable.
    //if(!DEBUG_MODE){
        var css = `#jd-cheat-container,#jd-cheat-container #jd-cheat-menu ul button{color:#f8f8f8;box-shadow:1px 1px 10px #000!important;filter:unset!important}@keyframes load-fade{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}.load-fade{animation:.25s ease-out load-fade}.jd-hidden{display:none!important;pointer-events:none}#jd-cheat-button{border:2px solid #ff5722;background-color:#2c2c2c;color:#fff;width:30px;height:30px;border-radius:30px;padding:0;margin:0 10px!important}#jd-cheat-button:hover{transform:scale(1.15)}#jd-cheat-container{background-color:#2c2c2c;border-radius:10px;border:unset!important;transition:width .25s,box-shadow .25s,transform .25s,opacity .25s;position:absolute!important;width:250px;height:fit-content;z-index:99;overflow:hidden}#jd-cheat-container *{margin:0}#jd-cheat-container.jd-hidden{display:unset!important;transform:scale(0) rotate(180deg);opacity:0}#jd-cheat-container.ui-draggable-dragging{box-shadow:0 0 20px 5px #000!important;transform:scale(1.05)!important}#jd-cheat-container h2{width:250px;padding-left:5px;font-size:16pt;font-weight:700;background:linear-gradient(to right,#ff5722 40%,#2c2c2c 90%)!important}#jd-cheat-container #jd-cheat-menu{width:250px;padding:5px}#jd-cheat-container #jd-cheat-menu h3{font-size:12pt;font-weight:700;margin:5px 0;border:1px solid #fff;border-width:0 0 2px}#jd-cheat-container #jd-cheat-menu ul{padding:0;display:flex;flex-flow:row wrap;gap:5px}#jd-cheat-container #jd-cheat-menu ul button{flex-grow:1;padding:5px;background-color:#454545;border-radius:10px;border:unset!important;transition:background-color .1s linear}#jd-cheat-container #jd-cheat-menu ul button:hover{background-color:#22caff;color:#121212}#jd-cheat-container #jd-cheat-menu ul input,#jd-cheat-container #jd-cheat-menu ul select{background-color:#121212}#jd-cheat-container #jd-cheat-menu #Info_box_dark{min-width:unset;width:100%;background:unset}#jd-cheat-container #jd-cheat-menu #Info_box_dark #Title_header,#jd-cheat-container #jd-cheat-menu #Info_box_dark #light-divider,#jd-cheat-container #jd-cheat-menu #Info_box_dark br{display:none}#jd-cheat-container #jd-cheat-menu #Info_box_dark *{margin:0!important}#jd-cheat-container #jd-cheat-menu #Info_box_dark #Tools_duplication{display:flex;gap:5px;padding:5px;text-align:unset}#jd-cheat-container #jd-cheat-menu #Info_box_dark #Tools_duplication #tools_asset{flex-grow:1}#jd-cheat-container #jd-cheat-menu #Info_box_dark #Tools_duplication #tools_qty{width:30%}#jd-cheat-container #jd-cheat-menu #Info_box_dark .Box_btn_submit_dark{padding:0;width:100%}#jd-cheat-container #jd-cheat-menu #Info_box_dark .Box_btn_submit_dark #btn_transfer{width:100%}#assetTagArea{width:fit-content!important}@media print and (max-width:4in){#assetTagArea{display:block!important;width:10in!important}#assetTagArea #AssetTagFirst,#assetTagArea #qrcodeCanvas,#assetTagArea [id^=assetTagCopy],#printableArea #AssetTagFirst,#printableArea #qrcodeCanvas,#printableArea [id^=assetTagCopy]{padding:.125in 0 0 .125in!important;background:#fff;display:grid!important;grid-template-columns:0.75in 1fr;grid-template-rows:1fr 1fr 1fr;grid-template-areas:"qr date" "qr asset" "qr sku";place-items:stretch}#assetTagArea #AssetTagFirst #qrcode,#assetTagArea #qrcodeCanvas #qrcode,#assetTagArea [id^=assetTagCopy] #qrcode,#printableArea #AssetTagFirst #qrcode,#printableArea #qrcodeCanvas #qrcode,#printableArea [id^=assetTagCopy] #qrcode{grid-area:qr;height:.75in!important;place-self:center start;margin:0!important}#assetTagArea #AssetTagFirst #print_Date,#assetTagArea #AssetTagFirst #print_Date1,#assetTagArea #qrcodeCanvas #print_Date,#assetTagArea #qrcodeCanvas #print_Date1,#assetTagArea [id^=assetTagCopy] #print_Date,#assetTagArea [id^=assetTagCopy] #print_Date1,#printableArea #AssetTagFirst #print_Date,#printableArea #AssetTagFirst #print_Date1,#printableArea #qrcodeCanvas #print_Date,#printableArea #qrcodeCanvas #print_Date1,#printableArea [id^=assetTagCopy] #print_Date,#printableArea [id^=assetTagCopy] #print_Date1{grid-area:date;place-self:end start}#assetTagArea #AssetTagFirst #print_Asset,#assetTagArea #AssetTagFirst #print_Asset1,#assetTagArea #qrcodeCanvas #print_Asset,#assetTagArea #qrcodeCanvas #print_Asset1,#assetTagArea [id^=assetTagCopy] #print_Asset,#assetTagArea [id^=assetTagCopy] #print_Asset1,#printableArea #AssetTagFirst #print_Asset,#printableArea #AssetTagFirst #print_Asset1,#printableArea #qrcodeCanvas #print_Asset,#printableArea #qrcodeCanvas #print_Asset1,#printableArea [id^=assetTagCopy] #print_Asset,#printableArea [id^=assetTagCopy] #print_Asset1{grid-area:asset;font-size:14pt!important;place-self:center start;font-weight:700;border:1px solid #000;border-width:1px 0}#assetTagArea #AssetTagFirst #print_sku,#assetTagArea #AssetTagFirst #print_sku1,#assetTagArea #qrcodeCanvas #print_sku,#assetTagArea #qrcodeCanvas #print_sku1,#assetTagArea [id^=assetTagCopy] #print_sku,#assetTagArea [id^=assetTagCopy] #print_sku1,#printableArea #AssetTagFirst #print_sku,#printableArea #AssetTagFirst #print_sku1,#printableArea #qrcodeCanvas #print_sku,#printableArea #qrcodeCanvas #print_sku1,#printableArea [id^=assetTagCopy] #print_sku,#printableArea [id^=assetTagCopy] #print_sku1{grid-area:sku;place-self:start start}#assetTagArea #AssetTagFirst h3,#assetTagArea #AssetTagFirst p,#assetTagArea #qrcodeCanvas h3,#assetTagArea #qrcodeCanvas p,#assetTagArea [id^=assetTagCopy] h3,#assetTagArea [id^=assetTagCopy] p,#printableArea #AssetTagFirst h3,#printableArea #AssetTagFirst p,#printableArea #qrcodeCanvas h3,#printableArea #qrcodeCanvas p,#printableArea [id^=assetTagCopy] h3,#printableArea [id^=assetTagCopy] p{padding:0!important;margin:0!important;font-size:12pt}#printableArea_Large{display:block!important;height:1in}}@media print and (min-width:4in){#jd-print{width:6in!important;height:4in!important;display:grid!important;grid-template-columns:2in 4in;grid-template-rows:2in 2in;grid-template-areas:"qr sku" "prod prod";place-items:stretch}#jd-print .qr{grid-area:qr;place-self:stretch;padding:5px}#jd-print .sku{grid-area:sku;place-self:center center;font-size:1in}#jd-print .prod{grid-area:prod;font-size:.4in;place-self:center center;text-align:center}#jd-print-support{transform:rotateX(360deg);overflow:hidden;width:4in!important;height:6in!important;display:grid!important;grid-template-columns:1in 1fr 1in;grid-template-rows:1in 1in min-content 1fr;grid-template-areas:"qr-asset 	asset 	asset" "sku 		sku 	qr-sku" "loc 		loc 	loc" "prod 		prod	prod";place-items:center}#jd-print-support .qr-asset{grid-area:qr-asset}#jd-print-support .qr-sku{grid-area:qr-sku}#jd-print-support .sku{grid-area:sku}#jd-print-support .prod{grid-area:prod;align-self:start;margin-top:5pt;font-size:.25in;font-weight:700}#jd-print-support .location{grid-area:loc;font-weight:700;line-height:.5in;font-size:.5in;justify-self:bottom}#jd-print-support .asset{grid-area:asset;justify-self:start;padding-left:5pt}#jd-print-support *{margin:0}#jd-print-support .location,#jd-print-support .prod{width:100%;border-top:1px solid #000;text-align:center}#jd-print-support .sku{justify-self:end;padding-right:5pt}#assetTagArea,#printableArea,#printableArea_Large{display:block!important;height:4in!important;width:6in!important}#assetTagArea,#printableArea{background:#fff}#assetTagArea #qrcodeCanvas,#printableArea #qrcodeCanvas{height:100%!important;width:100%!important;display:grid!important;grid-template-columns:2in 1fr;grid-template-rows:0.4in 2in 1fr;grid-template-areas:"date date" "qr asset" "sku sku";place-items:center stretch}#assetTagArea #qrcodeCanvas #qrcode,#printableArea #qrcodeCanvas #qrcode{grid-area:qr;width:2in;height:2in;image-rendering:crisp-edges}#assetTagArea #qrcodeCanvas #print_Date,#printableArea #qrcodeCanvas #print_Date{grid-area:date;height:100%;width:100%;font-size:.3in;font-weight:700;border:1px solid #000;border-width:0 0 2px}#assetTagArea #qrcodeCanvas #print_Asset,#printableArea #qrcodeCanvas #print_Asset{grid-area:asset;font-size:.75in!important;overflow:wrap!important}#assetTagArea #qrcodeCanvas #print_sku,#printableArea #qrcodeCanvas #print_sku{grid-area:sku;font-size:.75in;font-weight:700}#assetTagArea #qrcodeCanvas h3,#assetTagArea #qrcodeCanvas p,#printableArea #qrcodeCanvas h3,#printableArea #qrcodeCanvas p{font-size:20pt;padding:0!important;margin:0!important;text-align:center}}#printableArea:not(:only-child){display:none!important}`;
        var style = `<style id="jd-cheat-sheet" media="all">${css}</style>`;
        $('head').append($(style));
    //}
}

// Add options to cheat menu depending on current URL
function populateMenu(){
    if(window.location.href.includes("/Process")){
        // addSection("R2v3").append(
        //     $(`<button>Very Good (C5/F3)</button>`).on(
        //         "click", () => {
        //             setr2('c5','f3')
        //         })
        // );
        addSection("Printing")
            .append($(`<button>SKU</button>`).on(
                "click", () => {
                    printSKU();
                })
            ).append($(`<button>Support</button>`).on(
                "click", () => {
                   printSupport();
                })
        );
        // addSection("Submit").append(
        //     $(`<button>R2, Loc & Save</button>`).on("click", () => {
        //         setr2('c5','f3');
        //         $("#process_location_list_").val("To Be Listed ").change();
        //         $("#ProcessBtnSave").click();
        //     })
        // );
    }else if(window.location.href.includes("/View/Assets")){
        addSection("Assets").append(
            $(`<button>Sale stickers</button>`).on(
                "click",() => {
                    printSaleSticker();
                })
        );
    }

    addSection("Duplication Tool","duplication")
        .load(`https://${window.location.hostname}/Tools/DuplicationTool #Info_box_dark`, function(){});
}

// Add sections to cheat menu
function addSection(header, classTxt=""){
    var tmp = `<h3>${header}</h3><ul class=${classTxt}></ul>`;
    return $("#jd-cheat-menu").append($(tmp)).children(`h3:contains('${header}') ~ ul`); // add section to last header, then return that section
}

function addButton(header, button, buttfunc){
    //$("#jd-cheat-menu > h3:contains(${header})");
}

// Add special commands menu
function addMenu(){
    var header = $(".ip_header");

    var menuButt = `<button id='jd-cheat-button'>JD</div>`;

    var menuBody =
        `<div id='jd-cheat-container' class='jd-hidden'>
          <h2>Cheat Menu</h2>
          <div id='jd-cheat-menu'>
          </div>
        </div>`;

    // Add cheat menu button
    header.prepend(menuButt);
    $('#jd-cheat-button').on("click",function(){
      $('#jd-cheat-container').toggleClass('jd-hidden');
    });
    $('.dx-scrollview-content .page-wrap').prepend(
        $(menuBody).draggable({
            snap:'.dx-viewport',
            containment:'.float-container2'
        })
    );
}

// =========================
// Button functions
// =========================

function printSaleSticker(){
    var cust_style = `:root{ --jd-bg: #acabab; --jd-txt: #454545; } .jd-tag { width: 4in !important; height: 6in !important;  display:grid !important; grid-template-columns: 2.75in 1.25in; grid-template-rows:  1.5in 3.5in 1in; grid-template-areas: "price logo" "prod prod" "asset asset"; place-items: stretch; } .jd-tag .jd-qrAsset{ grid-area: asset; place-self:stretch; padding:5px; image-rendering: pixelated; height:100%; width:1in; z-index:2; } .jd-tag .asset{ grid-area: asset; place-self: right center; z-index:1; width:100%;  text-align:right;  print-color-adjust: exact; background:var(--jd-bg); color:var(--jd-txt); } .jd-tag .asset h3{ font-size:0.5in; line-height:1in; } .jd-tag .prod { grid-area: prod; place-self: center center;  font-size: 0.4in;  width:90%; text-align: center; text-wrap:pretty; } .jd-tag .price{ grid-area: price; place-self: center center;  text-align:center; font-size:1in;  width:100%; height:100%; font-weight:bold;  print-color-adjust: exact; background:var(--jd-bg); color:var(--jd-txt); } .jd-tag .jd-logo{ object-fit:cover; object-position: left 50%; place-self:left;  print-color-adjust: exact; color:var(--jd-txt); filter:grayscale(100); } `
    var qrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=`;

    var rows = $(".dx-datagrid-rowsview tr.dx-data-row"); //TODO: Iterate on selected, not visible
    for(let i = 0; i < rows.length; i++){
        var children = rows[i].childNodes;
        var item = {
            asset: children[2].innerText,
            type:  children[3].innerText,
            sku:   children[6].innerText,
            manu:  children[10].innerText,
            model: children[11].innerText,
            part:  children[12].innerText,
            price: children[15].innerText
        }

        var qrAsset = qrl + item.asset;
        var qrSku = qrl + item.sku;

        // Generate element
        const logoURL = '/img/Color_Logo_NoTag.png';
        const printElement =
              `<div class="jd-tag" style="display:none">
                    <div class="price">$${item.price}</div>
                    <img class="jd-logo" alt="Logo" src=${logoURL}></img>
                    <p class="prod">${item.manu} ${item.model} ${item.part}</p>
                    <div class="asset"><h3>${item.asset}</h3></div>
                    <img class="jd-qrAsset" alt="QR-Code" src=${qrAsset}></img>
                  </div>`;

        // Make things visible
        $("#assetTagArea").css('display','block');
        ;$("#qrcodeCanvas").css("display","none");

        $(".jd-tag").css("display","block");

        $("body").append(printElement);
        // $("#assetTagArea").append(``);
    } // End for

    // Move main content to fragment
    var tmp = $(document.createDocumentFragment());
    tmp.append($("#layout-drawer-scrollview"));

    $("html").append($(`<style id='jd-css-print' media='print'>${cust_style}</style>`));

    // Add print area to main document
    $("body").append($(".jd-tag"));

    // Print as a blocking operation
    window.print();

    // Return to original page by removing tags and restoring fragment
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    $("body").append(tmp);

    $("#assetTagArea").css("display","none");
}

function setr2(cos = 'c5', fun = 'f3'){
    // $(`#r2v3_cosmetic option:contains('${cos}')`).prop('selected', true);
    // $(`#r2v3_functional option:contains('${fun}')`).prop('selected', true);
    $(`#${cos}`).prop('selected',true);
    $(`#${fun}`).prop('selected',true);
}

function printSKU(){
    var printArea = $('#printableArea');
    var newPrint =
        `<div id="jd-print" class="print-sku" style="display:none">
          <img id="jd-qr" class="qr" alt="QR-Code"></img>
          <h3 class="sku">SKU</h3>
          <div class="prod">Product</div>
        </div>`;

    $("#layout-drawer-scrollview .page-wrap").prepend(newPrint);

    debug("clicked");
    let sku = $("#Process_SKU").text();
    let prod = $("#products_list")[0].value;
    let qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${sku}`;

    // Toggle print visibilities
    $("#printableArea").css('display','block');
    $("#qrcodeCanvas").css("display","none");
    $("#jd-print").css("display","block");

    // Populate information
    $("#jd-print .sku").text(sku);
    $("#jd-print .prod").text(prod);

    $('#jd-print .qr').attr('src',qrURL);
    $('#jd-qr').on("load", print('#jd-print')); // Print once QR code loads
}
function printSupport(){
    //var css = ``;
    //var style = `<style class="jd-sheet" media="all">${css}</style>`;
    //$('head').append($(style));

    let printID = "#jd-print-support";

    var printArea = $('#printableArea');
    var newPrint =
        `<div id="jd-print-support" style="display:none">
          <img class="qr-asset" class="qr" alt="QR-Code"></img>
          <h3 class="asset">ASSET</h3>
          <img class="qr-sku" class="qr" alt="QR-Code"></img>
          <h3 class="sku">SKU</h3>
          <div class="prod">Product</div>
          <div class="location"><p>[LOCATION]</p></div>
        </div>`;
    // Might
    // <div class="notes"><p>[NOTES]</p></div>

    $("#layout-drawer-scrollview .page-wrap").prepend(newPrint);

    // Collect inf
    let sku = $("#Process_SKU").text();
    let prod = $("#products_list")[0].value;
    let asset = $("#Process_AssetID").val();
    let loc = $("#process_location_list_").val();
    let qrAssetURL = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${asset}`;
    let qrSkuURL = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${sku}`;

    // Populate info
    $(`${printID} .sku`).text(sku);
    $(`${printID} .prod`).text(prod);
    $(`${printID} .asset`).text(asset);
    $(`${printID} .location`).text(loc);
    $(`${printID} .qr-asset`).attr('src',qrAssetURL);
    $(`${printID} .qr-sku`).attr('src',qrSkuURL);
    $(`${printID} .qr-sku`).on("load", print(printID)); // Print once QR code loads

    // Toggle print visibilities
    $("#printableArea").css('display','block');
    $("#qrcodeCanvas").css("display","none");
    $(printID).css("display","block");
}

function print(printID){
    var tmp = document.createDocumentFragment();
    var printme = document.getElementById( printID.slice(1) /*Ignore #*/ ).cloneNode(true);
    //var printme = $(printID).clone();

    while (document.body.firstChild) {
        tmp.appendChild(document.body.firstChild);
    }
    document.body.appendChild(printme);

    window.print();

    while (document.body.firstChild) {
        // empty the body again (remove the clone)
        document.body.removeChild(document.body.firstChild);
    }
    // re-add the temporary fragment back into the page, restoring initial state
    document.body.appendChild(tmp);

    $(printID).remove();
}

// TESTING
function refunds(){
	var toret = "";

    var assets = prompt("Assets to refund").split(" ");
	console.log(assets);
    assets.forEach((asset) => {
        refund(asset);
    })

    console.log(toret);

    //
	function refund(asset){
        $.ajax({
            url: '/View/ProcessRefundAsset',
            data: { asset: asset },
            type: "POST",
            success: function (response) {
                if (response) {
                    // location.href = '/Inventory/Process/' + response;
                    toret.append(`https://ops.sunnking.com/Inventory/Process/${response}`);
                }
            }
        });
    }
 }

/* UTILITY FUNCTIONS */
function makeWindow(id,title){
    // TODO: Generate standard window to unify all of these utilities
}
