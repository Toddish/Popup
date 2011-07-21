<?php
if ($_POST) { 
	// Validate form fields
	$errors = array();
	
	if (empty($_POST['email'])) {
		$errors['form_email'] = "Please enter an email address.";
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
			'feedback'		=> "<p class=\"success\">Thank you for joining the mailing list.</p>"
		);
	}

	echo json_encode($data);
}

?>