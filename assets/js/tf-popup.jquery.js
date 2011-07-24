/*
 * TF Popup
 * v0.9.0
 
Copyright (C) 2011  Todd Francis

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

*/
;
(function($) {

	$.TFPopup = function(element, options) 
	{
		 var defaults = {
			modal						: false,
			popupWidth					: null,
			popupHeight					: null,
			backgroundOpacity			: 0.7,
			loader						: {
				content					: '',
				ID						: 'tf_loader'
			},
			content						: '',
			callback					: {
				onOpen		: null,
				onClose		: null,
				onError		: null,
				onSuccess	: null,
				onSubmit	: null
			},
			closeButton					: {
				content		: 'Close',
				hidden		: false,
				ID			: 'tf_close_button'
			},
			hideFlash		: false,
			useMarkup		: false,
			markup			: {
				top				: '<div class="popup">',
				bottom			: '</div>',
				inputRowClass	: 'form_row',
				invalidRowClass	: 'invalid_row',
				errorClass		: 'error',
				popupID			: 'tf_popup_cont',
				backgroundID	: 'tf_popup_background'
			},
			ajaxContent			: true,
			ajaxSubmit			: true
		};

		var plugin = this;
		
		plugin.version = '0.9.0';

		plugin.settings = {}

		var $backgroundDiv, $popupCont, $loader, $closeButton;

		plugin.init = function() {

			plugin.settings = $.extend(true, {}, defaults, options);

		}
		
		plugin.open = function() {
			// Create Items
			$backgroundDiv = $('<div id="' + plugin.settings.markup.backgroundID + '" />')
			.appendTo($(document.body))
			.css({
				"opacity" : plugin.settings.backgroundOpacity
			});
			$popupCont = $('<div id="' + plugin.settings.markup.popupID + '" />')
			.appendTo($(document.body));

			//Background click to close
			$backgroundDiv.click(function(e)
			{
				e.preventDefault();
				if (!plugin.settings.modal)
					plugin.close();
			});
			
			$(window).resize(function() 
			{
				plugin.center();
			});
			
			// Hide the flash 
			(plugin.settings.hideFlash) ? $('object, embed').css('visibility', "hidden") : null;
			$backgroundDiv.fadeIn("fast");
			$popupCont.css({
				"display"	: "block",
				"opacity"	: 0
			}).animate({
				opacity		: 1
			}, "fast");
			
			// Load in the loader
			$loader = $('<div id="' + plugin.settings.loader.ID + '">' + plugin.settings.loader.content + '</div>');
			$popupCont.html($loader);
			plugin.center();
			if (plugin.settings.content)
			{
				plugin.loadContent(plugin.settings.content);
			}
			else
			{
				debug('No content to load');
				plugin.close();
			}
		}
		
		plugin.close = function() {
			(plugin.settings.hideFlash) ? $('object, embed').css('visibility', "visible") : null;
			$backgroundDiv.fadeOut("fast", function() {
				$backgroundDiv.remove();
				$popupCont.remove();
				
				(plugin.settings.callback.onClose) ? plugin.settings.callback.onClose(plugin) : null;
			});
			$popupCont.fadeOut("fast");
			if ($closeButton && $closeButton.length > 0)
			{
				$closeButton.fadeOut("fast", function() {
					$closeButton.remove();
				});
			}
		}
		
		plugin.center = function() {
			var popupWidth = plugin.settings.popupWidth ? parseInt(plugin.settings.popupWidth, 10) : $popupCont.children().outerWidth();
			var popupHeight = plugin.settings.popupHeight ? parseInt(plugin.settings.popupHeight, 10) : $popupCont.children().outerHeight();
			var windowWidth = document.documentElement.clientWidth;
			var windowHeight = document.documentElement.clientHeight;
        
			$popupCont.css({
				"top"		: windowHeight * 0.5 - popupHeight * 0.5,
				"left"		: windowWidth * 0.5 - popupWidth * 0.5
			});
			// Only need force for IE6
			$backgroundDiv.css({
				"height": windowHeight
			});
		}
		
		plugin.loadContent = function(content, overrideAjax) 
		{
			if (plugin.settings.ajaxContent && overrideAjax !== true)
			{
				$popupCont.load(content, function(data)
				{
					renderMarkup();
					plugin.center();
					(plugin.settings.callback.onOpen) ? plugin.settings.callback.onOpen(plugin) : null;
					formCheck();
				});
			}
			else
			{
				var finalContent;
				if (typeof content == "function") 
				{
					finalContent = content(plugin);
				}
				else
				{
					finalContent = content;
				}
				
				if (typeof finalContent == "string")
				{
					$popupCont.html(finalContent);
				}
				else if (typeof finalContent == "object")
				{
					$popupCont.html(finalContent.html());
				}
				else
				{
					debug('Could not parse content of type ' + (typeof finalContent));
				}
				renderMarkup();
				plugin.center();
				formCheck();
				(plugin.settings.callback.onOpen) ? plugin.settings.callback.onOpen(plugin) : null;
			}
		}
		
		var renderMarkup = function()
		{
			if (plugin.settings.useMarkup)
			{
				var wrap = plugin.settings.markup.top + plugin.settings.markup.bottom;
				$popupCont.wrapInner(wrap);
			}
			$closeButton = $('<a id="' + plugin.settings.closeButton.ID + '" href="#">' + plugin.settings.closeButton.content + '</a>');
			if (!plugin.settings.closeButton.hidden)
				$closeButton.appendTo($popupCont);

			// Close button click
			$closeButton.click(function()
			{
				plugin.close();
				return false;
			});
			
			$closeButton.fadeIn("fast");
		}
		
		var handleCallback = function (func, formID)
		{
			if (plugin.settings.callback[func]) {
				if (plugin.settings.callback[func][formID]) {
					 return plugin.settings.callback[func][formID](plugin);
				} else {
					 return plugin.settings.callback[func](plugin);
				}
			}
		}
		
		var formCheck = function()
		{
			var $forms = $popupCont.find("form");
			$forms.each(function(index, ele) {
				$(ele).submit(function(e) {
					var $form = $(this);
					if (handleCallback('onSubmit', $form.attr('id')) !== false)
					{
						if (plugin.settings.ajaxSubmit)
						{
							e.preventDefault();
							var validationURL = $form.attr('action');
							if (validationURL)
							{
								$.post(validationURL, $form.serialize(), function(response){
									// Remove any errors
									$form.find("." + plugin.settings.markup.inputRowClass).removeClass(plugin.settings.markup.invalidRowClass);
									$form.find("." +  plugin.settings.markup.errorClass).remove();
									$loader.remove();

									if(response.status == "error") 
									{
										if (response.errors)
										{
											$.each(response.errors, function(){
												$form.find('#' + this).parents("." + plugin.settings.markup.inputRowClass).addClass(plugin.settings.markup.invalidRowClass);
											});
										}

										$form.prepend(response.feedback);
										handleCallback('onError', $form.attr('id'));
									}
									else
									{
										handleCallback('onSuccess', $form.attr('id'));
										if (response.feedback)
											$form.before(response.feedback).remove();
									}
									plugin.center();

								}, "json");
							}
							else
							{
								debug("No validation URL supplied");
							}
						}
						else
						{
							handleCallback('onSuccess', $form.attr('id'));
						}
					}
					else
					{
						e.preventDefault();
						handleCallback('onError', $form.attr('id'));
					}
				})
			});
		}

		plugin.init();
		// Debug - so IE doesn't have a fit
		var debug = function(value)
		{
			if (window.console && window.console.log)
			{
				console.log(value);
			}
		}

	}

	$.fn.TFPopup = function(options) {

		return this.each(function() {

			if (undefined == $(this).data('TFPopup')) {

				var plugin = new $.TFPopup(this, options);

				$(this).data('TFPopup', plugin);
				plugin.$element = $(this);
				
				$(this).click(function(e) {
					e.preventDefault();
					plugin.open();
				})

			}

		});

	}

})(jQuery);