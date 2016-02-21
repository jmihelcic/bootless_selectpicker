(function($) {

  var pluginName = 'selectpicker';
  var defaults = {
    placeholder: 'Select an option',
    dropDirection: 'down',
    menuSize: 'grow'
  };

  function Plugin(element, options) {
    this.pluginName = pluginName;
    this.defaults = defaults;
    this.element = $(element);
    this.options = $.extend({}, defaults, options);
    this.init();
  }

  Plugin.prototype.init = function() {
    this.constructed = this.createElement();
    this.listen();


    this.element.css('display', 'none');
    this.element.after(this.constructed);
  }


  Plugin.prototype.createElement = function() {

    var selected = this.element.find('option:selected');

    // Dropdown button html
    var selectDropdown = `
      <div class="select-dropdown">
        <span class="dropdown-text">${selected.text()}</span>
        <span class="dropdown-icon"></span>
      </div>
    `;

    // Options html
    var options = this.element.find('option');
    var optionsHTML = '';
    options.each( (index, value) => {
      var $value = $(value);
      var textAttr = $value.text();
      var classAttr = 'group-option';

      if($value.is(':selected'))
        classAttr += ' selected';

      var optionHTML = `
        <div class="${classAttr}" data-option-index="${index}">
          <span class="option-text">${textAttr}</span>
        </div>
      `;

      optionsHTML += optionHTML;
    });


    // Append options to group
    var groupsHTML = `
      <div class="menu-group">
        ${optionsHTML}
      </div>
    `;

    // Append groups to select-menu
    var selectMenu = `
      <div class="select-menu closed">
        ${groupsHTML}
      </div>
    `;

    // Whole element
    var constructed = `
      <div class="bootless-select" style="margin-top:200px">
        ${selectDropdown}
        ${selectMenu}
      </div>
    `;

    return $(constructed);
  }

  Plugin.prototype.listen = function() {
    if(!this.constructed) {
      console.log('error');
      return;
    }

    this.constructed.on('click', '.select-dropdown', () => {
      this.calculateMenu();
      this.constructed.find('.select-menu').toggleClass('closed');
    });
  }

  Plugin.prototype.calculateMenu = function() {
    this.constructed.find('.select-menu').attr('style','');

    var documentHeight = $(document).height();

    var elementPosition = this.constructed.offset();
    var elementHeight = this.constructed.outerHeight();
    var elementWidth = this.constructed.outerWidth();

    var menuHeight = this.constructed.find('.select-menu').outerHeight();
    var menuWidth = this.constructed.find('.select-menu').outerWidth();
    var menuPosition = Object.assign({}, elementPosition);

    // used for scrollbar compesation
    var tmpHeight = menuHeight;
    var tmpWidth = menuWidth + 5;

    // default direction bottom
    menuPosition.top = menuPosition.top + elementHeight + 5;

    // open direction
    if((menuPosition.top + elementHeight + menuHeight + 5) > documentHeight) {
      var invisibleDown = (menuPosition.top + elementHeight + menuHeight + 5) - documentHeight;
      var invisibleUp = (menuPosition.top - elementHeight - menuHeight - 5)
      if(Math.abs(invisibleDown) > Math.abs(invisibleUp)) {
        if(invisibleUp < 0) {
          menuHeight += invisibleUp - 10;
        }
        menuPosition.top = menuPosition.top - menuHeight - elementHeight - 10;
      }
      else {
        if(invisibleDown > 0) {
          menuHeight -= invisibleDown - elementHeight;
        }
      } 
    }

    // Menu width
    if(tmpHeight > menuHeight) {
      tmpWidth += 20;
    }

    var maxWidth = 'auto';
    var minWidth = 'auto';
    if(this.options.menuSize === 'fit') {
      maxWidth = elementWidth;
      tmpWidth = elementWidth;
    }
    if(this.options.menuSize === 'grow') {
      minWidth = elementWidth;
    }



    this.constructed.find('.select-menu').attr('style',`
        top: ${menuPosition.top}px;
        left: ${menuPosition.left}px;
        max-height: ${menuHeight}px;
        width: ${tmpWidth}px;
        max-width: ${maxWidth}px;
        min-width: ${minWidth}px;
      `);
  }


  $.fn[pluginName] = function( options ) {
    return this.each(function() {
      if(!$.data(this, 'plugin_'+pluginName)) {
        $.data(this, 'plugin_'+pluginName);
        new Plugin(this, options);
      }
    });
  }

})(jQuery);

$(function() {
  $('select').selectpicker(); 
})