!function(e){"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){e.extend(e.validator.messages,{required:"Это поле необходимо заполнить.",remote:"Пожалуйста, введите правильное значение.",email:"Пожалуйста, введите корректный адрес электронной почты.",url:"Пожалуйста, введите корректный URL.",date:"Пожалуйста, введите корректную дату.",dateISO:"Пожалуйста, введите корректную дату в формате ISO.",number:"Пожалуйста, введите число.",digits:"Пожалуйста, вводите только цифры.",creditcard:"Пожалуйста, введите правильный номер кредитной карты.",equalTo:"Пожалуйста, введите такое же значение ещё раз.",extension:"Пожалуйста, выберите файл с правильным расширением.",maxlength:e.validator.format("Пожалуйста, введите не больше {0} символов."),minlength:e.validator.format("Пожалуйста, введите не меньше {0} символов."),rangelength:e.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),range:e.validator.format("Пожалуйста, введите число от {0} до {1}."),max:e.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),min:e.validator.format("Пожалуйста, введите число, большее или равное {0}.")})});