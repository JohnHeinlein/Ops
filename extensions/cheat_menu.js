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
const DEBUG_MODE = true;
function debug(func, str){ if(DEBUG_MODE) console.log(`[tweaks.${func}] ${str}`) }

$(document).ready(function(){
    addMenu(); // Add menu to page
    populateMenu();
});

// Add options to cheat menu depending on current URL
function populateMenu(){
    if(window.location.href.includes("/Process")){
        addSection("R2v3").append(
            $(`<button>Very Good (C5/F3)</button>`).on(
                "click", () => {
                    setr2('c5','f3')
                })
        );
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
        addSection("Submit").append(
            $(`<button>R2, Loc & Save</button>`).on("click", () => {
                setr2('c5','f3');
                $("#process_location_list_").val("To Be Listed ").change();
                $("#ProcessBtnSave").click();
            })
        );
    }else if(window.location.href.includes("/View/Assets")){

        addSection("Assets").append(
            $(`<button>Sale stickers</button>`).on(
                "click",() => {
                    printSaleSticker();
                })
        );
    }

    addSection("Duplication Tool","duplication")
        .load(`https://${window.location.hostname}/Tools/DuplicationTool #Info_box_dark`, function(){
              // Runs once loaded
          });

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
        $(menuBody).draggable()
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
        `<div id="jd-print" style="display:none">
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
    $('#jd-qr').on("load", function(){
        // From Ops 10's ProcessPrint function
        var tmp = document.createDocumentFragment(),
            printme = document.getElementById('jd-print').cloneNode(true);
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

        //$("#printableArea").css("display","none");
        $("#jd-print").css("display","none");
    });
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
    $(`${printID} .qr-sku`).on("load", function(){
        // From Ops 10's ProcessPrint function
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
    });

    // Toggle print visibilities
    $("#printableArea").css('display','block');
    $("#qrcodeCanvas").css("display","none");
    $(printID).css("display","block");
}

function print(printID){
    var tmp = document.createDocumentFragment();

    //var printme = document.getElementById( printID.slice(1) /*Ignore #*/ ).cloneNode(true);
    var printme = $(printID).clone();

    // while (document.body.firstChild) {
    //     tmp.appendChild(document.body.firstChild);
    // }
    $("body").children().each(function(index){
        $(tmp).append(this);
    });

    //document.body.appendChild(printme);
    $(tmp).append(printme);

    window.print();

    while (document.body.firstChild) {
        // empty the body again (remove the clone)
        document.body.removeChild(document.body.firstChild);
    }
    // re-add the temporary fragment back into the page, restoring initial state
    document.body.appendChild(tmp);

    //$("#printableArea").css("display","none");
    //$(printID).css("display","none");
    $(printID).remove();
}

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
