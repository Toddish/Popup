<?php
if ($_POST) { 
	// Validate form fields
	$errors = array();
	
	
	if (empty($_POST['email'])) {
		$errors['form_email'] = "Please enter an email address.";
	}
	
	if (empty($_POST['username'])) {
		$errors['form_username'] = "Please enter a username.";
	}
    
	if (empty($_POST['password'])) {
		$errors['form_password'] = "Please enter a password.";
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
			'feedback'		=> "<p class=\"success\">Thank you for registering, you are being redirected now.</p>"
		);
	}

	echo json_encode($data);
}

?>