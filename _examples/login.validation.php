<?php
if ($_POST) { 
	// Validate form fields
	$errors = array();
	
	if (empty($_POST['username'])) {
		$errors['form_username2'] = "Please enter a username.";
	}
    
	if (empty($_POST['password'])) {
		$errors['form_password2'] = "Please enter a password.";
	}
	
	if ($errors) {
		
		$data = array(
			'status'	=> "error",
			'errors'	=> array_keys($errors),
			'feedback'	=> "<p class=\"error\">".current($errors)."</p>"
		);
		
	} else {
		
		$data = array(
			'status' 		=> "success",
			'feedback'		=> "<p class=\"success\">You have logged in, you are being redirected now.</p>"
		);
	}

	echo json_encode($data);
}

?>