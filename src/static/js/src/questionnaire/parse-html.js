
template.config('openTag', '${');
template.config('closeTag', '}');

function parseTmpl(option){
	if(option.id){
		return template(option.id, option.data || []).trim();
	} else if(option.tmpl){
		return template.compile(option.tmpl)(option.data || {}).trim();
	}
}