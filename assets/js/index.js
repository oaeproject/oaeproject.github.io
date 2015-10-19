(function() {

    $.templates('signup-as-tenant', [
      '<div class="signup-tenant-item">',
          '<div class="signup-tenant-item-inner">',
              '{{if tenant.countryFlag}}',
                  '<div class="signup-tenant-flag">',
                      '<img src="{{>tenant.countryFlag}}" alt="{{>tenant.countryName}}"/>',
                  '</div>',
              '{{/if}}',
              '<div class="signup-tenant-name">',
                  '{{:tenant.displayName}}',
              '</div>',
          '</div>',
      '</div>'].join('\n'));

    $.templates('signup-as-actions', [
      '<li id="signup-as-selection" tabindex="0"></li>',
      '<li id="signup-as-search" class="signup-as-action">',
          '<i class="fa fa-search"></i>',
      '</li>',
      '<li id="signup-as-go" class="signup-as-action">',
          '<button class="btn btn-primary">Go</button>',
      '</li>'].join('\n'));

    $.templates('signup-as-selection', [
      '{{if tenant.countryFlag}}',
          '<img src="{{>tenant.countryFlag}}" alt="{{>tenant.countryName}}"/>',
      '{{/if}}',
      '<div class="oae-threedots">{{>tenant.displayName}}</div>'].join('\n'));


    var setupAutoSuggest = function() {

        $('#institution-search-field').autoSuggest('https://network.unity.ac/api/search/tenants', {
            'retrieveLimit': 12,
            'neverSubmit': true,
            'scroll': 220,
            'searchObjProps': 'alias,displayName,host,emailDomain',
            'startText': 'Search and select your university',
            'retrieveComplete': function(data) {
                return data.results;
            },
            'resultsHighlight': false,
            'formatList': function(data, $el) {
                var html = $.templates['signup-as-tenant'].render({
                    'tenant': withCountryInfo(data)
                });
                $el.html(html)
                return $el;
            },
            'selectionAdded': function(el) {
                var $elem = $(el);

                // Wrap the element text in a 'oae-threedots' span element to prevent overflowing
                $elem.contents().filter(function() {
                    return this.nodeType === 3;
                }).wrapAll('<span class="pull-left oae-threedots" />');

                var originalData = $elem.data('originalData');
                if (originalData.resourceType) {
                    // Prepend a thumbnail to the item to add to the list
                    var $thumbnail = $('<div>').addClass('oae-thumbnail fa fa-oae-' + originalData.resourceType);
                    if (originalData.thumbnailUrl) {
                        $thumbnail.append($('<div>')
                            .css('background-image', 'url("' + originalData.thumbnailUrl + '")')
                            .attr('role', 'img')
                            .attr('aria-label', security().encodeForHTMLAttribute(originalData.displayName))
                        );
                    }
                    $elem.prepend($thumbnail);
                }


                // When a selection is added by choosing a tenant, we don't add
                // an item to the auto-suggest selection, instead we redirect
                // to the equivalent page on that tenant
                var tenant = $(el).data().originalData;
                var $selections = $('ul.as-selections');
                var $selection = $('#signup-as-selection');

                // Render the tenant template into the selected item
                var html = $.templates['signup-as-selection'].render({
                    'tenant': withCountryInfo(tenant)
                });
                $selection.html(html)

                // Put the tenant data on the selection item
                $selection.data('tenant', tenant);

                // Remove the element value since we would want it to be able to
                // appear in the results again, and add the previous back into
                // the field
                $('ul.as-selections .as-values').val('');
                $('ul.as-selections .as-input').val(tenant.query);

                // Toggle the template into selected mode and disable the signup
                // options
                $selections.addClass('institution-search-selected');
                toggleSignupOptions(false);

                $('#signup-as-go > button').focus();
            }
        });

        // Add the action items to the autosuggest field
        var actionItems = $.templates['signup-as-actions'].render();
        $('ul.as-selections').append(actionItems);

        // Add keyboard bindings to cancel the selection and re-reveals the
        // signup options
        $('#signup-as-selection').on('click', cancelInstitutionSelect);
        $('#signup-as-go > button').keydown(function(evt) {
            // Cancel selection if the user hits escape, delete or backspace
            // on the "Go" button
            var isDeleteKey = (evt.keyCode === 46);
            var isEscapeKey = (evt.keyCode === 27);
            var isBackspaceKey = (evt.keyCode === 8);
            if (isEscapeKey || isBackspaceKey || isDeleteKey) {
                return cancelInstitutionSelect();
            }
        });

        // When the "Go" button is pressed, go to the equivalent page of the
        // selected tenant
        $('#signup-as-go > button').click(function() {
            window.location = 'https://' + $('#signup-as-selection').data().tenant.host;
        });

        // Show the container now that everything is initialized
        $('#signup-institution-container').show();
    };

    setupAutoSuggest();


    /**
     * Cancel the currently selected institution in the auto-suggest control
     */
    var cancelInstitutionSelect = function() {
        console.log('Cancelling stuff');
        $('#institution-search ul.as-selections').removeClass('institution-search-selected');
        $('#institution-search ul.as-selections .as-input').focus();
        toggleSignupOptions(true);
        return false;
    };

    /**
     * Enable or disable the signup options by enabling/disabling the elements
     * and using transparency
     *
     * @param  {Boolean}    enable  Whether to enable or disable the signup options
     */
    var toggleSignupOptions = function(enable) {
        var $signupOptions = $('#signup-options');
        if (enable) {
            $signupOptions.removeClass('signup-options-disabled');
            $signupOptions.find('*').prop('disabled', false);
        } else {
            $signupOptions.addClass('signup-options-disabled');
            $signupOptions.find('*').prop('disabled', true);
        }
    };

    /**
     * Return a tenant that contains the specified tenant values as well as the
     * country info to which the tenant is associated, if known
     *
     * @param  {Tenant}     tenant                  The tenant whose country info to apply
     * @return {Tenant}     tenant                  The tenant object with the country info applied
     * @return {String}     [tenant.countryName]    The name of the country to which the tenant belongs, if known
     * @return {String}     [tenant.countryFlag]    The absolute url path to the flag image associated to the country to which the tenant belongs, if known
     */
    var withCountryInfo = function(tenant) {
        var countryInfo = $.grep(countries, function(country) {
            return (country.code === tenant.countryCode);
        });
        return $.extend({}, tenant, {
            'countryName': (countryInfo && countryInfo[0] && countryInfo[0].name),
            'countryFlag': (countryInfo && countryInfo[0] && countryInfo[0].icon)
        });
    };

    var countries = [
        {'name': 'Afghanistan', 'code': 'AF', 'icon': '/assets/img/flags/AF.png'},
        {'name': 'Åland Islands', 'code': 'AX', 'icon': '/assets/img/flags/AX.png'},
        {'name': 'Albania', 'code': 'AL', 'icon': '/assets/img/flags/AL.png'},
        {'name': 'Algeria', 'code': 'DZ', 'icon': '/assets/img/flags/DZ.png'},
        {'name': 'American Samoa', 'code': 'AS', 'icon': '/assets/img/flags/AS.png'},
        {'name': 'Andorra', 'code': 'AD', 'icon': '/assets/img/flags/AD.png'},
        {'name': 'Angola', 'code': 'AO', 'icon': '/assets/img/flags/AO.png'},
        {'name': 'Anguilla', 'code': 'AI', 'icon': '/assets/img/flags/AI.png'},
        {'name': 'Antarctica', 'code': 'AQ', 'icon': '/assets/img/flags/AQ.png'},
        {'name': 'Antigua and Barbuda', 'code': 'AG', 'icon': '/assets/img/flags/AG.png'},
        {'name': 'Argentina', 'code': 'AR', 'icon': '/assets/img/flags/AR.png'},
        {'name': 'Armenia', 'code': 'AM', 'icon': '/assets/img/flags/AM.png'},
        {'name': 'Aruba', 'code': 'AW', 'icon': '/assets/img/flags/AW.png'},
        {'name': 'Australia', 'code': 'AU', 'icon': '/assets/img/flags/AU.png'},
        {'name': 'Austria', 'code': 'AT', 'icon': '/assets/img/flags/AT.png'},
        {'name': 'Azerbaijan', 'code': 'AZ', 'icon': '/assets/img/flags/AZ.png'},
        {'name': 'Bahamas', 'code': 'BS', 'icon': '/assets/img/flags/BS.png'},
        {'name': 'Bahrain', 'code': 'BH', 'icon': '/assets/img/flags/BH.png'},
        {'name': 'Bangladesh', 'code': 'BD', 'icon': '/assets/img/flags/BD.png'},
        {'name': 'Barbados', 'code': 'BB', 'icon': '/assets/img/flags/BB.png'},
        {'name': 'Belarus', 'code': 'BY', 'icon': '/assets/img/flags/BY.png'},
        {'name': 'Belgium', 'code': 'BE', 'icon': '/assets/img/flags/BE.png'},
        {'name': 'Belize', 'code': 'BZ', 'icon': '/assets/img/flags/BZ.png'},
        {'name': 'Benin', 'code': 'BJ', 'icon': '/assets/img/flags/BJ.png'},
        {'name': 'Bermuda', 'code': 'BM', 'icon': '/assets/img/flags/BM.png'},
        {'name': 'Bhutan', 'code': 'BT', 'icon': '/assets/img/flags/BT.png'},
        {'name': 'Bolivia', 'code': 'BO', 'icon': '/assets/img/flags/BO.png'},
        {'name': 'Bosnia and Herzegovina', 'code': 'BA', 'icon': '/assets/img/flags/BA.png'},
        {'name': 'Botswana', 'code': 'BW', 'icon': '/assets/img/flags/BW.png'},
        {'name': 'Bouvet Island', 'code': 'BV'},
        {'name': 'Brazil', 'code': 'BR', 'icon': '/assets/img/flags/BR.png'},
        {'name': 'British Indian Ocean Territory', 'code': 'IO'},
        {'name': 'Brunei Darussalam', 'code': 'BN', 'icon': '/assets/img/flags/BN.png'},
        {'name': 'Bulgaria', 'code': 'BG', 'icon': '/assets/img/flags/BG.png'},
        {'name': 'Burkina Faso', 'code': 'BF', 'icon': '/assets/img/flags/BF.png'},
        {'name': 'Burundi', 'code': 'BI', 'icon': '/assets/img/flags/BI.png'},
        {'name': 'Cambodia', 'code': 'KH', 'icon': '/assets/img/flags/KH.png'},
        {'name': 'Cameroon', 'code': 'CM', 'icon': '/assets/img/flags/CM.png'},
        {'name': 'Canada', 'code': 'CA', 'icon': '/assets/img/flags/CA.png'},
        {'name': 'Cape Verde', 'code': 'CV', 'icon': '/assets/img/flags/CV.png'},
        {'name': 'Cayman Islands', 'code': 'KY', 'icon': '/assets/img/flags/KY.png'},
        {'name': 'Central African Republic', 'code': 'CF', 'icon': '/assets/img/flags/CF.png'},
        {'name': 'Chad', 'code': 'TD', 'icon': '/assets/img/flags/TD.png'},
        {'name': 'Chile', 'code': 'CL', 'icon': '/assets/img/flags/CL.png'},
        {'name': 'China', 'code': 'CN', 'icon': '/assets/img/flags/CN.png'},
        {'name': 'Christmas Island', 'code': 'CX', 'icon': '/assets/img/flags/CX.png'},
        {'name': 'Cocos (Keeling) Islands', 'code': 'CC', 'icon': '/assets/img/flags/CC.png'},
        {'name': 'Colombia', 'code': 'CO', 'icon': '/assets/img/flags/CO.png'},
        {'name': 'Comoros', 'code': 'KM', 'icon': '/assets/img/flags/KM.png'},
        {'name': 'Congo', 'code': 'CG', 'icon': '/assets/img/flags/CG.png'},
        {'name': 'Congo (Democratic Republic of the)', 'code': 'CD', 'icon': '/assets/img/flags/CD.png'},
        {'name': 'Cook Islands', 'code': 'CK', 'icon': '/assets/img/flags/CK.png'},
        {'name': 'Costa Rica', 'code': 'CR', 'icon': '/assets/img/flags/CR.png'},
        {'name': 'Côte d\'Ivoire', 'code': 'CI', 'icon': '/assets/img/flags/CI.png'},
        {'name': 'Croatia', 'code': 'HR', 'icon': '/assets/img/flags/HR.png'},
        {'name': 'Cuba', 'code': 'CU', 'icon': '/assets/img/flags/CU.png'},
        {'name': 'Curaçao', 'code': 'CW', 'icon': '/assets/img/flags/CW.png'},
        {'name': 'Cyprus', 'code': 'CY', 'icon': '/assets/img/flags/CY.png'},
        {'name': 'Czech Republic', 'code': 'CZ', 'icon': '/assets/img/flags/CZ.png'},
        {'name': 'Denmark', 'code': 'DK', 'icon': '/assets/img/flags/DK.png'},
        {'name': 'Djibouti', 'code': 'DJ', 'icon': '/assets/img/flags/DJ.png'},
        {'name': 'Dominica', 'code': 'DM', 'icon': '/assets/img/flags/DM.png'},
        {'name': 'Dominican Republic', 'code': 'DO', 'icon': '/assets/img/flags/DO.png'},
        {'name': 'Ecuador', 'code': 'EC', 'icon': '/assets/img/flags/EC.png'},
        {'name': 'Egypt', 'code': 'EG', 'icon': '/assets/img/flags/EG.png'},
        {'name': 'El Salvador', 'code': 'SV', 'icon': '/assets/img/flags/SV.png'},
        {'name': 'Equatorial Guinea', 'code': 'GQ', 'icon': '/assets/img/flags/GQ.png'},
        {'name': 'Eritrea', 'code': 'ER', 'icon': '/assets/img/flags/ER.png'},
        {'name': 'Estonia', 'code': 'EE', 'icon': '/assets/img/flags/EE.png'},
        {'name': 'Ethiopia', 'code': 'ET', 'icon': '/assets/img/flags/ET.png'},
        {'name': 'Falkland Islands (Malvinas)', 'code': 'FK', 'icon': '/assets/img/flags/FK.png'},
        {'name': 'Faroe Islands', 'code': 'FO', 'icon': '/assets/img/flags/FO.png'},
        {'name': 'Fiji', 'code': 'FJ', 'icon': '/assets/img/flags/FJ.png'},
        {'name': 'Finland', 'code': 'FI', 'icon': '/assets/img/flags/FI.png'},
        {'name': 'France', 'code': 'FR', 'icon': '/assets/img/flags/FR.png'},
        {'name': 'French Guiana', 'code': 'GF'},
        {'name': 'French Polynesia', 'code': 'PF', 'icon': '/assets/img/flags/PF.png'},
        {'name': 'French Southern Territories', 'code': 'TF', 'icon': '/assets/img/flags/TF.png'},
        {'name': 'Gabon', 'code': 'GA', 'icon': '/assets/img/flags/GA.png'},
        {'name': 'Gambia', 'code': 'GM', 'icon': '/assets/img/flags/GM.png'},
        {'name': 'Georgia', 'code': 'GE', 'icon': '/assets/img/flags/GE.png'},
        {'name': 'Germany', 'code': 'DE', 'icon': '/assets/img/flags/DE.png'},
        {'name': 'Ghana', 'code': 'GH', 'icon': '/assets/img/flags/GH.png'},
        {'name': 'Gibraltar', 'code': 'GI', 'icon': '/assets/img/flags/GI.png'},
        {'name': 'Greece', 'code': 'GR', 'icon': '/assets/img/flags/GR.png'},
        {'name': 'Greenland', 'code': 'GL', 'icon': '/assets/img/flags/GL.png'},
        {'name': 'Grenada', 'code': 'GD', 'icon': '/assets/img/flags/GD.png'},
        {'name': 'Guadeloupe', 'code': 'GP'},
        {'name': 'Guam', 'code': 'GU', 'icon': '/assets/img/flags/GU.png'},
        {'name': 'Guatemala', 'code': 'GT', 'icon': '/assets/img/flags/GT.png'},
        {'name': 'Guernsey', 'code': 'GG', 'icon': '/assets/img/flags/GG.png'},
        {'name': 'Guinea', 'code': 'GN', 'icon': '/assets/img/flags/GN.png'},
        {'name': 'Guinea-Bissau', 'code': 'GW', 'icon': '/assets/img/flags/GW.png'},
        {'name': 'Guyana', 'code': 'GY', 'icon': '/assets/img/flags/GY.png'},
        {'name': 'Haiti', 'code': 'HT', 'icon': '/assets/img/flags/HT.png'},
        {'name': 'Heard Island and McDonald Islands', 'code': 'HM'},
        {'name': 'Holy See', 'code': 'VA', 'icon': '/assets/img/flags/VA.png'},
        {'name': 'Honduras', 'code': 'HN', 'icon': '/assets/img/flags/HN.png'},
        {'name': 'Hong Kong', 'code': 'HK', 'icon': '/assets/img/flags/HK.png'},
        {'name': 'Hungary', 'code': 'HU', 'icon': '/assets/img/flags/HU.png'},
        {'name': 'Iceland', 'code': 'IS', 'icon': '/assets/img/flags/IS.png'},
        {'name': 'India', 'code': 'IN', 'icon': '/assets/img/flags/IN.png'},
        {'name': 'Indonesia', 'code': 'ID', 'icon': '/assets/img/flags/ID.png'},
        {'name': 'Iran', 'code': 'IR', 'icon': '/assets/img/flags/IR.png'},
        {'name': 'Iraq', 'code': 'IQ', 'icon': '/assets/img/flags/IQ.png'},
        {'name': 'Ireland', 'code': 'IE', 'icon': '/assets/img/flags/IE.png'},
        {'name': 'Isle of Man', 'code': 'IM', 'icon': '/assets/img/flags/IM.png'},
        {'name': 'Israel', 'code': 'IL', 'icon': '/assets/img/flags/IL.png'},
        {'name': 'Italy', 'code': 'IT', 'icon': '/assets/img/flags/IT.png'},
        {'name': 'Jamaica', 'code': 'JM', 'icon': '/assets/img/flags/JM.png'},
        {'name': 'Japan', 'code': 'JP', 'icon': '/assets/img/flags/JP.png'},
        {'name': 'Jersey', 'code': 'JE', 'icon': '/assets/img/flags/JE.png'},
        {'name': 'Jordan', 'code': 'JO', 'icon': '/assets/img/flags/JO.png'},
        {'name': 'Kazakhstan', 'code': 'KZ', 'icon': '/assets/img/flags/KZ.png'},
        {'name': 'Kenya', 'code': 'KE', 'icon': '/assets/img/flags/KE.png'},
        {'name': 'Kiribati', 'code': 'KI', 'icon': '/assets/img/flags/KI.png'},
        {'name': 'Korea (Democratic People\'s Republic of)', 'code': 'KP', 'icon': '/assets/img/flags/KP.png'},
        {'name': 'Korea (Republic of)', 'code': 'KR', 'icon': '/assets/img/flags/KR.png'},
        {'name': 'Kuwait', 'code': 'KW', 'icon': '/assets/img/flags/KW.png'},
        {'name': 'Kyrgyzstan', 'code': 'KG', 'icon': '/assets/img/flags/KG.png'},
        {'name': 'Laos', 'code': 'LA', 'icon': '/assets/img/flags/LA.png'},
        {'name': 'Latvia', 'code': 'LV', 'icon': '/assets/img/flags/LV.png'},
        {'name': 'Lebanon', 'code': 'LB', 'icon': '/assets/img/flags/LB.png'},
        {'name': 'Lesotho', 'code': 'LS', 'icon': '/assets/img/flags/LS.png'},
        {'name': 'Liberia', 'code': 'LR', 'icon': '/assets/img/flags/LR.png'},
        {'name': 'Libya', 'code': 'LY', 'icon': '/assets/img/flags/LY.png'},
        {'name': 'Liechtenstein', 'code': 'LI', 'icon': '/assets/img/flags/LI.png'},
        {'name': 'Lithuania', 'code': 'LT', 'icon': '/assets/img/flags/LT.png'},
        {'name': 'Luxembourg', 'code': 'LU', 'icon': '/assets/img/flags/LU.png'},
        {'name': 'Macao', 'code': 'MO', 'icon': '/assets/img/flags/MO.png'},
        {'name': 'Macedonia (the former Yugoslav Republic of)', 'code': 'MK', 'icon': '/assets/img/flags/MK.png'},
        {'name': 'Madagascar', 'code': 'MG', 'icon': '/assets/img/flags/MG.png'},
        {'name': 'Malawi', 'code': 'MW', 'icon': '/assets/img/flags/MW.png'},
        {'name': 'Malaysia', 'code': 'MY', 'icon': '/assets/img/flags/MY.png'},
        {'name': 'Maldives', 'code': 'MV', 'icon': '/assets/img/flags/MV.png'},
        {'name': 'Mali', 'code': 'ML', 'icon': '/assets/img/flags/ML.png'},
        {'name': 'Malta', 'code': 'MT', 'icon': '/assets/img/flags/MT.png'},
        {'name': 'Marshall Islands', 'code': 'MH', 'icon': '/assets/img/flags/MH.png'},
        {'name': 'Martinique', 'code': 'MQ', 'icon': '/assets/img/flags/MQ.png'},
        {'name': 'Mauritania', 'code': 'MR', 'icon': '/assets/img/flags/MR.png'},
        {'name': 'Mauritius', 'code': 'MU', 'icon': '/assets/img/flags/MU.png'},
        {'name': 'Mayotte', 'code': 'YT', 'icon': '/assets/img/flags/YT.png'},
        {'name': 'Mexico', 'code': 'MX', 'icon': '/assets/img/flags/MX.png'},
        {'name': 'Micronesia (Federated States of)', 'code': 'FM', 'icon': '/assets/img/flags/FM.png'},
        {'name': 'Moldova', 'code': 'MD', 'icon': '/assets/img/flags/MD.png'},
        {'name': 'Monaco', 'code': 'MC', 'icon': '/assets/img/flags/MC.png'},
        {'name': 'Mongolia', 'code': 'MN', 'icon': '/assets/img/flags/MN.png'},
        {'name': 'Montenegro', 'code': 'ME', 'icon': '/assets/img/flags/ME.png'},
        {'name': 'Montserrat', 'code': 'MS', 'icon': '/assets/img/flags/MS.png'},
        {'name': 'Morocco', 'code': 'MA', 'icon': '/assets/img/flags/MA.png'},
        {'name': 'Mozambique', 'code': 'MZ', 'icon': '/assets/img/flags/MZ.png'},
        {'name': 'Myanmar', 'code': 'MM', 'icon': '/assets/img/flags/MM.png'},
        {'name': 'Namibia', 'code': 'NA', 'icon': '/assets/img/flags/NA.png'},
        {'name': 'Nauru', 'code': 'NR', 'icon': '/assets/img/flags/NR.png'},
        {'name': 'Nepal', 'code': 'NP', 'icon': '/assets/img/flags/NP.png'},
        {'name': 'Netherlands', 'code': 'NL', 'icon': '/assets/img/flags/NL.png'},
        {'name': 'New Caledonia', 'code': 'NC', 'icon': '/assets/img/flags/NC.png'},
        {'name': 'New Zealand', 'code': 'NZ', 'icon': '/assets/img/flags/NZ.png'},
        {'name': 'Nicaragua', 'code': 'NI', 'icon': '/assets/img/flags/NI.png'},
        {'name': 'Niger', 'code': 'NE', 'icon': '/assets/img/flags/NE.png'},
        {'name': 'Nigeria', 'code': 'NG', 'icon': '/assets/img/flags/NG.png'},
        {'name': 'Niue', 'code': 'NU', 'icon': '/assets/img/flags/NU.png'},
        {'name': 'Norfolk Island', 'code': 'NF', 'icon': '/assets/img/flags/NF.png'},
        {'name': 'Northern Mariana Islands', 'code': 'MP', 'icon': '/assets/img/flags/MP.png'},
        {'name': 'Norway', 'code': 'NO', 'icon': '/assets/img/flags/NO.png'},
        {'name': 'Oman', 'code': 'OM', 'icon': '/assets/img/flags/OM.png'},
        {'name': 'Pakistan', 'code': 'PK', 'icon': '/assets/img/flags/PK.png'},
        {'name': 'Palau', 'code': 'PW', 'icon': '/assets/img/flags/PW.png'},
        {'name': 'Palestine', 'code': 'PS', 'icon': '/assets/img/flags/PS.png'},
        {'name': 'Panama', 'code': 'PA', 'icon': '/assets/img/flags/PA.png'},
        {'name': 'Papua New Guinea', 'code': 'PG', 'icon': '/assets/img/flags/PG.png'},
        {'name': 'Paraguay', 'code': 'PY', 'icon': '/assets/img/flags/PY.png'},
        {'name': 'Peru', 'code': 'PE', 'icon': '/assets/img/flags/PE.png'},
        {'name': 'Philippines', 'code': 'PH', 'icon': '/assets/img/flags/PH.png'},
        {'name': 'Pitcairn', 'code': 'PN', 'icon': '/assets/img/flags/PN.png'},
        {'name': 'Poland', 'code': 'PL', 'icon': '/assets/img/flags/PL.png'},
        {'name': 'Portugal', 'code': 'PT', 'icon': '/assets/img/flags/PT.png'},
        {'name': 'Puerto Rico', 'code': 'PR', 'icon': '/assets/img/flags/PR.png'},
        {'name': 'Qatar', 'code': 'QA', 'icon': '/assets/img/flags/QA.png'},
        {'name': 'Réunion', 'code': 'RE'},
        {'name': 'Romania', 'code': 'RO', 'icon': '/assets/img/flags/RO.png'},
        {'name': 'Russia', 'code': 'RU', 'icon': '/assets/img/flags/RU.png'},
        {'name': 'Rwanda', 'code': 'RW', 'icon': '/assets/img/flags/RW.png'},
        {'name': 'Saint Barthélemy', 'code': 'BL', 'icon': '/assets/img/flags/BL.png'},
        {'name': 'Saint Helena, Ascension and Tristan da Cunha', 'code': 'SH', 'icon': '/assets/img/flags/SH.png'},
        {'name': 'Saint Kitts and Nevis', 'code': 'KN', 'icon': '/assets/img/flags/KN.png'},
        {'name': 'Saint Lucia', 'code': 'LC', 'icon': '/assets/img/flags/LC.png'},
        {'name': 'Saint Martin (French part)', 'code': 'MF', 'icon': '/assets/img/flags/MF.png'},
        {'name': 'Saint Pierre and Miquelon', 'code': 'PM'},
        {'name': 'Saint Vincent and the Grenadines', 'code': 'VC', 'icon': '/assets/img/flags/VC.png'},
        {'name': 'Samoa', 'code': 'WS', 'icon': '/assets/img/flags/WS.png'},
        {'name': 'San Marino', 'code': 'SM', 'icon': '/assets/img/flags/SM.png'},
        {'name': 'Sao Tome and Principe', 'code': 'ST', 'icon': '/assets/img/flags/ST.png'},
        {'name': 'Saudi Arabia', 'code': 'SA', 'icon': '/assets/img/flags/SA.png'},
        {'name': 'Senegal', 'code': 'SN', 'icon': '/assets/img/flags/SN.png'},
        {'name': 'Serbia', 'code': 'RS', 'icon': '/assets/img/flags/RS.png'},
        {'name': 'Seychelles', 'code': 'SC', 'icon': '/assets/img/flags/SC.png'},
        {'name': 'Sierra Leone', 'code': 'SL', 'icon': '/assets/img/flags/SL.png'},
        {'name': 'Singapore', 'code': 'SG', 'icon': '/assets/img/flags/SG.png'},
        {'name': 'Sint Maarten (Dutch part)', 'code': 'SX'},
        {'name': 'Slovakia', 'code': 'SK', 'icon': '/assets/img/flags/SK.png'},
        {'name': 'Slovenia', 'code': 'SI', 'icon': '/assets/img/flags/SI.png'},
        {'name': 'Solomon Islands', 'code': 'SB', 'icon': '/assets/img/flags/SB.png'},
        {'name': 'Somalia', 'code': 'SO', 'icon': '/assets/img/flags/SO.png'},
        {'name': 'South Africa', 'code': 'ZA', 'icon': '/assets/img/flags/ZA.png'},
        {'name': 'South Georgia and the South Sandwich Islands', 'code': 'GS', 'icon': '/assets/img/flags/GS.png'},
        {'name': 'South Sudan', 'code': 'SS', 'icon': '/assets/img/flags/SS.png'},
        {'name': 'Spain', 'code': 'ES', 'icon': '/assets/img/flags/ES.png'},
        {'name': 'Sri Lanka', 'code': 'LK', 'icon': '/assets/img/flags/LK.png'},
        {'name': 'Sudan', 'code': 'SD', 'icon': '/assets/img/flags/SD.png'},
        {'name': 'Suriname', 'code': 'SR', 'icon': '/assets/img/flags/SR.png'},
        {'name': 'Svalbard and Jan Mayen', 'code': 'SJ'},
        {'name': 'Swaziland', 'code': 'SZ', 'icon': '/assets/img/flags/SZ.png'},
        {'name': 'Sweden', 'code': 'SE', 'icon': '/assets/img/flags/SE.png'},
        {'name': 'Switzerland', 'code': 'CH', 'icon': '/assets/img/flags/CH.png'},
        {'name': 'Syria', 'code': 'SY', 'icon': '/assets/img/flags/SY.png'},
        {'name': 'Taiwan', 'code': 'TW', 'icon': '/assets/img/flags/TW.png'},
        {'name': 'Tajikistan', 'code': 'TJ', 'icon': '/assets/img/flags/TJ.png'},
        {'name': 'Tanzania', 'code': 'TZ', 'icon': '/assets/img/flags/TZ.png'},
        {'name': 'Thailand', 'code': 'TH', 'icon': '/assets/img/flags/TH.png'},
        {'name': 'Timor-Leste', 'code': 'TL', 'icon': '/assets/img/flags/TL.png'},
        {'name': 'Togo', 'code': 'TG', 'icon': '/assets/img/flags/TG.png'},
        {'name': 'Tokelau', 'code': 'TK', 'icon': '/assets/img/flags/TK.png'},
        {'name': 'Tonga', 'code': 'TO', 'icon': '/assets/img/flags/TO.png'},
        {'name': 'Trinidad and Tobago', 'code': 'TT', 'icon': '/assets/img/flags/TT.png'},
        {'name': 'Tunisia', 'code': 'TN', 'icon': '/assets/img/flags/TN.png'},
        {'name': 'Turkey', 'code': 'TR', 'icon': '/assets/img/flags/TR.png'},
        {'name': 'Turkmenistan', 'code': 'TM', 'icon': '/assets/img/flags/TM.png'},
        {'name': 'Turks and Caicos Islands', 'code': 'TC', 'icon': '/assets/img/flags/TC.png'},
        {'name': 'Tuvalu', 'code': 'TV', 'icon': '/assets/img/flags/TV.png'},
        {'name': 'Uganda', 'code': 'UG', 'icon': '/assets/img/flags/UG.png'},
        {'name': 'Ukraine', 'code': 'UA', 'icon': '/assets/img/flags/UA.png'},
        {'name': 'United Arab Emirates', 'code': 'AE', 'icon': '/assets/img/flags/AE.png'},
        {'name': 'United Kingdom', 'code': 'GB', 'icon': '/assets/img/flags/GB.png'},
        {'name': 'United States', 'code': 'US', 'icon': '/assets/img/flags/US.png'},
        {'name': 'Uruguay', 'code': 'UY', 'icon': '/assets/img/flags/UY.png'},
        {'name': 'Uzbekistan', 'code': 'UZ', 'icon': '/assets/img/flags/UZ.png'},
        {'name': 'Vanuatu', 'code': 'VU', 'icon': '/assets/img/flags/VU.png'},
        {'name': 'Venezuela', 'code': 'VE', 'icon': '/assets/img/flags/VE.png'},
        {'name': 'Viet Nam', 'code': 'VN', 'icon': '/assets/img/flags/VN.png'},
        {'name': 'Virgin Islands (British)', 'code': 'VG', 'icon': '/assets/img/flags/VG.png'},
        {'name': 'Virgin Islands (U.S.)', 'code': 'VI', 'icon': '/assets/img/flags/VI.png'},
        {'name': 'Wallis and Futuna', 'code': 'WF', 'icon': '/assets/img/flags/WF.png'},
        {'name': 'Western Sahara', 'code': 'EH', 'icon': '/assets/img/flags/EH.png'},
        {'name': 'Yemen', 'code': 'YE', 'icon': '/assets/img/flags/YE.png'},
        {'name': 'Zambia', 'code': 'ZM', 'icon': '/assets/img/flags/ZM.png'},
        {'name': 'Zimbabwe', 'code': 'ZW', 'icon': '/assets/img/flags/ZW.png'}
    ];

})();
