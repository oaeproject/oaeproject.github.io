$(document).on('ready', function() {

    $('form').on('submit', function() {
        // Clear validation
        $('.form-group').removeClass('has-error');

        var data = {};
        var isValid = true;
        var names = ['organisation', 'website', 'name', 'email', 'position', 'participation', 'questions'];
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            data[name] = $('.form-group [name="' + name + '"]').val();
            if (!data[name]) {
                $('.form-group [name="' + name + '"]').parent().addClass('has-error');
                isValid = false;
            }
        }

        if (isValid) {
            var message = [
                'Organisation: ' + data['organisation'],
                'Website: ' + data['website'],
                'Name: ' + data['name'],
                'Email: ' + data['email'],
                'Position: ' + data['position'],
                'Participation: ' + data['participation'],
                'Questions/message:',
                data['questions']
            ].join('\n');
            $.ajax({
                'url': 'http://formspree.io/oae-contact@apereo.org',
                'method': 'POST',
                'data': {
                    'name': data['name'],
                    'email': data['email'],
                    'message': message,
                    '_subject': 'apereo.org join form submission from ' + data['name']
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
