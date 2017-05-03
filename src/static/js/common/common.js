/**
 * Created by Jesse on 16/12/1.
 */
Handlebars.registerHelper('compare', function(left, operator, right, options) {
    if (arguments.length < 3) {
        throw new Error('Handlerbars Helper "compare" needs 2 parameters');
    }
    var operators = {
        '==':     function(l, r) { return l == r; },
        '===':    function(l, r) {return l === r; },
        '!=':     function(l, r) {return l != r; },
        '!==':    function(l, r) {return l !== r; },
        '<':      function(l, r) {return l < r; },
        '>':      function(l, r) {return l > r; },
        '<=':     function(l, r) {return l <= r; },
        '>=':     function(l, r) {return l >= r; },
        'typeof': function(l, r) {return typeof l == r; },
        'json':     function(l,r) {console.log(JSON.stringify(l),"compare");return JSON.stringify(l); },
    };

    if (!operators[operator]) {
        throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
    }

    var result = operators[operator](left, right);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper('select', function( value, options ){
    var $el = $('<select />').html( options.fn(this) );
    $el.find('[value=' + value + ']').attr({'selected':'selected'});
    return $el.html();
});

/** 标签展开收起**/
$(".label-more").click(function () {
    var self = $(".label-more");
    if(self.hasClass("open")){
        self.html('更多<i class="fa fa-angle-right"></i>');
        self.removeClass("open");
    }else{
        self.html('收起<i class="fa fa-angle-down"></i>');
        self.addClass("open");
    }
});