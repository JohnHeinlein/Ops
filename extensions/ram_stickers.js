// ==UserScript==
// @name         Ops Stickers
// @namespace    http://tampermonkey.net/
// @version      2024-09-23
// @description  Utility to generate and print stickers for inventory purposes
// @author       You
// @match        https://ops.sunnking.com/stickers
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-3.7.0.min.js
// @grant        none
// ==/UserScript==

/* global $ */ // Prevent TamperMonkey from throwing a fit when i use $ as a function name
this.$ = this.jQuery = jQuery.noConflict(true); // No conflict mode. Importing a new jq breaks ops' version and prevents some devexpress functions from firing.

// Calls on page load
$(document).ready(function(){
    // I obviously don't have back-end access, so I render and inject the HTML & CSS
    // directly into the page once it loads
    injectCSS();
    injectHTML();

    // Jquery needs to be injected, since the "/sticker" URL doesn't actually exist and doesn't have any dependencies in <head>
    $("head").append($(`<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>`));

    // Print button
    $("#printButt").on("click",function(){
        // Pass a deep clone so we can just remove the whole container to print
        // instead of extracting the sticker area and trying to re-insert it
        printSticker($("#jd-sticker").clone());
    });

    // Update sticker's contents when any of the controls change
    $("#controls select,input").on("change", function(){
        // Collect values into variables
        let cap = $("#capacity option:selected").val(),
            gen = $("#generation option:selected").val(),
            speed = $("#speed option:selected").val(),
            feat = $("#feature option:selected").val(),
            hs = $("#heatspreader").val();

        // Update sticker elements
        $(".sticker-content.top").text(cap);
        $(".sticker-content.bot").text(`${gen} ${speed}-${feat}`);
        if($("#heatspreader").is(":checked")){
            $(".sticker-content.hs").text("HS")
        }else{$(".sticker-content.hs").text("")}
    });
    $("pre").remove(); // Weird element on the page that messed up print spacing. Could be hidden via CSS
});

function injectCSS(){
    // Define styles
    let style_container =
        `#container{
          display:flex;
          flex-flow:column;
          align-items:center;
          gap:10px;
        }`;
    let style_1x2 =
        `#jd-sticker{
          box-sizing:border-box;
          width:2in !important;
          height:0.9in;
          padding:0in 0.125in;

          background-color:white;

          display:grid;
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1.5fr 0.5fr;
          grid-template-areas:
            'top hs'
            'bot bot'
          ;
          place-items: center stretch;
        }
        .sticker-content.top{
          grid-area:top;
          font-weight:bold;
          font-size:0.4in;
        }
        .sticker-content.bot{
          grid-area:bot;
          font-size:0.25in;
        }
        .sticker-content.hs{
          grid-area:hs;
          font-size:0.275in;
        }
        .sticker-content{
          margin:0;
          height:100%;
          width:fit-content;
          font-family:sans-serif;
        }`;
    let style_controls =
        `#controls{
          background-color:white;
          border-radius:10px;
          padding:10px;
          width:fit-content;

          display:flex;
          flex-flow:column;
          align-items:center;
          gap:5px;
        }
        button{
          width:100%;
        }`;

    // Inject as one style
    $("head").append(
        $(`<style id='jd-sticker-style' media='all'>
          ${style_container}
          ${style_1x2}
          ${style_controls}
        </style>`)
    );
}
function injectHTML(){
        // Set up sticker HTML
    var sticker = `
    <div id="jd-sticker">
      <p class='sticker-content top'>Cap</p>
      <p class='sticker-content hs'>HS</p>
      <p class='sticker-content bot'>Specs</p>
    </div>`;

    // Set up controls area
    var controls = `
    <div id="controls">
      <div class="top">
        <select name="Capacity" id="capacity">
          <option value="4GB">4GB</option>
          <option value="8GB">8GB</option>
          <option value="16GB">16GB</option>
          <option value="32GB">32GB</option>
          <option value="64GB">64GB</option>
        </select>

        <input type="checkbox" id="heatspreader" name="heatspreader>
        <label for="heatspreader">Heatspreaders?</label>
      </div>
      <div class="bot">
        <select name="Generation" id="generation">
          <option value="PC4">PC4 (DDR4)</option>
          <option value="PC3">PC3 (DDR3)</option>
          <option value="PC3L">PC3L (DDR3)</option>
        </select>
        <select name="Speed" id="speed">
          <option value="8500">(PC3) 8500</option>
          <option value="10600">(PC3) 10600</option>
          <option value="12800">(PC3) 12800</option>
          <option value="14900">(PC3) 14900</option>
          <option value="2133P">(PC4) 2133P</option>
          <option value="2400T">(PC4) 2400T</option>
          <option value="2666V">(PC4) 2666V</option>
          <option value="2933Y">(PC4) 2933Y</option>
          <option value="3200A">(PC4) 3200AA</option>
        </select>
        <select name="Feature" id="feature">
          <option value="R">R (Registered)</option>
          <option value="U">U (Unregistered)</option>
          <option value="E">E (ECC)</option>
          <option value="S">S (SODIMM)</option>
          <option value="L">L (LRDIMM)</option>
        </select>
      </div>
      <button id = "printButt">Print</button>
    </div>`;

    // Package controls and stickers into a container
    var container = $(`
      <div id="container">
        ${sticker}
        ${controls}
      </div>
    `);

    // Add container to the page directly
    $("body").append(container);
}

// Mostly lifted from Ops' print function
function printSticker(sticker){
    // Move main content to fragment
    var tmp = $(document.createDocumentFragment());
    tmp.append($("#container"));

    // Append what we want to print to a blank sheet
    $("body").append(sticker);

    // Print as a blocking operation
    window.print();

    // Return to original page by removing tags and restoring fragment
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    $("body").append(tmp);
}
