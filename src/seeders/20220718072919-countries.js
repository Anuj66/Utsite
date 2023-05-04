'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('countries', [
        {
            id: 1,
            country_name: 'Afghanistan',
            country_code: 'AF',
            phone_code: '+93',
            status: 'Inactive'
        },
        {
            id: 2,
            country_name: 'Aland Islands',
            country_code: 'AX',
            phone_code: '+358-18',
            status: 'Inactive'
        },
        {
            id: 3,
            country_name: 'Albania',
            country_code: 'AL',
            phone_code: '+355',
            status: 'Inactive'
        },
        {
            id: 4,
            country_name: 'Algeria',
            country_code: 'DZ',
            phone_code: '+213',
            status: 'Inactive'
        },
        {
            id: 5,
            country_name: 'American Samoa',
            country_code: 'AS',
            phone_code: '+1-684',
            status: 'Inactive'
        },
        {
            id: 6,
            country_name: 'Andorra',
            country_code: 'AD',
            phone_code: '+376',
            status: 'Inactive'
        },
        {
            id: 7,
            country_name: 'Angola',
            country_code: 'AO',
            phone_code: '+244',
            status: 'Inactive'
        },
        {
            id: 8,
            country_name: 'Anguilla',
            country_code: 'AI',
            phone_code: '+1-264',
            status: 'Inactive'
        },
        {
            id: 9,
            country_name: 'Antarctica',
            country_code: 'AQ',
            phone_code: '+672',
            status: 'Inactive'
        },
        {
            id: 10,
            country_name: 'Antigua And Barbuda',
            country_code: 'AG',
            phone_code: '+1-268',
            status: 'Inactive'
        },
        {
            id: 11,
            country_name: 'Argentina',
            country_code: 'AR',
            phone_code: '+54',
            status: 'Inactive'
        },
        {
            id: 12,
            country_name: 'Armenia',
            country_code: 'AM',
            phone_code: '+374',
            status: 'Inactive'
        },
        {
            id: 13,
            country_name: 'Aruba',
            country_code: 'AW',
            phone_code: '+297',
            status: 'Inactive'
        },
        {
            id: 14,
            country_name: 'Australia',
            country_code: 'AU',
            phone_code: '+61',
            status: 'Inactive'
        },
        {
            id: 15,
            country_name: 'Austria',
            country_code: 'AT',
            phone_code: '+43',
            status: 'Inactive'
        },
        {
            id: 16,
            country_name: 'Azerbaijan',
            country_code: 'AZ',
            phone_code: '+994',
            status: 'Inactive'
        },
        {
            id: 17,
            country_name: 'The Bahamas',
            country_code: 'BS',
            phone_code: '+1-242',
            status: 'Inactive'
        },
        {
            id: 18,
            country_name: 'Bahrain',
            country_code: 'BH',
            phone_code: '+973',
            status: 'Inactive'
        },
        {
            id: 19,
            country_name: 'Bangladesh',
            country_code: 'BD',
            phone_code: '+880',
            status: 'Inactive'
        },
        {
            id: 20,
            country_name: 'Barbados',
            country_code: 'BB',
            phone_code: '+1-246',
            status: 'Inactive'
        },
        {
            id: 21,
            country_name: 'Belarus',
            country_code: 'BY',
            phone_code: '+375',
            status: 'Inactive'
        },
        {
            id: 22,
            country_name: 'Belgium',
            country_code: 'BE',
            phone_code: '+32',
            status: 'Inactive'
        },
        {
            id: 23,
            country_name: 'Belize',
            country_code: 'BZ',
            phone_code: '+501',
            status: 'Inactive'
        },
        {
            id: 24,
            country_name: 'Benin',
            country_code: 'BJ',
            phone_code: '+229',
            status: 'Inactive'
        },
        {
            id: 25,
            country_name: 'Bermuda',
            country_code: 'BM',
            phone_code: '+1-441',
            status: 'Inactive'
        },
        {
            id: 26,
            country_name: 'Bhutan',
            country_code: 'BT',
            phone_code: '+975',
            status: 'Inactive'
        },
        {
            id: 27,
            country_name: 'Bolivia',
            country_code: 'BO',
            phone_code: '+591',
            status: 'Inactive'
        },
        {
            id: 28,
            country_name: 'Bosnia and Herzegovina',
            country_code: 'BA',
            phone_code: '+387',
            status: 'Inactive'
        },
        {
            id: 29,
            country_name: 'Botswana',
            country_code: 'BW',
            phone_code: '+267',
            status: 'Inactive'
        },
        {
            id: 30,
            country_name: 'Bouvet Island',
            country_code: 'BV',
            phone_code: '+0055',
            status: 'Inactive'
        },
        {
            id: 31,
            country_name: 'Brazil',
            country_code: 'BR',
            phone_code: '+55',
            status: 'Inactive'
        },
        {
            id: 32,
            country_name: 'British Indian Ocean Territory',
            country_code: 'IO',
            phone_code: '+246',
            status: 'Inactive'
        },
        {
            id: 33,
            country_name: 'Brunei',
            country_code: 'BN',
            phone_code: '+673',
            status: 'Inactive'
        },
        {
            id: 34,
            country_name: 'Bulgaria',
            country_code: 'BG',
            phone_code: '+359',
            status: 'Inactive'
        },
        {
            id: 35,
            country_name: 'Burkina Faso',
            country_code: 'BF',
            phone_code: '+226',
            status: 'Inactive'
        },
        {
            id: 36,
            country_name: 'Burundi',
            country_code: 'BI',
            phone_code: '+257',
            status: 'Inactive'
        },
        {
            id: 37,
            country_name: 'Cambodia',
            country_code: 'KH',
            phone_code: '+855',
            status: 'Inactive'
        },
        {
            id: 38,
            country_name: 'Cameroon',
            country_code: 'CM',
            phone_code: '+237',
            status: 'Inactive'
        },
        {
            id: 39,
            country_name: 'Canada',
            country_code: 'CA',
            phone_code: '+1',
            status: 'Inactive'
        },
        {
            id: 40,
            country_name: 'Cape Verde',
            country_code: 'CV',
            phone_code: '+238',
            status: 'Inactive'
        },
        {
            id: 41,
            country_name: 'Cayman Islands',
            country_code: 'KY',
            phone_code: '+1-345',
            status: 'Inactive'
        },
        {
            id: 42,
            country_name: 'Central African Republic',
            country_code: 'CF',
            phone_code: '+236',
            status: 'Inactive'
        },
        {
            id: 43,
            country_name: 'Chad',
            country_code: 'TD',
            phone_code: '+235',
            status: 'Inactive'
        },
        {
            id: 44,
            country_name: 'Chile',
            country_code: 'CL',
            phone_code: '+56',
            status: 'Inactive'
        },
        {
            id: 45,
            country_name: 'China',
            country_code: 'CN',
            phone_code: '+86',
            status: 'Inactive'
        },
        {
            id: 46,
            country_name: 'Christmas Island',
            country_code: 'CX',
            phone_code: '+61',
            status: 'Inactive'
        },
        {
            id: 47,
            country_name: 'Cocos (Keeling) Islands',
            country_code: 'CC',
            phone_code: '+61',
            status: 'Inactive'
        },
        {
            id: 48,
            country_name: 'Colombia',
            country_code: 'CO',
            phone_code: '+57',
            status: 'Inactive'
        },
        {
            id: 49,
            country_name: 'Comoros',
            country_code: 'KM',
            phone_code: '+269',
            status: 'Inactive'
        },
        {
            id: 50,
            country_name: 'Congo',
            country_code: 'CG',
            phone_code: '+242',
            status: 'Inactive'
        },
        {
            id: 51,
            country_name: 'Democratic Republic of the Congo',
            country_code: 'CD',
            phone_code: '+243',
            status: 'Inactive'
        },
        {
            id: 52,
            country_name: 'Cook Islands',
            country_code: 'CK',
            phone_code: '+682',
            status: 'Inactive'
        },
        {
            id: 53,
            country_name: 'Costa Rica',
            country_code: 'CR',
            phone_code: '+506',
            status: 'Inactive'
        },
        {
            id: 54,
            country_name: "Cote D'Ivoire (Ivory Coast)",
            country_code: 'CI',
            phone_code: '+225',
            status: 'Inactive'
        },
        {
            id: 55,
            country_name: 'Croatia',
            country_code: 'HR',
            phone_code: '+385',
            status: 'Inactive'
        },
        {
            id: 56,
            country_name: 'Cuba',
            country_code: 'CU',
            phone_code: '+53',
            status: 'Inactive'
        },
        {
            id: 57,
            country_name: 'Cyprus',
            country_code: 'CY',
            phone_code: '+357',
            status: 'Inactive'
        },
        {
            id: 58,
            country_name: 'Czech Republic',
            country_code: 'CZ',
            phone_code: '+420',
            status: 'Inactive'
        },
        {
            id: 59,
            country_name: 'Denmark',
            country_code: 'DK',
            phone_code: '+45',
            status: 'Inactive'
        },
        {
            id: 60,
            country_name: 'Djibouti',
            country_code: 'DJ',
            phone_code: '+253',
            status: 'Inactive'
        },
        {
            id: 61,
            country_name: 'Dominica',
            country_code: 'DM',
            phone_code: '+1-767',
            status: 'Inactive'
        },
        {
            id: 62,
            country_name: 'Dominican Republic',
            country_code: 'DO',
            phone_code: '+1-809',
            status: 'Inactive'
        },
        {
            id: 63,
            country_name: 'East Timor',
            country_code: 'TL',
            phone_code: '+670',
            status: 'Inactive'
        },
        {
            id: 64,
            country_name: 'Ecuador',
            country_code: 'EC',
            phone_code: '+593',
            status: 'Inactive'
        },
        {
            id: 65,
            country_name: 'Egypt',
            country_code: 'EG',
            phone_code: '+20',
            status: 'Inactive'
        },
        {
            id: 66,
            country_name: 'El Salvador',
            country_code: 'SV',
            phone_code: '+503',
            status: 'Inactive'
        },
        {
            id: 67,
            country_name: 'Equatorial Guinea',
            country_code: 'GQ',
            phone_code: '+240',
            status: 'Inactive'
        },
        {
            id: 68,
            country_name: 'Eritrea',
            country_code: 'ER',
            phone_code: '+291',
            status: 'Inactive'
        },
        {
            id: 69,
            country_name: 'Estonia',
            country_code: 'EE',
            phone_code: '+372',
            status: 'Inactive'
        },
        {
            id: 70,
            country_name: 'Ethiopia',
            country_code: 'ET',
            phone_code: '+251',
            status: 'Inactive'
        },
        {
            id: 71,
            country_name: 'Falkland Islands',
            country_code: 'FK',
            phone_code: '+500',
            status: 'Inactive'
        },
        {
            id: 72,
            country_name: 'Faroe Islands',
            country_code: 'FO',
            phone_code: '+298',
            status: 'Inactive'
        },
        {
            id: 73,
            country_name: 'Fiji Islands',
            country_code: 'FJ',
            phone_code: '+679',
            status: 'Inactive'
        },
        {
            id: 74,
            country_name: 'Finland',
            country_code: 'FI',
            phone_code: '+358',
            status: 'Inactive'
        },
        {
            id: 75,
            country_name: 'France',
            country_code: 'FR',
            phone_code: '+33',
            status: 'Inactive'
        },
        {
            id: 76,
            country_name: 'French Guiana',
            country_code: 'GF',
            phone_code: '+594',
            status: 'Inactive'
        },
        {
            id: 77,
            country_name: 'French Polynesia',
            country_code: 'PF',
            phone_code: '+689',
            status: 'Inactive'
        },
        {
            id: 78,
            country_name: 'French Southern Territories',
            country_code: 'TF',
            phone_code: '+262',
            status: 'Inactive'
        },
        {
            id: 79,
            country_name: 'Gabon',
            country_code: 'GA',
            phone_code: '+241',
            status: 'Inactive'
        },
        {
            id: 80,
            country_name: 'Gambia The',
            country_code: 'GM',
            phone_code: '+220',
            status: 'Inactive'
        },
        {
            id: 81,
            country_name: 'Georgia',
            country_code: 'GE',
            phone_code: '+995',
            status: 'Inactive'
        },
        {
            id: 82,
            country_name: 'Germany',
            country_code: 'DE',
            phone_code: '+49',
            status: 'Inactive'
        },
        {
            id: 83,
            country_name: 'Ghana',
            country_code: 'GH',
            phone_code: '+233',
            status: 'Inactive'
        },
        {
            id: 84,
            country_name: 'Gibraltar',
            country_code: 'GI',
            phone_code: '+350',
            status: 'Inactive'
        },
        {
            id: 85,
            country_name: 'Greece',
            country_code: 'GR',
            phone_code: '+30',
            status: 'Inactive'
        },
        {
            id: 86,
            country_name: 'Greenland',
            country_code: 'GL',
            phone_code: '+299',
            status: 'Inactive'
        },
        {
            id: 87,
            country_name: 'Grenada',
            country_code: 'GD',
            phone_code: '+1-473',
            status: 'Inactive'
        },
        {
            id: 88,
            country_name: 'Guadeloupe',
            country_code: 'GP',
            phone_code: '+590',
            status: 'Inactive'
        },
        {
            id: 89,
            country_name: 'Guam',
            country_code: 'GU',
            phone_code: '+1-671',
            status: 'Inactive'
        },
        {
            id: 90,
            country_name: 'Guatemala',
            country_code: 'GT',
            phone_code: '+502',
            status: 'Inactive'
        },
        {
            id: 91,
            country_name: 'Guernsey and Alderney',
            country_code: 'GG',
            phone_code: '+44-1481',
            status: 'Inactive'
        },
        {
            id: 92,
            country_name: 'Guinea',
            country_code: 'GN',
            phone_code: '+224',
            status: 'Inactive'
        },
        {
            id: 93,
            country_name: 'Guinea-Bissau',
            country_code: 'GW',
            phone_code: '+245',
            status: 'Inactive'
        },
        {
            id: 94,
            country_name: 'Guyana',
            country_code: 'GY',
            phone_code: '+592',
            status: 'Inactive'
        },
        {
            id: 95,
            country_name: 'Haiti',
            country_code: 'HT',
            phone_code: '+509',
            status: 'Inactive'
        },
        {
            id: 96,
            country_name: 'Heard Island and McDonald Islands',
            country_code: 'HM',
            phone_code: '+672',
            status: 'Inactive'
        },
        {
            id: 97,
            country_name: 'Honduras',
            country_code: 'HN',
            phone_code: '+504',
            status: 'Inactive'
        },
        {
            id: 98,
            country_name: 'Hong Kong S.A.R.',
            country_code: 'HK',
            phone_code: '+852',
            status: 'Inactive'
        },
        {
            id: 99,
            country_name: 'Hungary',
            country_code: 'HU',
            phone_code: '+36',
            status: 'Inactive'
        },
        {
            id: 100,
            country_name: 'Iceland',
            country_code: 'IS',
            phone_code: '+354',
            status: 'Inactive'
        },
        {
            id: 101,
            country_name: 'India',
            country_code: 'IN',
            phone_code: '+91',
            status: 'Active'
        },
        {
            id: 102,
            country_name: 'Indonesia',
            country_code: 'ID',
            phone_code: '+62',
            status: 'Inactive'
        },
        {
            id: 103,
            country_name: 'Iran',
            country_code: 'IR',
            phone_code: '+98',
            status: 'Inactive'
        },
        {
            id: 104,
            country_name: 'Iraq',
            country_code: 'IQ',
            phone_code: '+964',
            status: 'Inactive'
        },
        {
            id: 105,
            country_name: 'Ireland',
            country_code: 'IE',
            phone_code: '+353',
            status: 'Inactive'
        },
        {
            id: 106,
            country_name: 'Israel',
            country_code: 'IL',
            phone_code: '+972',
            status: 'Inactive'
        },
        {
            id: 107,
            country_name: 'Italy',
            country_code: 'IT',
            phone_code: '+39',
            status: 'Inactive'
        },
        {
            id: 108,
            country_name: 'Jamaica',
            country_code: 'JM',
            phone_code: '+1-876',
            status: 'Inactive'
        },
        {
            id: 109,
            country_name: 'Japan',
            country_code: 'JP',
            phone_code: '+81',
            status: 'Inactive'
        },
        {
            id: 110,
            country_name: 'Jersey',
            country_code: 'JE',
            phone_code: '+44-1534',
            status: 'Inactive'
        },
        {
            id: 111,
            country_name: 'Jordan',
            country_code: 'JO',
            phone_code: '+962',
            status: 'Inactive'
        },
        {
            id: 112,
            country_name: 'Kazakhstan',
            country_code: 'KZ',
            phone_code: '+7',
            status: 'Inactive'
        },
        {
            id: 113,
            country_name: 'Kenya',
            country_code: 'KE',
            phone_code: '+254',
            status: 'Inactive'
        },
        {
            id: 114,
            country_name: 'Kiribati',
            country_code: 'KI',
            phone_code: '+686',
            status: 'Inactive'
        },
        {
            id: 115,
            country_name: 'North Korea',
            country_code: 'KP',
            phone_code: '+850',
            status: 'Inactive'
        },
        {
            id: 116,
            country_name: 'South Korea',
            country_code: 'KR',
            phone_code: '+82',
            status: 'Inactive'
        },
        {
            id: 117,
            country_name: 'Kuwait',
            country_code: 'KW',
            phone_code: '+965',
            status: 'Inactive'
        },
        {
            id: 118,
            country_name: 'Kyrgyzstan',
            country_code: 'KG',
            phone_code: '+996',
            status: 'Inactive'
        },
        {
            id: 119,
            country_name: 'Laos',
            country_code: 'LA',
            phone_code: '+856',
            status: 'Inactive'
        },
        {
            id: 120,
            country_name: 'Latvia',
            country_code: 'LV',
            phone_code: '+371',
            status: 'Inactive'
        },
        {
            id: 121,
            country_name: 'Lebanon',
            country_code: 'LB',
            phone_code: '+961',
            status: 'Inactive'
        },
        {
            id: 122,
            country_name: 'Lesotho',
            country_code: 'LS',
            phone_code: '+266',
            status: 'Inactive'
        },
        {
            id: 123,
            country_name: 'Liberia',
            country_code: 'LR',
            phone_code: '+231',
            status: 'Inactive'
        },
        {
            id: 124,
            country_name: 'Libya',
            country_code: 'LY',
            phone_code: '+218',
            status: 'Inactive'
        },
        {
            id: 125,
            country_name: 'Liechtenstein',
            country_code: 'LI',
            phone_code: '+423',
            status: 'Inactive'
        },
        {
            id: 126,
            country_name: 'Lithuania',
            country_code: 'LT',
            phone_code: '+370',
            status: 'Inactive'
        },
        {
            id: 127,
            country_name: 'Luxembourg',
            country_code: 'LU',
            phone_code: '+352',
            status: 'Inactive'
        },
        {
            id: 128,
            country_name: 'Macau S.A.R.',
            country_code: 'MO',
            phone_code: '+853',
            status: 'Inactive'
        },
        {
            id: 129,
            country_name: 'Macedonia',
            country_code: 'MK',
            phone_code: '+389',
            status: 'Inactive'
        },
        {
            id: 130,
            country_name: 'Madagascar',
            country_code: 'MG',
            phone_code: '+261',
            status: 'Inactive'
        },
        {
            id: 131,
            country_name: 'Malawi',
            country_code: 'MW',
            phone_code: '+265',
            status: 'Inactive'
        },
        {
            id: 132,
            country_name: 'Malaysia',
            country_code: 'MY',
            phone_code: '+60',
            status: 'Inactive'
        },
        {
            id: 133,
            country_name: 'Maldives',
            country_code: 'MV',
            phone_code: '+960',
            status: 'Inactive'
        },
        {
            id: 134,
            country_name: 'Mali',
            country_code: 'ML',
            phone_code: '+223',
            status: 'Inactive'
        },
        {
            id: 135,
            country_name: 'Malta',
            country_code: 'MT',
            phone_code: '+356',
            status: 'Inactive'
        },
        {
            id: 136,
            country_name: 'Man (Isle of)',
            country_code: 'IM',
            phone_code: '+44-1624',
            status: 'Inactive'
        },
        {
            id: 137,
            country_name: 'Marshall Islands',
            country_code: 'MH',
            phone_code: '+692',
            status: 'Inactive'
        },
        {
            id: 138,
            country_name: 'Martinique',
            country_code: 'MQ',
            phone_code: '+596',
            status: 'Inactive'
        },
        {
            id: 139,
            country_name: 'Mauritania',
            country_code: 'MR',
            phone_code: '+222',
            status: 'Inactive'
        },
        {
            id: 140,
            country_name: 'Mauritius',
            country_code: 'MU',
            phone_code: '+230',
            status: 'Inactive'
        },
        {
            id: 141,
            country_name: 'Mayotte',
            country_code: 'YT',
            phone_code: '+262',
            status: 'Inactive'
        },
        {
            id: 142,
            country_name: 'Mexico',
            country_code: 'MX',
            phone_code: '+52',
            status: 'Inactive'
        },
        {
            id: 143,
            country_name: 'Micronesia',
            country_code: 'FM',
            phone_code: '+691',
            status: 'Inactive'
        },
        {
            id: 144,
            country_name: 'Moldova',
            country_code: 'MD',
            phone_code: '+373',
            status: 'Inactive'
        },
        {
            id: 145,
            country_name: 'Monaco',
            country_code: 'MC',
            phone_code: '+377',
            status: 'Inactive'
        },
        {
            id: 146,
            country_name: 'Mongolia',
            country_code: 'MN',
            phone_code: '+976',
            status: 'Inactive'
        },
        {
            id: 147,
            country_name: 'Montenegro',
            country_code: 'ME',
            phone_code: '+382',
            status: 'Inactive'
        },
        {
            id: 148,
            country_name: 'Montserrat',
            country_code: 'MS',
            phone_code: '+1-664',
            status: 'Inactive'
        },
        {
            id: 149,
            country_name: 'Morocco',
            country_code: 'MA',
            phone_code: '+212',
            status: 'Inactive'
        },
        {
            id: 150,
            country_name: 'Mozambique',
            country_code: 'MZ',
            phone_code: '+258',
            status: 'Inactive'
        },
        {
            id: 151,
            country_name: 'Myanmar',
            country_code: 'MM',
            phone_code: '+95',
            status: 'Inactive'
        },
        {
            id: 152,
            country_name: 'Namibia',
            country_code: 'NA',
            phone_code: '+264',
            status: 'Inactive'
        },
        {
            id: 153,
            country_name: 'Nauru',
            country_code: 'NR',
            phone_code: '+674',
            status: 'Inactive'
        },
        {
            id: 154,
            country_name: 'Nepal',
            country_code: 'NP',
            phone_code: '+977',
            status: 'Inactive'
        },
        {
            id: 155,
            country_name: 'Bonaire, Sint Eustatius and Saba',
            country_code: 'BQ',
            phone_code: '+599',
            status: 'Inactive'
        },
        {
            id: 156,
            country_name: 'Netherlands',
            country_code: 'NL',
            phone_code: '+31',
            status: 'Inactive'
        },
        {
            id: 157,
            country_name: 'New Caledonia',
            country_code: 'NC',
            phone_code: '+687',
            status: 'Inactive'
        },
        {
            id: 158,
            country_name: 'New Zealand',
            country_code: 'NZ',
            phone_code: '+64',
            status: 'Inactive'
        },
        {
            id: 159,
            country_name: 'Nicaragua',
            country_code: 'NI',
            phone_code: '+505',
            status: 'Inactive'
        },
        {
            id: 160,
            country_name: 'Niger',
            country_code: 'NE',
            phone_code: '+227',
            status: 'Inactive'
        },
        {
            id: 161,
            country_name: 'Nigeria',
            country_code: 'NG',
            phone_code: '+234',
            status: 'Inactive'
        },
        {
            id: 162,
            country_name: 'Niue',
            country_code: 'NU',
            phone_code: '+683',
            status: 'Inactive'
        },
        {
            id: 163,
            country_name: 'Norfolk Island',
            country_code: 'NF',
            phone_code: '+672',
            status: 'Inactive'
        },
        {
            id: 164,
            country_name: 'Northern Mariana Islands',
            country_code: 'MP',
            phone_code: '+1-670',
            status: 'Inactive'
        },
        {
            id: 165,
            country_name: 'Norway',
            country_code: 'NO',
            phone_code: '+47',
            status: 'Inactive'
        },
        {
            id: 166,
            country_name: 'Oman',
            country_code: 'OM',
            phone_code: '+968',
            status: 'Inactive'
        },
        {
            id: 167,
            country_name: 'Pakistan',
            country_code: 'PK',
            phone_code: '+92',
            status: 'Inactive'
        },
        {
            id: 168,
            country_name: 'Palau',
            country_code: 'PW',
            phone_code: '+680',
            status: 'Inactive'
        },
        {
            id: 169,
            country_name: 'Palestinian Territory Occupied',
            country_code: 'PS',
            phone_code: '+970',
            status: 'Inactive'
        },
        {
            id: 170,
            country_name: 'Panama',
            country_code: 'PA',
            phone_code: '+507',
            status: 'Inactive'
        },
        {
            id: 171,
            country_name: 'Papua new Guinea',
            country_code: 'PG',
            phone_code: '+675',
            status: 'Inactive'
        },
        {
            id: 172,
            country_name: 'Paraguay',
            country_code: 'PY',
            phone_code: '+595',
            status: 'Inactive'
        },
        {
            id: 173,
            country_name: 'Peru',
            country_code: 'PE',
            phone_code: '+51',
            status: 'Inactive'
        },
        {
            id: 174,
            country_name: 'Philippines',
            country_code: 'PH',
            phone_code: '+63',
            status: 'Inactive'
        },
        {
            id: 175,
            country_name: 'Pitcairn Island',
            country_code: 'PN',
            phone_code: '+870',
            status: 'Inactive'
        },
        {
            id: 176,
            country_name: 'Poland',
            country_code: 'PL',
            phone_code: '+48',
            status: 'Inactive'
        },
        {
            id: 177,
            country_name: 'Portugal',
            country_code: 'PT',
            phone_code: '+351',
            status: 'Inactive'
        },
        {
            id: 178,
            country_name: 'Puerto Rico',
            country_code: 'PR',
            phone_code: '+1-787',
            status: 'Inactive'
        },
        {
            id: 179,
            country_name: 'Qatar',
            country_code: 'QA',
            phone_code: '+974',
            status: 'Inactive'
        },
        {
            id: 180,
            country_name: 'Reunion',
            country_code: 'RE',
            phone_code: '+262',
            status: 'Inactive'
        },
        {
            id: 181,
            country_name: 'Romania',
            country_code: 'RO',
            phone_code: '+40',
            status: 'Inactive'
        },
        {
            id: 182,
            country_name: 'Russia',
            country_code: 'RU',
            phone_code: '+7',
            status: 'Inactive'
        },
        {
            id: 183,
            country_name: 'Rwanda',
            country_code: 'RW',
            phone_code: '+250',
            status: 'Inactive'
        },
        {
            id: 184,
            country_name: 'Saint Helena',
            country_code: 'SH',
            phone_code: '+290',
            status: 'Inactive'
        },
        {
            id: 185,
            country_name: 'Saint Kitts And Nevis',
            country_code: 'KN',
            phone_code: '+1-869',
            status: 'Inactive'
        },
        {
            id: 186,
            country_name: 'Saint Lucia',
            country_code: 'LC',
            phone_code: '+1-758',
            status: 'Inactive'
        },
        {
            id: 187,
            country_name: 'Saint Pierre and Miquelon',
            country_code: 'PM',
            phone_code: '+508',
            status: 'Inactive'
        },
        {
            id: 188,
            country_name: 'Saint Vincent And The Grenadines',
            country_code: 'VC',
            phone_code: '+1-784',
            status: 'Inactive'
        },
        {
            id: 189,
            country_name: 'Saint-Barthelemy',
            country_code: 'BL',
            phone_code: '+590',
            status: 'Inactive'
        },
        {
            id: 190,
            country_name: 'Saint-Martin (French part)',
            country_code: 'MF',
            phone_code: '+590',
            status: 'Inactive'
        },
        {
            id: 191,
            country_name: 'Samoa',
            country_code: 'WS',
            phone_code: '+685',
            status: 'Inactive'
        },
        {
            id: 192,
            country_name: 'San Marino',
            country_code: 'SM',
            phone_code: '+378',
            status: 'Inactive'
        },
        {
            id: 193,
            country_name: 'Sao Tome and Principe',
            country_code: 'ST',
            phone_code: '+239',
            status: 'Inactive'
        },
        {
            id: 194,
            country_name: 'Saudi Arabia',
            country_code: 'SA',
            phone_code: '+966',
            status: 'Inactive'
        },
        {
            id: 195,
            country_name: 'Senegal',
            country_code: 'SN',
            phone_code: '+221',
            status: 'Inactive'
        },
        {
            id: 196,
            country_name: 'Serbia',
            country_code: 'RS',
            phone_code: '+381',
            status: 'Inactive'
        },
        {
            id: 197,
            country_name: 'Seychelles',
            country_code: 'SC',
            phone_code: '+248',
            status: 'Inactive'
        },
        {
            id: 198,
            country_name: 'Sierra Leone',
            country_code: 'SL',
            phone_code: '+232',
            status: 'Inactive'
        },
        {
            id: 199,
            country_name: 'Singapore',
            country_code: 'SG',
            phone_code: '+65',
            status: 'Inactive'
        },
        {
            id: 200,
            country_name: 'Slovakia',
            country_code: 'SK',
            phone_code: '+421',
            status: 'Inactive'
        },
        {
            id: 201,
            country_name: 'Slovenia',
            country_code: 'SI',
            phone_code: '+386',
            status: 'Inactive'
        },
        {
            id: 202,
            country_name: 'Solomon Islands',
            country_code: 'SB',
            phone_code: '+677',
            status: 'Inactive'
        },
        {
            id: 203,
            country_name: 'Somalia',
            country_code: 'SO',
            phone_code: '+252',
            status: 'Inactive'
        },
        {
            id: 204,
            country_name: 'South Africa',
            country_code: 'ZA',
            phone_code: '+27',
            status: 'Inactive'
        },
        {
            id: 205,
            country_name: 'South Georgia',
            country_code: 'GS',
            phone_code: '+500',
            status: 'Inactive'
        },
        {
            id: 206,
            country_name: 'South Sudan',
            country_code: 'SS',
            phone_code: '+211',
            status: 'Inactive'
        },
        {
            id: 207,
            country_name: 'Spain',
            country_code: 'ES',
            phone_code: '+34',
            status: 'Inactive'
        },
        {
            id: 208,
            country_name: 'Sri Lanka',
            country_code: 'LK',
            phone_code: '+94',
            status: 'Inactive'
        },
        {
            id: 209,
            country_name: 'Sudan',
            country_code: 'SD',
            phone_code: '+249',
            status: 'Inactive'
        },
        {
            id: 210,
            country_name: 'Suriname',
            country_code: 'SR',
            phone_code: '+597',
            status: 'Inactive'
        },
        {
            id: 211,
            country_name: 'Svalbard And Jan Mayen Islands',
            country_code: 'SJ',
            phone_code: '+47',
            status: 'Inactive'
        },
        {
            id: 212,
            country_name: 'Swaziland',
            country_code: 'SZ',
            phone_code: '+268',
            status: 'Inactive'
        },
        {
            id: 213,
            country_name: 'Sweden',
            country_code: 'SE',
            phone_code: '+46',
            status: 'Inactive'
        },
        {
            id: 214,
            country_name: 'Switzerland',
            country_code: 'CH',
            phone_code: '+41',
            status: 'Inactive'
        },
        {
            id: 215,
            country_name: 'Syria',
            country_code: 'SY',
            phone_code: '+963',
            status: 'Inactive'
        },
        {
            id: 216,
            country_name: 'Taiwan',
            country_code: 'TW',
            phone_code: '+886',
            status: 'Inactive'
        },
        {
            id: 217,
            country_name: 'Tajikistan',
            country_code: 'TJ',
            phone_code: '+992',
            status: 'Inactive'
        },
        {
            id: 218,
            country_name: 'Tanzania',
            country_code: 'TZ',
            phone_code: '+255',
            status: 'Inactive'
        },
        {
            id: 219,
            country_name: 'Thailand',
            country_code: 'TH',
            phone_code: '+66',
            status: 'Inactive'
        },
        {
            id: 220,
            country_name: 'Togo',
            country_code: 'TG',
            phone_code: '+228',
            status: 'Inactive'
        },
        {
            id: 221,
            country_name: 'Tokelau',
            country_code: 'TK',
            phone_code: '+690',
            status: 'Inactive'
        },
        {
            id: 222,
            country_name: 'Tonga',
            country_code: 'TO',
            phone_code: '+676',
            status: 'Inactive'
        },
        {
            id: 223,
            country_name: 'Trinidad And Tobago',
            country_code: 'TT',
            phone_code: '+1-868',
            status: 'Inactive'
        },
        {
            id: 224,
            country_name: 'Tunisia',
            country_code: 'TN',
            phone_code: '+216',
            status: 'Inactive'
        },
        {
            id: 225,
            country_name: 'Turkey',
            country_code: 'TR',
            phone_code: '+90',
            status: 'Inactive'
        },
        {
            id: 226,
            country_name: 'Turkmenistan',
            country_code: 'TM',
            phone_code: '+993',
            status: 'Inactive'
        },
        {
            id: 227,
            country_name: 'Turks And Caicos Islands',
            country_code: 'TC',
            phone_code: '+1-649',
            status: 'Inactive'
        },
        {
            id: 228,
            country_name: 'Tuvalu',
            country_code: 'TV',
            phone_code: '+688',
            status: 'Inactive'
        },
        {
            id: 229,
            country_name: 'Uganda',
            country_code: 'UG',
            phone_code: '+256',
            status: 'Inactive'
        },
        {
            id: 230,
            country_name: 'Ukraine',
            country_code: 'UA',
            phone_code: '+380',
            status: 'Inactive'
        },
        {
            id: 231,
            country_name: 'United Arab Emirates',
            country_code: 'AE',
            phone_code: '+971',
            status: 'Inactive'
        },
        {
            id: 232,
            country_name: 'United Kingdom',
            country_code: 'GB',
            phone_code: '+44',
            status: 'Inactive'
        },
        {
            id: 233,
            country_name: 'United States',
            country_code: 'US',
            phone_code: '+1',
            status: 'Inactive'
        },
        {
            id: 234,
            country_name: 'United States Minor Outlying Islands',
            country_code: 'UM',
            phone_code: '+1',
            status: 'Inactive'
        },
        {
            id: 235,
            country_name: 'Uruguay',
            country_code: 'UY',
            phone_code: '+598',
            status: 'Inactive'
        },
        {
            id: 236,
            country_name: 'Uzbekistan',
            country_code: 'UZ',
            phone_code: '+998',
            status: 'Inactive'
        },
        {
            id: 237,
            country_name: 'Vanuatu',
            country_code: 'VU',
            phone_code: '+678',
            status: 'Inactive'
        },
        {
            id: 238,
            country_name: 'Vatican City State (Holy See)',
            country_code: 'VA',
            phone_code: '+379',
            status: 'Inactive'
        },
        {
            id: 239,
            country_name: 'Venezuela',
            country_code: 'VE',
            phone_code: '+58',
            status: 'Inactive'
        },
        {
            id: 240,
            country_name: 'Vietnam',
            country_code: 'VN',
            phone_code: '+84',
            status: 'Inactive'
        },
        {
            id: 241,
            country_name: 'Virgin Islands (British)',
            country_code: 'VG',
            phone_code: '+1-284',
            status: 'Inactive'
        },
        {
            id: 242,
            country_name: 'Virgin Islands (US)',
            country_code: 'VI',
            phone_code: '+1-340',
            status: 'Inactive'
        },
        {
            id: 243,
            country_name: 'Wallis And Futuna Islands',
            country_code: 'WF',
            phone_code: '+681',
            status: 'Inactive'
        },
        {
            id: 244,
            country_name: 'Western Sahara',
            country_code: 'EH',
            phone_code: '+212',
            status: 'Inactive'
        },
        {
            id: 245,
            country_name: 'Yemen',
            country_code: 'YE',
            phone_code: '+967',
            status: 'Inactive'
        },
        {
            id: 246,
            country_name: 'Zambia',
            country_code: 'ZM',
            phone_code: '+260',
            status: 'Inactive'
        },
        {
            id: 247,
            country_name: 'Zimbabwe',
            country_code: 'ZW',
            phone_code: '+263',
            status: 'Inactive'
        },
        {
            id: 249,
            country_name: 'Curaçao',
            country_code: 'CW',
            phone_code: '+599',
            status: 'Inactive'
        },
        {
            id: 248,
            country_name: 'Kosovo',
            country_code: 'XK',
            phone_code: '+383',
            status: 'Inactive'
        },
        {
            id: 250,
            country_name: 'Sint Maarten (Dutch part)',
            country_code: 'SX',
            phone_code: '+1721',
            status: 'Inactive'
        }
    ], {
        updateOnDuplicate:["country_name", "country_code", "phone_code", "status"]
    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
