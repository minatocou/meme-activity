!function(e,t){"function"==typeof define&&define.amd?define(["jquery"],function(e){return t(e)}):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(e.jQuery)}(this,function(e){!function(e){e.fn.selectpicker.defaults={noneSelectedText:"Aucune sélection",noneResultsText:"Aucun résultat pour {0}",countSelectedText:function(e){return e>1?"{0} éléments sélectionnés":"{0} élément sélectionné"},maxOptionsText:function(e,t){return[e>1?"Limite atteinte ({n} éléments max)":"Limite atteinte ({n} élément max)",t>1?"Limite du groupe atteinte ({n} éléments max)":"Limite du groupe atteinte ({n} élément max)"]},multipleSeparator:", ",selectAllText:"Tout Sélectionner",deselectAllText:"Tout Dé-selectionner"}}(e)});