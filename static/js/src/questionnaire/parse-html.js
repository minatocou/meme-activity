function parseTmpl(t){return t.id?template(t.id,t.data||[]).trim():t.tmpl?template.compile(t.tmpl)(t.data||{}).trim():void 0}template.config("openTag","${"),template.config("closeTag","}");