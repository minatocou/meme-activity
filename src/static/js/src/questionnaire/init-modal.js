
//展示modal
$('body').on('click','[data-toggle="modal"][data-modal]',function(e){
    var modalId = this.getAttribute('data-modal');
    var modalTmplObj = {
        id : 'modal-template', 
        data: { 
            subModal: '${include "' + (modalInfo[modalId].equalsTo ? modalInfo[modalId].equalsTo : modalId) + '"}', 
            modalTitle: modalInfo[modalId].title,
            btnName: modalInfo[modalId].btnName
        }
    };
    var tmpl = parseTmpl(modalTmplObj);
    initModal(
        $(parseTmpl(
            {
                tmpl: tmpl, 
                data: { 
                    action: modalInfo[modalId].action 
                }
            })
        ).data({ target : this }),
        { show: modalInfo[modalId].showFunc, hidden: modalInfo[modalId].hiddenFunc }
    );
});


function initModal(modal,option){
    option = $.extend({
      show: function(){},
      hidden: function(){}
    },option);
    modal.appendTo('body').on({
        'show.bs.modal':function(e){
            option.show.call(this,e);
        },
        'hidden.bs.modal': function(e){
            option.hidden.call(this,e);

            modal.remove();
        }
    }).modal('show');
}