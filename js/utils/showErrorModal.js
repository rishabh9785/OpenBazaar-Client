var $ = require('jquery');

module.exports = function(errorTitle, errorMessage) {
  "use strict";
  var errorModal = $('.js-messageModal');
  errorModal.removeClass('hide');
  errorModal.find('.js-messageModal-title').html(errorTitle);
  errorModal.find('.js-messageModal-message').html(errorMessage);
};
