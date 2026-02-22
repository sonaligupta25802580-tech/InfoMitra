from models import create_scheme, create_user, schemes_collection, users_collection
import bcrypt

def seed_schemes():
    schemes_collection.delete_many({})
    
    schemes = [
        {
            'scheme_name': {
                'en': 'Post Matric Scholarship for SC Students',
                'hi': 'अनुसूचित जाति के छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति',
                'mr': 'अनुसूचित जाती विद्यार्थ्यांसाठी पोस्ट मॅट्रिक शिष्यवृत्ती'
            },
            'category': 'Education',
            'tags': ['scholarship', 'education', 'SC'],
            'objective': {
                'en': 'Financial assistance to SC students for post-matriculation studies',
                'hi': 'पोस्ट-मैट्रिक अध्ययन के लिए अनुसूचित जाति के छात्रों को वित्तीय सहायता',
                'mr': 'पोस्ट-मॅट्रिक अभ्यासासाठी अनुसूचित जाती विद्यार्थ्यांना आर्थिक सहाय्य'
            },
            'eligibility': {
                'en': 'SC category students pursuing post-matric education',
                'hi': 'पोस्ट-मैट्रिक शिक्षा प्राप्त करने वाले अनुसूचित जाति के छात्र',
                'mr': 'पोस्ट-मॅट्रिक शिक्षण घेणारे अनुसूचित जाती विद्यार्थी'
            },
            'benefits': {
                'en': 'Tuition fees and maintenance allowance',
                'hi': 'ट्यूशन फीस और रखरखाव भत्ता',
                'mr': 'शिकवणी शुल्क आणि देखभाल भत्ता'
            },
            'documents': {
                'en': ['Caste Certificate', 'Income Certificate', 'Admission Proof'],
                'hi': ['जाति प्रमाण पत्र', 'आय प्रमाण पत्र', 'प्रवेश प्रमाण'],
                'mr': ['जात प्रमाणपत्र', 'उत्पन्न प्रमाणपत्र', 'प्रवेश पुरावा']
            },
            'apply_process': {
                'en': 'Apply online through National Scholarship Portal',
                'hi': 'राष्ट्रीय छात्रवृत्ति पोर्टल के माध्यम से ऑनलाइन आवेदन करें',
                'mr': 'राष्ट्रीय शिष्यवृत्ती पोर्टलद्वारे ऑनलाइन अर्ज करा'
            },
            'official_link': 'https://scholarships.gov.in',
            'min_age': 16,
            'max_age': 30,
            'states': ['Maharashtra', 'Delhi', 'Karnataka'],
            'eligible_categories': ['SC'],
            'disability_supported': [],
            'student_required': True,
            'education_required': ['12th', 'Graduate', 'Post-Graduate']
        },
        {
            'scheme_name': {
                'en': 'Pradhan Mantri Kisan Samman Nidhi',
                'hi': 'प्रधानमंत्री किसान सम्मान निधि',
                'mr': 'प्रधानमंत्री किसान सन्मान निधी'
            },
            'category': 'Agriculture',
            'tags': ['farmer', 'agriculture', 'income support'],
            'objective': {
                'en': 'Income support to farmer families',
                'hi': 'किसान परिवारों को आय सहायता',
                'mr': 'शेतकरी कुटुंबांना उत्पन्न आधार'
            },
            'eligibility': {
                'en': 'All landholding farmer families',
                'hi': 'सभी भूमिधारक किसान परिवार',
                'mr': 'सर्व जमीनधारक शेतकरी कुटुंबे'
            },
            'benefits': {
                'en': 'Rs 6000 per year in three installments',
                'hi': 'तीन किस्तों में प्रति वर्ष 6000 रुपये',
                'mr': 'तीन हप्त्यांमध्ये दरवर्षी 6000 रुपये'
            },
            'documents': {
                'en': ['Land Records', 'Aadhaar Card', 'Bank Account'],
                'hi': ['भूमि रिकॉर्ड', 'आधार कार्ड', 'बैंक खाता'],
                'mr': ['जमीन नोंदी', 'आधार कार्ड', 'बँक खाते']
            },
            'apply_process': {
                'en': 'Apply through PM-KISAN portal or local agriculture office',
                'hi': 'पीएम-किसान पोर्टल या स्थानीय कृषि कार्यालय के माध्यम से आवेदन करें',
                'mr': 'पीएम-किसान पोर्टल किंवा स्थानिक कृषी कार्यालयाद्वारे अर्ज करा'
            },
            'official_link': 'https://pmkisan.gov.in',
            'min_age': 18,
            'max_age': None,
            'states': [],
            'eligible_categories': [],
            'disability_supported': [],
            'student_required': False,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'National Handicapped Finance and Development Corporation Loan',
                'hi': 'राष्ट्रीय विकलांग वित्त और विकास निगम ऋण',
                'mr': 'राष्ट्रीय अपंग वित्त आणि विकास महामंडळ कर्ज'
            },
            'category': 'Disability',
            'tags': ['disability', 'loan', 'self-employment'],
            'objective': {
                'en': 'Financial assistance for self-employment to persons with disabilities',
                'hi': 'विकलांग व्यक्तियों को स्व-रोजगार के लिए वित्तीय सहायता',
                'mr': 'अपंग व्यक्तींना स्वयंरोजगारासाठी आर्थिक सहाय्य'
            },
            'eligibility': {
                'en': 'Persons with 40% or more disability',
                'hi': '40% या अधिक विकलांगता वाले व्यक्ति',
                'mr': '40% किंवा अधिक अपंगत्व असलेल्या व्यक्ती'
            },
            'benefits': {
                'en': 'Loan up to Rs 10 lakh at concessional interest rates',
                'hi': 'रियायती ब्याज दरों पर 10 लाख रुपये तक का ऋण',
                'mr': 'सवलतीच्या व्याजदराने 10 लाख रुपयांपर्यंत कर्ज'
            },
            'documents': {
                'en': ['Disability Certificate', 'Project Report', 'Income Proof'],
                'hi': ['विकलांगता प्रमाण पत्र', 'परियोजना रिपोर्ट', 'आय प्रमाण'],
                'mr': ['अपंगत्व प्रमाणपत्र', 'प्रकल्प अहवाल', 'उत्पन्न पुरावा']
            },
            'apply_process': {
                'en': 'Apply through NHFDC website or state channelizing agencies',
                'hi': 'एनएचएफडीसी वेबसाइट या राज्य चैनलाइजिंग एजेंसियों के माध्यम से आवेदन करें',
                'mr': 'NHFDC वेबसाइट किंवा राज्य चॅनेलायझिंग एजन्सीद्वारे अर्ज करा'
            },
            'official_link': 'https://nhfdc.nic.in',
            'min_age': 18,
            'max_age': 60,
            'states': [],
            'eligible_categories': [],
            'disability_supported': ['Physical', 'Visual', 'Hearing', 'Mental'],
            'student_required': None,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'Beti Bachao Beti Padhao',
                'hi': 'बेटी बचाओ बेटी पढ़ाओ',
                'mr': 'बेटी बचाओ बेटी पढाओ'
            },
            'category': 'Women Empowerment',
            'tags': ['girl child', 'education', 'women'],
            'objective': {
                'en': 'Prevent gender-biased sex selection and ensure education for girl child',
                'hi': 'लिंग-पक्षपाती लिंग चयन को रोकना और बालिका के लिए शिक्षा सुनिश्चित करना',
                'mr': 'लिंग-पक्षपाती लिंग निवड रोखणे आणि मुलींसाठी शिक्षण सुनिश्चित करणे'
            },
            'eligibility': {
                'en': 'Girl child up to 10 years of age',
                'hi': '10 वर्ष तक की बालिका',
                'mr': '10 वर्षांपर्यंतची मुलगी'
            },
            'benefits': {
                'en': 'Financial incentives and awareness programs',
                'hi': 'वित्तीय प्रोत्साहन और जागरूकता कार्यक्रम',
                'mr': 'आर्थिक प्रोत्साहन आणि जागरूकता कार्यक्रम'
            },
            'documents': {
                'en': ['Birth Certificate', 'Bank Account', 'Aadhaar'],
                'hi': ['जन्म प्रमाण पत्र', 'बैंक खाता', 'आधार'],
                'mr': ['जन्म प्रमाणपत्र', 'बँक खाते', 'आधार']
            },
            'apply_process': {
                'en': 'Apply through post office or authorized bank',
                'hi': 'डाकघर या अधिकृत बैंक के माध्यम से आवेदन करें',
                'mr': 'पोस्ट ऑफिस किंवा अधिकृत बँकेद्वारे अर्ज करा'
            },
            'official_link': 'https://wcd.nic.in/bbbp-schemes',
            'min_age': 0,
            'max_age': 10,
            'states': [],
            'eligible_categories': [],
            'disability_supported': [],
            'student_required': None,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'Pradhan Mantri Awas Yojana - Urban',
                'hi': 'प्रधानमंत्री आवास योजना - शहरी',
                'mr': 'प्रधानमंत्री आवास योजना - शहरी'
            },
            'category': 'Housing',
            'tags': ['housing', 'urban', 'subsidy'],
            'objective': {
                'en': 'Affordable housing for urban poor',
                'hi': 'शहरी गरीबों के लिए किफायती आवास',
                'mr': 'शहरी गरीबांसाठी परवडणारे घर'
            },
            'eligibility': {
                'en': 'EWS/LIG/MIG families without pucca house',
                'hi': 'पक्का मकान के बिना ईडब्ल्यूएस/एलआईजी/एमआईजी परिवार',
                'mr': 'पक्के घराशिवाय EWS/LIG/MIG कुटुंबे'
            },
            'benefits': {
                'en': 'Interest subsidy on home loans',
                'hi': 'गृह ऋण पर ब्याज सब्सिडी',
                'mr': 'गृह कर्जावर व्याज सवलत'
            },
            'documents': {
                'en': ['Income Certificate', 'Aadhaar', 'Property Documents'],
                'hi': ['आय प्रमाण पत्र', 'आधार', 'संपत्ति दस्तावेज'],
                'mr': ['उत्पन्न प्रमाणपत्र', 'आधार', 'मालमत्ता कागदपत्रे']
            },
            'apply_process': {
                'en': 'Apply online through PMAY portal',
                'hi': 'पीएमएवाई पोर्टल के माध्यम से ऑनलाइन आवेदन करें',
                'mr': 'PMAY पोर्टलद्वारे ऑनलाइन अर्ज करा'
            },
            'official_link': 'https://pmaymis.gov.in',
            'min_age': 21,
            'max_age': 70,
            'states': [],
            'eligible_categories': ['General', 'OBC', 'SC', 'ST'],
            'disability_supported': [],
            'student_required': False,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'National Means cum Merit Scholarship',
                'hi': 'राष्ट्रीय साधन सह मेधा छात्रवृत्ति',
                'mr': 'राष्ट्रीय साधन सह मेधा शिष्यवृत्ती'
            },
            'category': 'Education',
            'tags': ['scholarship', 'merit', 'students'],
            'objective': {
                'en': 'Financial assistance to meritorious students from economically weaker sections',
                'hi': 'आर्थिक रूप से कमजोर वर्गों के मेधावी छात्रों को वित्तीय सहायता',
                'mr': 'आर्थिकदृष्ट्या कमकुवत घटकांतील मेधावी विद्यार्थ्यांना आर्थिक सहाय्य'
            },
            'eligibility': {
                'en': 'Students studying in class 9-12 with family income below Rs 1.5 lakh',
                'hi': '1.5 लाख रुपये से कम पारिवारिक आय वाले कक्षा 9-12 में पढ़ने वाले छात्र',
                'mr': '1.5 लाख रुपयांपेक्षा कमी कौटुंबिक उत्पन्न असलेले वर्ग 9-12 मध्ये शिकणारे विद्यार्थी'
            },
            'benefits': {
                'en': 'Rs 12000 per year scholarship',
                'hi': 'प्रति वर्ष 12000 रुपये की छात्रवृत्ति',
                'mr': 'दरवर्षी 12000 रुपये शिष्यवृत्ती'
            },
            'documents': {
                'en': ['Income Certificate', 'Previous Year Marksheet', 'School Certificate'],
                'hi': ['आय प्रमाण पत्र', 'पिछले वर्ष की मार्कशीट', 'स्कूल प्रमाण पत्र'],
                'mr': ['उत्पन्न प्रमाणपत्र', 'मागील वर्षाची गुणपत्रिका', 'शाळा प्रमाणपत्र']
            },
            'apply_process': {
                'en': 'Apply through National Scholarship Portal',
                'hi': 'राष्ट्रीय छात्रवृत्ति पोर्टल के माध्यम से आवेदन करें',
                'mr': 'राष्ट्रीय शिष्यवृत्ती पोर्टलद्वारे अर्ज करा'
            },
            'official_link': 'https://scholarships.gov.in',
            'min_age': 13,
            'max_age': 18,
            'states': [],
            'eligible_categories': [],
            'disability_supported': [],
            'student_required': True,
            'education_required': ['9th', '10th', '11th', '12th']
        },
        {
            'scheme_name': {
                'en': 'Atal Pension Yojana',
                'hi': 'अटल पेंशन योजना',
                'mr': 'अटल पेन्शन योजना'
            },
            'category': 'Pension',
            'tags': ['pension', 'retirement', 'social security'],
            'objective': {
                'en': 'Pension scheme for unorganized sector workers',
                'hi': 'असंगठित क्षेत्र के श्रमिकों के लिए पेंशन योजना',
                'mr': 'असंघटित क्षेत्रातील कामगारांसाठी पेन्शन योजना'
            },
            'eligibility': {
                'en': 'Indian citizens aged 18-40 years',
                'hi': '18-40 वर्ष की आयु के भारतीय नागरिक',
                'mr': '18-40 वर्षे वयाचे भारतीय नागरिक'
            },
            'benefits': {
                'en': 'Guaranteed pension of Rs 1000-5000 per month after 60 years',
                'hi': '60 वर्ष के बाद प्रति माह 1000-5000 रुपये की गारंटीकृत पेंशन',
                'mr': '60 वर्षांनंतर दरमहा 1000-5000 रुपये हमीदार पेन्शन'
            },
            'documents': {
                'en': ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
                'hi': ['आधार कार्ड', 'बैंक खाता', 'मोबाइल नंबर'],
                'mr': ['आधार कार्ड', 'बँक खाते', 'मोबाइल नंबर']
            },
            'apply_process': {
                'en': 'Apply through any bank branch',
                'hi': 'किसी भी बैंक शाखा के माध्यम से आवेदन करें',
                'mr': 'कोणत्याही बँक शाखेद्वारे अर्ज करा'
            },
            'official_link': 'https://npscra.nsdl.co.in/atal-pension-yojana.php',
            'min_age': 18,
            'max_age': 40,
            'states': [],
            'eligible_categories': [],
            'disability_supported': [],
            'student_required': False,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'Rajiv Gandhi National Fellowship for SC Students',
                'hi': 'अनुसूचित जाति के छात्रों के लिए राजीव गांधी राष्ट्रीय फैलोशिप',
                'mr': 'अनुसूचित जाती विद्यार्थ्यांसाठी राजीव गांधी राष्ट्रीय फेलोशिप'
            },
            'category': 'Education',
            'tags': ['fellowship', 'research', 'SC', 'higher education'],
            'objective': {
                'en': 'Financial assistance for SC students pursuing M.Phil and Ph.D',
                'hi': 'एम.फिल और पीएचडी करने वाले अनुसूचित जाति के छात्रों के लिए वित्तीय सहायता',
                'mr': 'एम.फिल आणि पीएच.डी करणाऱ्या अनुसूचित जाती विद्यार्थ्यांसाठी आर्थिक सहाय्य'
            },
            'eligibility': {
                'en': 'SC students enrolled in M.Phil/Ph.D programs',
                'hi': 'एम.फिल/पीएचडी कार्यक्रमों में नामांकित अनुसूचित जाति के छात्र',
                'mr': 'एम.फिल/पीएच.डी कार्यक्रमांमध्ये नोंदणी केलेले अनुसूचित जाती विद्यार्थी'
            },
            'benefits': {
                'en': 'Monthly fellowship and contingency grant',
                'hi': 'मासिक फैलोशिप और आकस्मिक अनुदान',
                'mr': 'मासिक फेलोशिप आणि आकस्मिक अनुदान'
            },
            'documents': {
                'en': ['Caste Certificate', 'Admission Proof', 'Research Proposal'],
                'hi': ['जाति प्रमाण पत्र', 'प्रवेश प्रमाण', 'शोध प्रस्ताव'],
                'mr': ['जात प्रमाणपत्र', 'प्रवेश पुरावा', 'संशोधन प्रस्ताव']
            },
            'apply_process': {
                'en': 'Apply through UGC portal',
                'hi': 'यूजीसी पोर्टल के माध्यम से आवेदन करें',
                'mr': 'UGC पोर्टलद्वारे अर्ज करा'
            },
            'official_link': 'https://ugc.ac.in',
            'min_age': 22,
            'max_age': 35,
            'states': [],
            'eligible_categories': ['SC'],
            'disability_supported': [],
            'student_required': True,
            'education_required': ['Post-Graduate', 'M.Phil', 'Ph.D']
        },
        {
            'scheme_name': {
                'en': 'Pradhan Mantri Matru Vandana Yojana',
                'hi': 'प्रधानमंत्री मातृ वंदना योजना',
                'mr': 'प्रधानमंत्री मातृ वंदना योजना'
            },
            'category': 'Women and Child',
            'tags': ['maternity', 'women', 'health'],
            'objective': {
                'en': 'Maternity benefit for pregnant and lactating women',
                'hi': 'गर्भवती और स्तनपान कराने वाली महिलाओं के लिए मातृत्व लाभ',
                'mr': 'गर्भवती आणि स्तनपान करणाऱ्या महिलांसाठी मातृत्व लाभ'
            },
            'eligibility': {
                'en': 'Pregnant women for first living child',
                'hi': 'पहले जीवित बच्चे के लिए गर्भवती महिलाएं',
                'mr': 'पहिल्या जिवंत मुलासाठी गर्भवती महिला'
            },
            'benefits': {
                'en': 'Cash benefit of Rs 5000 in three installments',
                'hi': 'तीन किस्तों में 5000 रुपये का नकद लाभ',
                'mr': 'तीन हप्त्यांमध्ये 5000 रुपये रोख लाभ'
            },
            'documents': {
                'en': ['Aadhaar', 'Bank Account', 'MCP Card'],
                'hi': ['आधार', 'बैंक खाता', 'एमसीपी कार्ड'],
                'mr': ['आधार', 'बँक खाते', 'MCP कार्ड']
            },
            'apply_process': {
                'en': 'Register at Anganwadi Center or health facility',
                'hi': 'आंगनवाड़ी केंद्र या स्वास्थ्य सुविधा पर पंजीकरण करें',
                'mr': 'अंगणवाडी केंद्र किंवा आरोग्य सुविधेवर नोंदणी करा'
            },
            'official_link': 'https://pmmvy.nic.in',
            'min_age': 18,
            'max_age': 45,
            'states': [],
            'eligible_categories': [],
            'disability_supported': [],
            'student_required': None,
            'education_required': []
        },
        {
            'scheme_name': {
                'en': 'Stand Up India Scheme',
                'hi': 'स्टैंड अप इंडिया योजना',
                'mr': 'स्टँड अप इंडिया योजना'
            },
            'category': 'Entrepreneurship',
            'tags': ['loan', 'SC', 'ST', 'women', 'business'],
            'objective': {
                'en': 'Facilitate bank loans for SC/ST and women entrepreneurs',
                'hi': 'अनुसूचित जाति/अनुसूचित जनजाति और महिला उद्यमियों के लिए बैंक ऋण की सुविधा',
                'mr': 'अनुसूचित जाती/जमाती आणि महिला उद्योजकांसाठी बँक कर्ज सुविधा'
            },
            'eligibility': {
                'en': 'SC/ST/Women entrepreneurs aged 18 and above',
                'hi': '18 वर्ष और उससे अधिक आयु के अनुसूचित जाति/अनुसूचित जनजाति/महिला उद्यमी',
                'mr': '18 वर्षे आणि त्याहून अधिक वयाचे अनुसूचित जाती/जमाती/महिला उद्योजक'
            },
            'benefits': {
                'en': 'Loan between Rs 10 lakh to Rs 1 crore',
                'hi': '10 लाख रुपये से 1 करोड़ रुपये के बीच ऋण',
                'mr': '10 लाख रुपये ते 1 कोटी रुपये दरम्यान कर्ज'
            },
            'documents': {
                'en': ['Business Plan', 'Identity Proof', 'Category Certificate'],
                'hi': ['व्यवसाय योजना', 'पहचान प्रमाण', 'श्रेणी प्रमाण पत्र'],
                'mr': ['व्यवसाय योजना', 'ओळख पुरावा', 'श्रेणी प्रमाणपत्र']
            },
            'apply_process': {
                'en': 'Apply through Stand Up India portal or bank branch',
                'hi': 'स्टैंड अप इंडिया पोर्टल या बैंक शाखा के माध्यम से आवेदन करें',
                'mr': 'स्टँड अप इंडिया पोर्टल किंवा बँक शाखेद्वारे अर्ज करा'
            },
            'official_link': 'https://www.standupmitra.in',
            'min_age': 18,
            'max_age': None,
            'states': [],
            'eligible_categories': ['SC', 'ST'],
            'disability_supported': [],
            'student_required': False,
            'education_required': []
        }
    ]
    
    for scheme in schemes:
        create_scheme(scheme)
    
    print(f"Seeded {len(schemes)} schemes successfully")

def seed_demo_user():
    users_collection.delete_many({})
    
    password = 'demo123'
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    demo_profile = {
        'name': 'Demo User',
        'phone_number': '9876543210',
        'gender': 'Male',
        'age': 22,
        'state': 'Maharashtra',
        'area': 'Urban',
        'category': 'SC',
        'disability': 'no',
        'disabilityPercent': None,
        'student': 'yes',
        'education': 'Graduate',
        'preferred_language': 'en'
    }
    
    user_id = create_user(None, '9876543210', password_hash, demo_profile)
    print(f"Created demo user with phone: 9876543210, password: demo123")
    print(f"User ID: {user_id}")

if __name__ == '__main__':
    print("Starting seed process...")
    seed_schemes()
    seed_demo_user()
    print("Seed completed successfully!")
