!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],function(e){return t(e)}):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(e.jQuery)}(this,function(e){!function(e){e.fn.selectpicker.defaults={noneSelectedText:"Ei valintoja",noneResultsText:"Ei hakutuloksia {0}",countSelectedText:function(e){return 1==e?"{0} valittu":"{0} valitut"},maxOptionsText:function(e,t){return[1==e?"Valintojen maksimimäärä ({n} saavutettu)":"Valintojen maksimimäärä ({n} saavutettu)",1==t?"Ryhmän maksimimäärä ({n} saavutettu)":"Ryhmän maksimimäärä ({n} saavutettu)"]},selectAllText:"Valitse kaikki",deselectAllText:"Poista kaikki",multipleSeparator:", "}}(e)});