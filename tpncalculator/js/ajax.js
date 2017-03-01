$(document).ready(function() {
	$('#tpnform').submit(function(event) {
		event.preventDefault();
		$('.form-group').removeClass('has-error');
		$('.help-block').remove();
		$('.alert-success').remove();
		
		var formData = {
			'weight': $('input[name=weight]').val(),
			'dextrose': $('input[name=dextrose]').val(),
			'na': $('input[name=na]').val(),
			'k': $('input[name=k]').val(),
			'acetate': $('input[name=acetate]').val(),
			'infusion': $('input[name=infusion]').val(),
			'first': $('input[name=first]').val(),
			'middle': $('input[name=middle]').val(),
			'last': $('input[name=last]').val(),
			'access': $('input[name=access]:checked', '#tpnform').val(),
		}

		$.ajaxSetup({
		    type		: 'POST',
		    headers		: { "cache-control": "no-cache" }
		});



		$.ajax({
			type		: 'POST',
			url			: 'calc.php',
			data		: formData,
			dataType	: 'json',
			encode		: true,
		})
		.done(function(data) {
				console.log(data)

				if ( ! data.success ) {


					if (data.errors.weight) {
						$('#weight-group').addClass('has-error');
						$('#weight-group').append('<div class="help-block">' + data.errors.weight + '</div');
					}

					if (data.errors.dextrose) {
						$('#dextrose-group').addClass('has-error');
						$('#dextrose-group').append('<div class="help-block">' + data.errors.dextrose + '</div');
					}

					if (data.errors.na) {
						$('#na-group').addClass('has-error');
						$('#na-group').append('<div class="help-block">' + data.errors.na + '</div');
					}

					if (data.errors.k) {
						$('#k-group').addClass('has-error');
						$('#k-group').append('<div class="help-block">' + data.errors.k + '</div');
					}

					if (data.errors.acetate) {
						$('#acetate-group').addClass('has-error');
						$('#acetate-group').append('<div class="help-block">' + data.errors.acetate + '</div');
					}

					if (data.errors.infusion) {
						$('#infusion-group').addClass('has-error');
						$('#infusion-group').append('<div class="help-block">' + data.errors.infusion + '</div');
					}

					if (data.errors.first) {
						$('#first-group').addClass('has-error');
						$('#first-group').append('<div class="help-block">' + data.errors.first + '</div');
					}

					if (data.errors.middle) {
						$('#middle-group').addClass('has-error');
						$('#middle-group').append('<div class="help-block">' + data.errors.middle + '</div');
					}

					if (data.errors.last) {
						$('#last-group').addClass('has-error');
						$('#last-group').append('<div class="help-block">' + data.errors.last + '</div');
					}

					if (data.errors.access) {
						$('#access-group').addClass('has-error');
						$('#access-group').append('<div class="help-block">' + data.errors.access + '</div');
					}

				} else {

					$('#submitbutton').before('<div class="alert alert-success col-md-12" id="#answer">' + data.answer + '</div');

				}

				console.log('Success');
				$('body').scrollTo('#answer');
			})
		
		.fail(function(data) {
			console.log(data);
		});
		

	});


});