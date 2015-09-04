/**
 * @fileOverview Assessment
 *
 * @author David
 */
$(function() {
	 /**
     * An object of selectors used in this view
     * @default null
     * @property SELECTORS
     * @type {Object}
     * @final
     */
	var SELECTORS = {
		SORTABLE_LIST1: '#sortable1',  
		SORTABLE_LIST2: '#sortable2',
		CHECKIT_BTN: '#checkIt',
		TRYIT_BTN: '#tryIt',
		RESETIT_BTN: '#resetIt',
		TRY_COUNTER: '#tries',
		DIALOG: '#dialog'
	};

	/**
     * An object of classes used in this view
     * @default null
     * @property CLASSES
     * @type {Object}
     * @final
     */
	var CLASSES = {
		CONNECTED_LISTS: 'connectedSortable',
		DEFAULT_STATE: 'ui-state-default',
		HIGHLIGHT_STATE: 'ui-state-highlight'
	};

	/**
     * Basic Assessement view
     *
     * @class Assessment
     * @constructor
     */
	var Assessment = function() {
		/**
         * A reference to the draggable list
         *
         * @default null
         * @property $list1
         * @type {jQuery}
         * @public
         */
		this.$list1 = null;

		/**
         * A reference to the droppable list
         *
         * @default null
         * @property $list2
         * @type {jQuery}
         * @public
         */
		this.$list2 = null;

		/**
         * A reference to the draggable item
         *
         * @default null
         * @property $sortable1Item
         * @type {jQuery}
         * @public
         */
		this.$sortable1Item = null;
		/**
         * A reference to the droppable item
         *
         * @default null
         * @property $sortable2Item
         * @type {jQuery}
         * @public
         */
		this.$sortable2Item = null;

		/**
         * A reference to the check it item
         *
         * @default null
         * @property $checkIt
         * @type {jQuery}
         * @public
         */
		this.$checkIt = null;
		/**
         * A reference to the try it item
         *
         * @default null
         * @property $tryIt
         * @type {jQuery}
         * @public
         */
		this.$tryIt = null;
		/**
         * A reference to the reset it item
         *
         * @default null
         * @property $resetIt
         * @type {jQuery}
         * @public
         */
		this.$resetIt = null;

		/**
         * A reference to how many tries we have done
         *
         * @default null
         * @property $tries
         * @type {jQuery}
         * @public
         */

		this.$tries = null;

		/**
         * A reference to the dialog box
         *
         * @default null
         * @property $dialog
         * @type {jQuery}
         * @public
         */
		this.$dialog = null;

		/**
         * total of index in the list1
         *
         * @default 0
         * @property numberOfItems
         * @type {Number}
         * @public
         */
		this.numberOfItems = 0;

		/**
         * How many correct cards we have
         *
         * @default 0
         * @property correctCards
         * @type {Number}
         * @public
         */
		this.correctCards = 0;

		/**
         * How many times we tried
         *
         * @default 0
         * @property totalTries
         * @type {Number}
         * @public
         */
		this.totalTries = 0;

		/**
         * A clone of our div
         *
         * @default null
         * @property numberOfItems
         * @type {String}
         * @public
         */
		this.divClone = null;

		/**
         * A copy of the context
         *
         * @default 0
         * @property contextItem
         * @type {String}
         * @public
         */
		this.contextItem = null;

		this.init();
	};

	/**
     * Initializes the UI Component View
     * Runs createChildren, initData, cloneDiv, dragAndDrop, setupHandlers, enable and counter
     *
     * @method init
     * @public
     * @chainable
     */
	Assessment.prototype.init = function (){
		this.createChildren()
			.initData()		
			.cloneDiv(this.divClone)
            .randomize(this.$list1)
			.dragAndDrop()
			.setupHandlers()
			.enable()
			.counter();

		return this;
	};
	
	/**
     * Binds the scope of any handler functions
     * Should only be run on initialization of the view
     *
     * @method setupHandlers
     * @public
     * @chainable
     */
	Assessment.prototype.setupHandlers = function() {
        this.handleCheckIt = $.proxy(this.handleCheckClick, this);
        this.handleTryIt = $.proxy(this.handleTryClick, this);
        this.handleResetIt = $.proxy(this.handleResetClick, this);    

        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * Should only be run on initialization of the view
     *
     * @method createChildren
     * @public
     * @chainable
     */
	Assessment.prototype.createChildren = function () {
		this.$list1 = $(SELECTORS.SORTABLE_LIST1);
		this.$list2 = $(SELECTORS.SORTABLE_LIST2);
		
		this.sortable1Item = SELECTORS.SORTABLE_LIST1 + " li";

		this.$sortable1Item = $(this.sortable1Item);
		
		this.sortable2Item = SELECTORS.SORTABLE_LIST2 + " li";
		
		this.$sortable2Item = $(this.sortable2Item);

		this.$dialog = $(SELECTORS.DIALOG);
		
		this.$checkIt = $(SELECTORS.CHECKIT_BTN);
		this.$tryIt = $(SELECTORS.TRYIT_BTN);
		this.$resetIt = $(SELECTORS.RESETIT_BTN);

		this.$tries = $(SELECTORS.TRY_COUNTER);
		this.numberOfItems = this.$list1.children().length;
		
		this.correctCards = 0;

		this.divClone = this.$list1.parent();

		return this;
	};
 	
    /**
     * Enables the component
     * Performs any event binding to handlers
     *
     * @method enable
     * @public
     * @chainable
     */
    Assessment.prototype.enable = function() {
        if (this.isEnabled) {
            return this;
        }

        this.$checkIt.on('click', this.handleCheckIt);
        this.$tryIt.on('click', this.handleTryIt);
        this.$resetIt.on('click', this.handleResetIt);

        return this;
    };

     /**
     * Disables the component
     * Tears down any event binding to handlers
     *
     * @method disable
     * @public
     * @chainable
     */
    Assessment.prototype.disable = function() {
        if (this.isEnabled) {
            return this;
        }

        this.$checkIt.off('click', this.handleCheckIt);
        this.$tryIt.off('click', this.handleTryIt);
        this.$resetIt.off('click', this.handleResetIt);

        return this;
    };


 	/**
     * Allows to drag and drop the items
     *
     * @method enable
     * @public
     * @chainable
     */
	Assessment.prototype.dragAndDrop = function (){
		
		this.$sortable1Item.draggable({
			containment: 'section',
	     	stack: this.sortable1Item,
	     	cursor: 'move'
		});
	 	
	 	this.$sortable2Item.droppable({
	     	accept: this.sortable1Item,
      		hoverClass: 'hovered',
      		drop: handleCardDrop
		});

	 	var context = this;
	 		 	
	 	function handleCardDrop( event, ui ) {
			var slotNumber = $(this).attr('id');
		  	var cardNumber = ui.draggable.attr( 'id');
		  	console.log('card number: '+ cardNumber + ' slotNumber: ' + slotNumber);
		  	
            ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } ); //snaps into place
		 				
            
            if ( slotNumber === cardNumber ) {
                $(this).droppable( 'disable' );
				ui.draggable.data('correct', 'true');				
			    context.correctCards++;
			    console.log(context.correctCards);		 		
			}

			if ( context.correctCards == 10 ) {
                context.correct();
                context.$dialog.dialog({
                    modal: true,
                    closeOnEscape: false,
                    open: function(event, ui) { 
                        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide() 
                    }
                });
                
			}	
		};
		
		return this;
	};

    /**
     * Randomizes the items on the first list
     *
     * @method randomize
     * @public
     * @chainable
     */
	Assessment.prototype.randomize = function ($parent){

   		$.each($parent.get(), function(index, el) {
		    var $el = $(el);
		    var $find = $el.children();
	        $find.sort(function() {
	            return 0.5 - Math.random();
	   		});

	   	$el.empty();
	   	$find.appendTo($el);
		});

		return this;
	};
		
	 /**
     * Identifies the items in the lists
     *
     * @method enable
     * @public
     * @chainable
     */
	Assessment.prototype.initData = function (){
		
		var context1 = this.sortable1Item;
		var context2 = this.sortable2Item;

		this.$sortable1Item.each(function (i) {
			$(context1 + ':eq(' + i + ')').attr('id', i);
			
			$(context1 + ':eq(' + i + ')').data('correct', 'false');
			console.log($(context1 + ':eq(' + i + ')').data('item'));
		});
		this.$sortable2Item.each(function (i) {
			$(context2 + ':eq(' + i + ')').attr('id', i);
			
		}); 

		
		return this;
	};

	 /**
     * Clones the original div
     *
     * @method enable
     * @public
     * @chainable
     */
	Assessment.prototype.cloneDiv = function ($div){
		this.divClone = $div.clone();
		
		return this;
	};

	/**
     * Pastes the original div
     *
     * @method enable
     * @public
     * @chainable
     */
	Assessment.prototype.pasteDiv = function (){
		
		this.$list1.parent().replaceWith(this.divClone);

		return this;
	};

	/**
     * Updates the counter of tries
     *
     * @method enable
     * @public
     * @chainable
     */
	Assessment.prototype.counter = function (){
		this.$tries.text(this.totalTries);		
		return this;
	};

    Assessment.prototype.correct = function (){
        var context = this.sortable1Item;

        this.$list1.children('li').each(function (i){
            if($(context + ':eq(' + i + ')').data('correct') === 'true'){               
                $(context + ':eq(' + i + ')').addClass( 'is-correct' ); // add class to show correct
                $(context + ':eq(' + i + ')').removeClass('is-notCorrect'); // remove class to show incorrect               
                $(context + ':eq(' + i + ')').draggable('disable'); // dissable the correct items 
            }else{
                $(context + ':eq(' + i + ')').addClass('is-notCorrect'); // add class to show incorrect
            }
        });

        return this;
    };

	//////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////

    /**
     * Checks the items, to show wich ones are corrects and wich are not
     * @method handleCheckClick
     * @public
     * @param {Object} event The event object
     */
    Assessment.prototype.handleCheckClick = function (e){
    	

    	this.correct();    	

		this.totalTries++;
		this.counter();	   
    };

    /**
     * Repositions the items and adds 1 to the try counter
     * @method handleTryClick
     * @public
     * @param {Object} event The event object
     */
	Assessment.prototype.handleTryClick = function (e){		 
		this.totalTries++;
		this.pasteDiv();	
		this.init();		
	};

	/**
     * Resets the app
     * @method handleResetClick
     * @public
     * @param {Object} event The event object
     */
	Assessment.prototype.handleResetClick = function (e){		 
		this.$dialog.dialog('close');
		this.totalTries = 0;
		this.pasteDiv();	
		this.init();		
	};

	return new Assessment;
});