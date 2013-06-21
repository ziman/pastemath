function update()
{
	var src = $('#edit').val();

	// HTML escaping
	src = src.replace(/&/g, '&amp;');
	src = src.replace(/</g, '&lt;');
	src = src.replace(/>/g, '&gt;');

	// Formatting
	src = src.replace(/\\emph{([^}]+)}/g, '<em>$1</em>');
	src = src.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
	src = src.replace(/\n\n/g, '</p><p>');
	src = src.replace(/\\newline/g, '<br/>');

	$('#ptitle').text($('#title').val());
	$('#pauthor').text($('#nick').val());
	$('#gauthor').text($('#nick').val());

	$('#pbody').html('<p>' + src + '</p>');	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"pbody"]);
}

function loadPost(id)
{
	$('#edit').val('Could not load the required post.');
	update();

	$.post('api.php', {'action':'get','id':id}, function(data)
	{
		if (data.error)
		{
			$('#edit').val('Could not load post: ' + data.error);
		}
		else
		{
			$('#edit').val(data.item.content);
			$('#nick').val(data.item.nick);
			$('#title').val(data.item.title);
			$('#editor').hide();
			$('#expander').show();
		}

		update();
	});
}

function hashChanged()
{
	var hash = window.location.hash;
	if (hash)
	{
		loadPost(hash.substr(1));
	}
	else
	{
		update();
	}
}

function save()
{
	if ($('#nick').val() == '')
	{
		alert('Please fill in your name.');
		return false;
	}

	if ($('#title').val() == '')
	{
		alert('Please fill in the title of the post.');
		return false;
	}

	$.post('api.php', {
		'action':  'save',
		'nick':    $('#nick').val(),
		'title':   $('#title').val(),
		'content': $('#edit').val()
	}, function(data)
	{
		if (data.error)
		{
			alert('Could not save: ' + data.error);
		}
		else
		{
			$(window).hashchange(null);
			window.location.hash = '#' + data.id;
			$(window).hashchange(hashChanged);
			$('#editor').hide();
			$('#expander').show();
		}
	});
}

function expand()
{
	$('#expander').hide();
	$('#editor').show();
	return false;
}

function init()
{
	$('#nojs').hide();
	hashChanged();

	$('#update').click(update);
	$('#saveButton').click(save);
	$('#expand').click(expand);
	$(window).hashchange(hashChanged);
}

$(init);
