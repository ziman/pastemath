<?
Header('Content-Type: text/json');

include('db.php');
$mongo = new Mongo($url);
$db = $mongo->pastemath;
$posts = $db->posts;

$result = Array('error' => false);

if (isset($_POST['action']))
{
	$action = $_POST['action'];

	if ($action == 'save')
	{
		$post = Array(
			'nick' => stripslashes($_POST['nick']),
			'title' => stripslashes($_POST['title']),
			'content' => stripslashes($_POST['content']),
			'ip' => $_SERVER['REMOTE_ADDR'],
			'timestamp' => time()
		);
		$posts->insert($post);
		$err = $db->lastError();
		if ($err['ok'])
		{
			$result['id'] = $post['_id']->{'$id'};
		}
		else
		{
			$result['error'] = 'Could not insert: ' . $err['err'];
		}
	}
	else if ($action == 'get')
	{
		$post = $posts->findOne(Array('_id' => new MongoId($_POST['id'])));
		if ($post)
		{
			$result['item'] = $post;
		}
		else
		{
			$result['error'] = 'Post not found';
		}
	}
	/*
	else if ($action == 'list')
	{
		$result['posts'] = Array();
		$rows = $posts->find();
		foreach ($rows as $row)
		{
			$row['id'] = $row['_id']->{'$id'};
			$result['posts'][] = $row;
		}
	}
	 */
	else
	{
		$result['error'] = 'Unknown action: ' . $action;
	}
}
else
{
	$result['error'] = 'Action not defined.';
}


echo json_encode($result) . "\n";

?>
