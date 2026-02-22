# Problem Statement — InfoMitra

## 1. Background

India has one of the largest welfare systems in the world. The government runs hundreds of schemes for farmers, students, women, senior citizens, people with disabilities, and many other groups. These schemes provide financial help, scholarships, housing, pensions, and other important benefits.

But there is a big problem — **most people who need these schemes the most do not even know they exist.**

Some important facts that show how serious this problem is:

- India's rural literacy rate is only around **68.9%** — many people cannot read complex government documents
- Only **28.7%** of elderly people who are eligible actually receive old-age pension
- Only **23.7%** of eligible widows receive widow pension
- Only **2.3%** of eligible people access free food grain schemes
- Around **75% of welfare schemes are underfunded** because not enough people apply for them

This means billions of rupees meant for poor and needy people are going unused — simply because people don't know about these schemes or don't know how to apply.

---

## 2. The Core Problem

After thinking about this situation, I identified the following main problems:

### Problem 1: Low Awareness
Most citizens, especially in rural areas, do not know which government schemes exist. There is no simple, central place where they can find all this information in one go. They have to visit multiple government websites, which are often complicated and confusing.

### Problem 2: Language Barrier
Most government websites and scheme information is available only in English. But a large portion of India's population is more comfortable in Hindi, Marathi, or other regional languages. This language barrier stops many people from understanding the information even if they find it.

### Problem 3: Complicated Eligibility Rules
Every scheme has different eligibility rules — based on age, income, caste category, state, education, gender, disability, etc. It is very difficult for a common person to read all these rules and figure out if they qualify or not. Many people give up because it is too confusing.

### Problem 4: No Personalized Guidance
Even if someone finds a scheme, they don't know:
- Am I eligible for this?
- What documents do I need?
- Where do I apply?
- What is the last date?

There is no simple assistant that can answer these questions in a friendly, easy-to-understand way.

### Problem 5: Digital Divide
Many people in rural areas have basic smartphones but limited internet knowledge. They cannot navigate complex government portals. They need something simple, like a chatbot, that they can just talk to and get answers.

---

## 3. Who is Affected?

This problem affects a very large number of people in India:

| Group | How They Are Affected |
|-------|----------------------|
| **Farmers** | Miss out on income support schemes like PM-Kisan |
| **Students (SC/ST/OBC)** | Don't apply for scholarships they are eligible for |
| **Women** | Unaware of maternity benefits, women empowerment schemes |
| **Senior Citizens** | Don't receive pension they are entitled to |
| **Persons with Disability** | Miss out on loan and employment schemes |
| **Rural Poor** | Don't know about housing and food security schemes |
| **Young Entrepreneurs** | Unaware of startup and self-employment loan schemes |

---

## 4. Why Existing Solutions Are Not Enough

There are some existing solutions, but they have limitations:

| Existing Solution | Problem With It |
|------------------|----------------|
| Government websites (like india.gov.in) | Too complex, English only, hard to navigate |
| MyScheme portal | Good but still requires user to search manually, no personalization |
| Helpline numbers | Long wait times, not available 24/7, language issues |
| Local government offices | Far away for rural people, require physical visit |
| NGO awareness drives | Reach is limited, not available all the time |

None of these solutions give a **personalized, multilingual, 24/7 available, easy-to-use** experience.

---

## 5. Our Solution — InfoMitra

To solve all the above problems, I built **InfoMitra** — a web application with the following approach:

### Solution to Problem 1 (Low Awareness):
- All government schemes are stored in one central database
- Users can browse all schemes or search by category
- The system automatically shows schemes the user is eligible for — no manual searching needed

### Solution to Problem 2 (Language Barrier):
- Full multilingual support in **English, Hindi, and Marathi**
- All scheme information is stored in all 3 languages
- User can switch language anytime from the top of the page
- The AI chatbot can understand questions in all 3 languages

### Solution to Problem 3 (Complicated Eligibility):
- User just fills in their profile once (age, state, category, education, etc.)
- The system automatically checks eligibility for all schemes
- Uses a smart fuzzy matching algorithm so small errors don't cause problems
- User sees only the schemes they qualify for — no confusion

### Solution to Problem 4 (No Personalized Guidance):
- AI-powered chatbot that can answer questions in simple language
- Chatbot fetches real data from the database — no fake or wrong information
- Can answer: "What documents do I need?", "How do I apply?", "Am I eligible?"
- Available 24/7, no waiting

### Solution to Problem 5 (Digital Divide):
- Simple, clean interface that is easy to use even for people with basic smartphone knowledge
- PWA (Progressive Web App) — can be installed on phone like a regular app
- Works on slow internet connections
- Offline support for basic browsing

---

## 6. Problem Statement (Formal)

> **"Indian citizens, especially from rural and economically weaker sections, face significant challenges in discovering and accessing government welfare schemes due to low awareness, language barriers, complex eligibility rules, and lack of personalized guidance. This results in a large number of eligible citizens missing out on benefits they are entitled to. There is a need for a simple, multilingual, intelligent web platform that can automatically match citizens with relevant government schemes based on their profile and provide easy-to-understand guidance through a conversational AI assistant."**

---

## 7. Objectives of Our Solution

1. **To create a central platform** where all government schemes are available in one place
2. **To provide multilingual support** (English, Hindi, Marathi) so language is not a barrier
3. **To automate eligibility checking** so users don't have to manually read complex rules
4. **To provide an AI chatbot** that answers scheme-related questions in simple language
5. **To make the platform accessible** on mobile phones through PWA technology
6. **To give admin control** so scheme information can be kept up-to-date easily

---

## 8. Expected Impact

If InfoMitra is used widely, it can:

- Help more eligible citizens discover and apply for government schemes
- Reduce the gap between government welfare programs and the people they are meant for
- Save time for citizens who would otherwise visit multiple offices or websites
- Increase the utilization of government funds that are currently going unused
- Empower rural and low-literacy users through simple language and chatbot support

---