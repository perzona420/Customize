/**
 * @file   modules/board/js/board.js
 * @author NHN (developers@xpressengine.com)
 * @brief  board 모듈의 javascript
 **/

/* complete tp insert document */
function completeDocumentInserted(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var category_srl = ret_obj.category_srl;

	if (ret_obj.redirect_url) {
		location.href = ret_obj.redirect_url;
	} else {
		var url;
		if(!document_srl)
		{
			url = current_url.setQuery('mid',mid).setQuery('act','');
		}
		else
		{
			url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
		}
		if(category_srl) url = url.setQuery('category',category_srl);
		location.href = url;
	}
}

/* delete the document */
function completeDeleteDocument(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var page = ret_obj.page;

	var url = current_url.setQuery('mid',mid).setQuery('act','').setQuery('document_srl','');
	if(page) url = url.setQuery('page',page);
	location.href = url;
}

/* document search */
function completeSearch(ret_obj, response_tags, params, fo_obj)
{
	fo_obj.submit();
}

function completeVote(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	alert(message);
	location.href = location.href;
}

// current page reload
function completeReload(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;

	location.href = location.href;
}

/* complete to insert comment*/
function completeInsertComment(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var comment_srl = ret_obj.comment_srl;
	if (ret_obj.redirect_url) {
		if (ret_obj.redirect_url.indexOf(window.location.href.replace(/#.+$/, "") + "#") === 0)
		{
			window.location = ret_obj.redirect_url;
			window.location.reload();
		}
		else
		{
			window.location = ret_obj.redirect_url;
		}
	} else {
		var url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
		if (comment_srl) url = url.setQuery('rnd',comment_srl)+"#comment_"+comment_srl;
		window.location.href = url;
	}
}

/* delete the comment */
function completeDeleteComment(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var page = ret_obj.page;

	if (ret_obj.redirect_url) {
		if (ret_obj.redirect_url.indexOf(window.location.href.replace(/#.+$/, "") + "#") === 0)
		{
			window.location = ret_obj.redirect_url;
			window.location.reload();
		}
		else
		{
			window.location = ret_obj.redirect_url;
		}
	} else {
		var url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
		if (page) url = url.setQuery('page',page);
		window.location.href = url;
	}
}

/* delete the trackback */
function completeDeleteTrackback(ret_obj)
{
	var error = ret_obj.error;
	var message = ret_obj.message;
	var mid = ret_obj.mid;
	var document_srl = ret_obj.document_srl;
	var page = ret_obj.page;

	if (ret_obj.redirect_url) {
		if (ret_obj.redirect_url.indexOf(window.location.href.replace(/#.+$/, "") + "#") === 0)
		{
			window.location = ret_obj.redirect_url;
			window.location.reload();
		}
		else
		{
			window.location = ret_obj.redirect_url;
		}
	} else {
		var url = current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
		if (page) url = url.setQuery('page',page);
		window.location.href = url;
	}
}

/* change category */
function doChangeCategory()
{
	var category_srl = jQuery('#board_category option:selected').val();
	location.href = decodeURI(current_url).setQuery('category',category_srl).setQuery('page', '');
}

/* scrap */
function doScrap(document_srl)
{
	var params = [];
	params.document_srl = document_srl;
	jQuery.exec_json('member.procMemberScrapDocument', params);
}

jQuery(function($){
	$(document.body).click(function(e){
		var t = $(e.target), act, params = {};

		if(t.parents('.layer_voted_member').length === 0 && !t.is('.layer_voted_member')){
			$('.layer_voted_member').hide().remove();
		}

		if(!t.is('a[class^=voted_member_]')) return;

		var srl = parseInt(t.attr('class').replace(/[^0-9]/g,''));
		if(!srl) return;

		if(t.hasClass('comment')){
			act = 'comment.getCommentVotedMemberList';
			params =
			{'comment_srl':srl,'point':(t.hasClass('votedup')?1:-1)};
		}else{
			act = 'document.getDocumentVotedMemberList';
			params =
			{'document_srl':srl,'point':(t.hasClass('votedup')?1:-1)};
		}

		$.exec_json(act, params, function(data){
			var l = data.voted_member_list;
			var ul = [];

			if(!l || l.length === 0) return;

			$.each(l,function(){
				ul.push(this.nick_name);
			});

			t.after($('<ul>')
				.addClass('layer_voted_member')
				.css({'position':'absolute','top':e.pageY+5,'left':e.pageX})
				.append('<li>'+ul.join('</li><li>')+'</li>')
			);
		});
	});
});
