(function() {
  angular
    .module('validation.rule', ['validation'])
    .config(['$validationProvider', function($validationProvider) {
      var expression = {
        required: function(value) {
          return !!value;
        },
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        number: /^\d+$/,
        minlength: function(value, scope, element, attrs, param) {
          return value && value.length >= param;
        },
        maxlength: function(value, scope, element, attrs, param) {
          return !value || value.length <= param;
        }
      };

      var defaultMsg = {
        required: {
          error: 'This should be Required!!',
          success: '&nbsp;'
        },
        url: {
          error: 'This should be Url',
          success: '&nbsp;'
        },
        email: {
          error: 'This should be Email',
          success: '&nbsp;'
        },
        number: {
          error: 'This should be Number',
          success: '&nbsp;'
        },
        minlength: {
          error: 'This should be longer',
          success: '&nbsp;'
        },
        maxlength: {
          error: 'This should be shorter',
          success: '&nbsp;'
        }
      };
      $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    }]);
}).call(this);
