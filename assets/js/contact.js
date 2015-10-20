$(document).on('ready', function() {

    $('form').on('submit', function() {
        // Clear validation
        $('.form-group').removeClass('has-error');

        var name = $('input[name="name"]').val();
        var email = $('input[name="email"]').val();
        var message = $('textarea').val();

        var isValid = true;

        if (!name) {
            $('input[name="name"]').parent().addClass('has-error');
            isValid = false;
        }
        if (!email) {
            $('input[name="email"]').parent().addClass('has-error');
            isValid = false;
        }
        if (!message) {
            $('textarea').parent().addClass('has-error');
            isValid = false;
        }

        if (isValid) {
            $.ajax({
                'url': 'http://formspree.io/oae-contact@apereo.org',
                'method': 'POST',
                'data': {
                    'name': name,
                    'email': email,
                    'message': message,
                    '_subject': 'apereo.org contact form submission from ' + name
                },
                'dataType': 'json',
                success: function(data) {
                    alert('We have received your message and will be in touch shortly!');
                },
                error: function(err) {
                    alert('Oh no, we couldn\'t send your message, you can always try sending an email to oae-contact@apereo.org');
                }
            });
        }

        return false;
    });
});
