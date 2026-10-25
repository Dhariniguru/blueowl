"""
Expanded Curriculum Seed Script.

Adds comprehensive educational content to existing modules:
- 10+ vocabulary words per lesson
- 10 practice questions per lesson
- Educational images (URLs)
- Learning tips
- Proper introductions and learning objectives

Safe to re-run - only adds content, never touches user data.
"""
from app import create_app
from app.extensions import db
from app.models import (
    Module, Lesson, Vocabulary, LessonImage, Question, 
    QuestionOption, LearningTip, AssessmentQuestion, Achievement
)

app = create_app()

# ============================================================
# EXPANDED VOCABULARY DATA
# ============================================================
VOCABULARY_DATA = {
    # Module 1: First Steps (A1) - Lesson 1: Meet & Greet
    "Meet & Greet": [
        {"word": "hello", "meaning": "a greeting used when meeting someone", "example": "Hello, how are you today?", "pronunciation": "heh-LOH", "part_of_speech": "interjection"},
        {"word": "goodbye", "meaning": "a farewell when leaving", "example": "Goodbye, see you tomorrow!", "pronunciation": "good-BYE", "part_of_speech": "interjection"},
        {"word": "name", "meaning": "what someone is called", "example": "My name is Priya.", "pronunciation": "naym", "part_of_speech": "noun"},
        {"word": "friend", "meaning": "a person you like and know well", "example": "She is my best friend.", "pronunciation": "frend", "part_of_speech": "noun"},
        {"word": "student", "meaning": "a person who studies at school", "example": "I am a student.", "pronunciation": "STOO-dent", "part_of_speech": "noun"},
        {"word": "teacher", "meaning": "a person who teaches", "example": "My teacher is very kind.", "pronunciation": "TEE-cher", "part_of_speech": "noun"},
        {"word": "meet", "meaning": "to see someone for the first time", "example": "Nice to meet you!", "pronunciation": "meet", "part_of_speech": "verb"},
        {"word": "introduce", "meaning": "to tell someone your name", "example": "Let me introduce myself.", "pronunciation": "in-tro-DOOS", "part_of_speech": "verb"},
        {"word": "please", "meaning": "a polite word when asking", "example": "Please sit down.", "pronunciation": "pleez", "part_of_speech": "adverb"},
        {"word": "thank you", "meaning": "polite words to show gratitude", "example": "Thank you for your help.", "pronunciation": "THANK-yoo", "part_of_speech": "phrase"},
        {"word": "welcome", "meaning": "a friendly greeting to someone arriving", "example": "Welcome to our class!", "pronunciation": "WEL-kum", "part_of_speech": "interjection"},
        {"word": "sorry", "meaning": "an apology for a mistake", "example": "I am sorry I am late.", "pronunciation": "SOR-ee", "part_of_speech": "adjective"},
    ],
    # Module 1 - Lesson 2: Everyday Objects
    "Everyday Objects": [
        {"word": "book", "meaning": "a set of printed pages to read", "example": "I am reading a book.", "pronunciation": "book", "part_of_speech": "noun"},
        {"word": "chair", "meaning": "a seat with a back", "example": "Please sit on the chair.", "pronunciation": "chair", "part_of_speech": "noun"},
        {"word": "table", "meaning": "a flat surface with legs", "example": "The book is on the table.", "pronunciation": "TAY-bul", "part_of_speech": "noun"},
        {"word": "water", "meaning": "a clear liquid we drink", "example": "I drink water every day.", "pronunciation": "WAH-ter", "part_of_speech": "noun"},
        {"word": "pen", "meaning": "a tool for writing with ink", "example": "Write with a pen.", "pronunciation": "pen", "part_of_speech": "noun"},
        {"word": "bag", "meaning": "a container for carrying things", "example": "My bag is heavy.", "pronunciation": "bag", "part_of_speech": "noun"},
        {"word": "door", "meaning": "an entrance to a room", "example": "Please open the door.", "pronunciation": "dor", "part_of_speech": "noun"},
        {"word": "window", "meaning": "an opening in a wall with glass", "example": "Look through the window.", "pronunciation": "WIN-doh", "part_of_speech": "noun"},
        {"word": "phone", "meaning": "a device for calling people", "example": "My phone is ringing.", "pronunciation": "fohn", "part_of_speech": "noun"},
        {"word": "clock", "meaning": "a device that shows time", "example": "The clock says three o'clock.", "pronunciation": "klok", "part_of_speech": "noun"},
        {"word": "key", "meaning": "a metal tool to open locks", "example": "I need my key to enter.", "pronunciation": "kee", "part_of_speech": "noun"},
        {"word": "cup", "meaning": "a small container for drinking", "example": "A cup of tea, please.", "pronunciation": "kup", "part_of_speech": "noun"},
    ],
    # Module 1 - Lesson 3: Write About Yourself
    "Write About Yourself": [
        {"word": "I", "meaning": "the person speaking", "example": "I am a student.", "pronunciation": "eye", "part_of_speech": "pronoun"},
        {"word": "my", "meaning": "belonging to me", "example": "My name is Ravi.", "pronunciation": "my", "part_of_speech": "pronoun"},
        {"word": "from", "meaning": "showing where you come from", "example": "I am from India.", "pronunciation": "frum", "part_of_speech": "preposition"},
        {"word": "live", "meaning": "to have your home in a place", "example": "I live in Mumbai.", "pronunciation": "liv", "part_of_speech": "verb"},
        {"word": "like", "meaning": "to enjoy something", "example": "I like ice cream.", "pronunciation": "lyke", "part_of_speech": "verb"},
        {"word": "family", "meaning": "parents, children, and relatives", "example": "My family has four people.", "pronunciation": "FAM-uh-lee", "part_of_speech": "noun"},
        {"word": "hobby", "meaning": "an activity you enjoy in free time", "example": "My hobby is reading.", "pronunciation": "HOB-ee", "part_of_speech": "noun"},
        {"word": "age", "meaning": "how old someone is", "example": "I am ten years old.", "pronunciation": "ayj", "part_of_speech": "noun"},
        {"word": "city", "meaning": "a large town", "example": "Delhi is a big city.", "pronunciation": "SIT-ee", "part_of_speech": "noun"},
        {"word": "country", "meaning": "a nation like India or Japan", "example": "India is my country.", "pronunciation": "KUN-tree", "part_of_speech": "noun"},
    ],
    # Module 1 - Lesson 4: Listen: A New Friend
    "Listen: A New Friend": [
        {"word": "listen", "meaning": "to pay attention to sound", "example": "Listen to the music.", "pronunciation": "LIS-en", "part_of_speech": "verb"},
        {"word": "hear", "meaning": "to perceive sound with ears", "example": "I can hear the bell.", "pronunciation": "heer", "part_of_speech": "verb"},
        {"word": "speak", "meaning": "to talk or say words", "example": "Please speak slowly.", "pronunciation": "speek", "part_of_speech": "verb"},
        {"word": "understand", "meaning": "to know the meaning", "example": "I understand the lesson.", "pronunciation": "un-der-STAND", "part_of_speech": "verb"},
        {"word": "repeat", "meaning": "to say or do again", "example": "Can you repeat that?", "pronunciation": "re-PEET", "part_of_speech": "verb"},
        {"word": "question", "meaning": "a sentence that asks something", "example": "Do you have a question?", "pronunciation": "KWES-chun", "part_of_speech": "noun"},
        {"word": "answer", "meaning": "a reply to a question", "example": "Give me the answer.", "pronunciation": "AN-ser", "part_of_speech": "noun"},
        {"word": "slowly", "meaning": "at a slow speed", "example": "Please speak slowly.", "pronunciation": "SLOH-lee", "part_of_speech": "adverb"},
        {"word": "clearly", "meaning": "in a clear way", "example": "She speaks clearly.", "pronunciation": "KLEER-lee", "part_of_speech": "adverb"},
        {"word": "conversation", "meaning": "a talk between people", "example": "We had a nice conversation.", "pronunciation": "kon-ver-SAY-shun", "part_of_speech": "noun"},
    ],
    # Module 1 - Lesson 5: Say Hello
    "Say Hello": [
        {"word": "hello", "meaning": "a greeting", "example": "Hello, my friend!", "pronunciation": "heh-LOH", "part_of_speech": "interjection"},
        {"word": "hi", "meaning": "an informal greeting", "example": "Hi, how are you?", "pronunciation": "hy", "part_of_speech": "interjection"},
        {"word": "morning", "meaning": "the early part of the day", "example": "Good morning, teacher!", "pronunciation": "MOR-ning", "part_of_speech": "noun"},
        {"word": "afternoon", "meaning": "the time after noon", "example": "Good afternoon, sir.", "pronunciation": "af-ter-NOON", "part_of_speech": "noun"},
        {"word": "evening", "meaning": "the late part of the day", "example": "Good evening, everyone.", "pronunciation": "EEV-ning", "part_of_speech": "noun"},
        {"word": "night", "meaning": "the dark part of the day", "example": "Good night, sleep well.", "pronunciation": "nyte", "part_of_speech": "noun"},
        {"word": "how", "meaning": "in what way", "example": "How are you today?", "pronunciation": "how", "part_of_speech": "adverb"},
        {"word": "fine", "meaning": "feeling good or well", "example": "I am fine, thank you.", "pronunciation": "fyne", "part_of_speech": "adjective"},
        {"word": "great", "meaning": "very good", "example": "That is great news!", "pronunciation": "grayt", "part_of_speech": "adjective"},
        {"word": "see", "meaning": "to use your eyes", "example": "See you later!", "pronunciation": "see", "part_of_speech": "verb"},
    ],
    # Module 2: Everyday Life (A2) - Lesson 1: My Daily Routine
    "My Daily Routine": [
        {"word": "wake up", "meaning": "to stop sleeping", "example": "I wake up at 6 AM.", "pronunciation": "wayk up", "part_of_speech": "verb phrase"},
        {"word": "breakfast", "meaning": "the first meal of the day", "example": "I eat breakfast at 7 AM.", "pronunciation": "BREK-fust", "part_of_speech": "noun"},
        {"word": "lunch", "meaning": "the midday meal", "example": "I have lunch at school.", "pronunciation": "lunch", "part_of_speech": "noun"},
        {"word": "dinner", "meaning": "the evening meal", "example": "We have dinner together.", "pronunciation": "DIN-er", "part_of_speech": "noun"},
        {"word": "school", "meaning": "a place for learning", "example": "I go to school by bus.", "pronunciation": "skool", "part_of_speech": "noun"},
        {"word": "homework", "meaning": "school work done at home", "example": "I do my homework after school.", "pronunciation": "HOME-wurk", "part_of_speech": "noun"},
        {"word": "shower", "meaning": "a bath where water falls on you", "example": "I take a shower in the morning.", "pronunciation": "SHOW-er", "part_of_speech": "noun"},
        {"word": "brush", "meaning": "to clean teeth with a brush", "example": "I brush my teeth twice a day.", "pronunciation": "brush", "part_of_speech": "verb"},
        {"word": "always", "meaning": "every time", "example": "I always eat breakfast.", "pronunciation": "AWL-wayz", "part_of_speech": "adverb"},
        {"word": "usually", "meaning": "most of the time", "example": "I usually walk to school.", "pronunciation": "YOO-zhoo-uh-lee", "part_of_speech": "adverb"},
        {"word": "sometimes", "meaning": "not always, occasionally", "example": "Sometimes I watch TV.", "pronunciation": "SUM-tymez", "part_of_speech": "adverb"},
        {"word": "never", "meaning": "not at any time", "example": "I never skip breakfast.", "pronunciation": "NEV-er", "part_of_speech": "adverb"},
    ],
    # Module 2 - Lesson 2: At the Market
    "At the Market": [
        {"word": "market", "meaning": "a place where people buy and sell", "example": "I go to the market on Saturday.", "pronunciation": "MAR-ket", "part_of_speech": "noun"},
        {"word": "price", "meaning": "how much something costs", "example": "What is the price of this?", "pronunciation": "pryce", "part_of_speech": "noun"},
        {"word": "money", "meaning": "coins and notes used to pay", "example": "I have enough money.", "pronunciation": "MUN-ee", "part_of_speech": "noun"},
        {"word": "buy", "meaning": "to get something by paying", "example": "I want to buy some fruit.", "pronunciation": "bye", "part_of_speech": "verb"},
        {"word": "sell", "meaning": "to give something for money", "example": "The shop sells vegetables.", "pronunciation": "sel", "part_of_speech": "verb"},
        {"word": "cheap", "meaning": "low in price", "example": "This is very cheap.", "pronunciation": "cheep", "part_of_speech": "adjective"},
        {"word": "expensive", "meaning": "high in price", "example": "That is too expensive.", "pronunciation": "ek-SPEN-siv", "part_of_speech": "adjective"},
        {"word": "fruit", "meaning": "sweet food from plants like apples", "example": "I like fresh fruit.", "pronunciation": "froot", "part_of_speech": "noun"},
        {"word": "vegetable", "meaning": "plant food like carrots", "example": "Eat your vegetables.", "pronunciation": "VEJ-tuh-bul", "part_of_speech": "noun"},
        {"word": "shopkeeper", "meaning": "a person who owns a shop", "example": "The shopkeeper is friendly.", "pronunciation": "SHOP-kee-per", "part_of_speech": "noun"},
        {"word": "bargain", "meaning": "to discuss a lower price", "example": "In India, we bargain at markets.", "pronunciation": "BAR-gin", "part_of_speech": "verb"},
        {"word": "receipt", "meaning": "a paper showing what you paid", "example": "Keep the receipt.", "pronunciation": "re-SEET", "part_of_speech": "noun"},
    ],
    # Module 2 - Lesson 3: Describe Your Family
    "Describe Your Family": [
        {"word": "mother", "meaning": "a female parent", "example": "My mother is a doctor.", "pronunciation": "MUTH-er", "part_of_speech": "noun"},
        {"word": "father", "meaning": "a male parent", "example": "My father works in an office.", "pronunciation": "FAH-ther", "part_of_speech": "noun"},
        {"word": "brother", "meaning": "a male sibling", "example": "My brother is older than me.", "pronunciation": "BRUTH-er", "part_of_speech": "noun"},
        {"word": "sister", "meaning": "a female sibling", "example": "My sister is younger.", "pronunciation": "SIS-ter", "part_of_speech": "noun"},
        {"word": "grandmother", "meaning": "the mother of your parent", "example": "My grandmother tells stories.", "pronunciation": "GRAND-muth-er", "part_of_speech": "noun"},
        {"word": "grandfather", "meaning": "the father of your parent", "example": "My grandfather is 70 years old.", "pronunciation": "GRAND-fah-ther", "part_of_speech": "noun"},
        {"word": "uncle", "meaning": "the brother of your parent", "example": "My uncle lives in Delhi.", "pronunciation": "UN-kul", "part_of_speech": "noun"},
        {"word": "aunt", "meaning": "the sister of your parent", "example": "My aunt is a teacher.", "pronunciation": "ant", "part_of_speech": "noun"},
        {"word": "cousin", "meaning": "the child of your aunt or uncle", "example": "My cousin and I play together.", "pronunciation": "KUZ-in", "part_of_speech": "noun"},
        {"word": "together", "meaning": "with each other", "example": "We eat dinner together.", "pronunciation": "too-GETH-er", "part_of_speech": "adverb"},
    ],
    # Module 2 - Lesson 4: Listen: At the Shop
    "Listen: At the Shop": [
        {"word": "shop", "meaning": "a place where things are sold", "example": "The shop is open.", "pronunciation": "shop", "part_of_speech": "noun"},
        {"word": "customer", "meaning": "a person who buys things", "example": "The customer is happy.", "pronunciation": "KUS-tuh-mer", "part_of_speech": "noun"},
        {"word": "size", "meaning": "how big or small something is", "example": "What size do you need?", "pronunciation": "syze", "part_of_speech": "noun"},
        {"word": "color", "meaning": "red, blue, green, etc.", "example": "I like the blue color.", "pronunciation": "KUL-er", "part_of_speech": "noun"},
        {"word": "try", "meaning": "to test or attempt", "example": "Can I try this shirt?", "pronunciation": "try", "part_of_speech": "verb"},
        {"word": "fit", "meaning": "to be the right size", "example": "This dress fits me well.", "pronunciation": "fit", "part_of_speech": "verb"},
        {"word": "change", "meaning": "money returned after payment", "example": "Here is your change.", "pronunciation": "chaynj", "part_of_speech": "noun"},
        {"word": "discount", "meaning": "a reduction in price", "example": "Is there a discount?", "pronunciation": "DIS-kownt", "part_of_speech": "noun"},
        {"word": "exchange", "meaning": "to give one thing for another", "example": "Can I exchange this?", "pronunciation": "eks-CHAYNJ", "part_of_speech": "verb"},
        {"word": "return", "meaning": "to give back", "example": "I want to return this item.", "pronunciation": "re-TURN", "part_of_speech": "verb"},
    ],
    # Module 2 - Lesson 5: Order Food
    "Order Food": [
        {"word": "menu", "meaning": "a list of food available", "example": "Can I see the menu?", "pronunciation": "MEN-yoo", "part_of_speech": "noun"},
        {"word": "order", "meaning": "to ask for food in a restaurant", "example": "I would like to order.", "pronunciation": "OR-der", "part_of_speech": "verb"},
        {"word": "waiter", "meaning": "a person who serves food", "example": "Waiter, please come here.", "pronunciation": "WAY-ter", "part_of_speech": "noun"},
        {"word": "bill", "meaning": "the total amount to pay", "example": "Can I have the bill?", "pronunciation": "bil", "part_of_speech": "noun"},
        {"word": "tip", "meaning": "extra money for good service", "example": "We left a tip for the waiter.", "pronunciation": "tip", "part_of_speech": "noun"},
        {"word": "delicious", "meaning": "very tasty", "example": "The food is delicious!", "pronunciation": "de-LISH-us", "part_of_speech": "adjective"},
        {"word": "spicy", "meaning": "having a strong hot flavor", "example": "Indian food is spicy.", "pronunciation": "SPY-see", "part_of_speech": "adjective"},
        {"word": "sweet", "meaning": "tasting like sugar", "example": "The dessert is very sweet.", "pronunciation": "sweet", "part_of_speech": "adjective"},
        {"word": "hungry", "meaning": "wanting to eat", "example": "I am very hungry.", "pronunciation": "HUN-gree", "part_of_speech": "adjective"},
        {"word": "thirsty", "meaning": "wanting to drink", "example": "I am thirsty. Can I have water?", "pronunciation": "THUR-stee", "part_of_speech": "adjective"},
    ],
    # Module 3: Real Conversations (B1) - Lesson 1: A Short Story
    "A Short Story": [
        {"word": "story", "meaning": "a tale or account of events", "example": "She told a funny story.", "pronunciation": "STOR-ee", "part_of_speech": "noun"},
        {"word": "decide", "meaning": "to make a choice", "example": "I decided to learn English.", "pronunciation": "de-SYDE", "part_of_speech": "verb"},
        {"word": "difficult", "meaning": "not easy, hard", "example": "The exam was difficult.", "pronunciation": "DIF-uh-kult", "part_of_speech": "adjective"},
        {"word": "practice", "meaning": "to do something repeatedly to improve", "example": "Practice makes perfect.", "pronunciation": "PRAK-tis", "part_of_speech": "verb"},
        {"word": "improve", "meaning": "to become better", "example": "My English is improving.", "pronunciation": "im-PROOV", "part_of_speech": "verb"},
        {"word": "success", "meaning": "achieving a goal", "example": "Hard work leads to success.", "pronunciation": "suk-SES", "part_of_speech": "noun"},
        {"word": "experience", "meaning": "something that happens to you", "example": "It was a great experience.", "pronunciation": "ek-SPEER-ee-ens", "part_of_speech": "noun"},
        {"word": "remember", "meaning": "to keep in memory", "example": "Remember to practice daily.", "pronunciation": "re-MEM-ber", "part_of_speech": "verb"},
        {"word": "forget", "meaning": "to not remember", "example": "Don't forget your homework.", "pronunciation": "for-GET", "part_of_speech": "verb"},
        {"word": "achieve", "meaning": "to reach a goal", "example": "You can achieve anything!", "pronunciation": "a-CHEEV", "part_of_speech": "verb"},
    ],
    # Module 3 - Lesson 2: Sharing Opinions
    "Sharing Opinions": [
        {"word": "opinion", "meaning": "a personal belief or view", "example": "In my opinion, reading is fun.", "pronunciation": "o-PIN-yun", "part_of_speech": "noun"},
        {"word": "agree", "meaning": "to have the same opinion", "example": "I agree with you.", "pronunciation": "a-GREE", "part_of_speech": "verb"},
        {"word": "disagree", "meaning": "to have a different opinion", "example": "I disagree with that idea.", "pronunciation": "dis-a-GREE", "part_of_speech": "verb"},
        {"word": "believe", "meaning": "to think something is true", "example": "I believe you are right.", "pronunciation": "be-LEEV", "part_of_speech": "verb"},
        {"word": "think", "meaning": "to have a thought or opinion", "example": "I think this is a good idea.", "pronunciation": "think", "part_of_speech": "verb"},
        {"word": "reason", "meaning": "an explanation for something", "example": "Give me a reason.", "pronunciation": "REE-zun", "part_of_speech": "noun"},
        {"word": "example", "meaning": "a specific case used to explain", "example": "For example, I like apples.", "pronunciation": "eg-ZAM-pul", "part_of_speech": "noun"},
        {"word": "because", "meaning": "for the reason that", "example": "I am happy because I passed.", "pronunciation": "be-KUZ", "part_of_speech": "conjunction"},
        {"word": "prefer", "meaning": "to like one thing more than another", "example": "I prefer tea to coffee.", "pronunciation": "pre-FUR", "part_of_speech": "verb"},
        {"word": "suggestion", "meaning": "an idea or recommendation", "example": "That is a good suggestion.", "pronunciation": "sug-JES-chun", "part_of_speech": "noun"},
    ],
    # Module 3 - Lesson 3: Give a Recommendation
    "Give a Recommendation": [
        {"word": "recommend", "meaning": "to suggest as good", "example": "I recommend this book.", "pronunciation": "rek-uh-MEND", "part_of_speech": "verb"},
        {"word": "suggest", "meaning": "to put forward an idea", "example": "I suggest we go early.", "pronunciation": "sug-JEST", "part_of_speech": "verb"},
        {"word": "should", "meaning": "used to give advice", "example": "You should practice daily.", "pronunciation": "shood", "part_of_speech": "modal verb"},
        {"word": "advice", "meaning": "a suggestion about what to do", "example": "Take my advice.", "pronunciation": "ad-VYCE", "part_of_speech": "noun"},
        {"word": "option", "meaning": "a choice or possibility", "example": "We have two options.", "pronunciation": "OP-shun", "part_of_speech": "noun"},
        {"word": "choice", "meaning": "the act of choosing", "example": "It is your choice.", "pronunciation": "choys", "part_of_speech": "noun"},
        {"word": "better", "meaning": "of a higher quality", "example": "This is better than that.", "pronunciation": "BET-er", "part_of_speech": "adjective"},
        {"word": "best", "meaning": "of the highest quality", "example": "This is the best option.", "pronunciation": "best", "part_of_speech": "adjective"},
        {"word": "useful", "meaning": "helpful or practical", "example": "This app is very useful.", "pronunciation": "YOOS-ful", "part_of_speech": "adjective"},
        {"word": "helpful", "meaning": "giving help or assistance", "example": "Your advice was helpful.", "pronunciation": "HELP-ful", "part_of_speech": "adjective"},
    ],
    # Module 4: Confident Communicator (B2) - Lesson 1: Workplace Email
    "Workplace Email": [
        {"word": "email", "meaning": "electronic message sent via internet", "example": "I sent an email to my boss.", "pronunciation": "EE-mayl", "part_of_speech": "noun"},
        {"word": "meeting", "meaning": "a gathering to discuss something", "example": "We have a meeting at 3 PM.", "pronunciation": "MEE-ting", "part_of_speech": "noun"},
        {"word": "schedule", "meaning": "a plan of things to do", "example": "Let me check my schedule.", "pronunciation": "SKEJ-ool", "part_of_speech": "noun"},
        {"word": "deadline", "meaning": "the final time to finish something", "example": "The deadline is Friday.", "pronunciation": "DED-lyne", "part_of_speech": "noun"},
        {"word": "project", "meaning": "a planned piece of work", "example": "I am working on a project.", "pronunciation": "PROJ-ekt", "part_of_speech": "noun"},
        {"word": "colleague", "meaning": "a person you work with", "example": "My colleague helped me.", "pronunciation": "KOL-eeg", "part_of_speech": "noun"},
        {"word": "manager", "meaning": "a person in charge at work", "example": "My manager is very supportive.", "pronunciation": "MAN-uh-jer", "part_of_speech": "noun"},
        {"word": "request", "meaning": "to ask for something formally", "example": "I request a day off.", "pronunciation": "re-KWEST", "verb": "noun"},
        {"word": "confirm", "meaning": "to say something is true or certain", "example": "Please confirm the meeting time.", "pronunciation": "kun-FURM", "part_of_speech": "verb"},
        {"word": "attach", "meaning": "to add a file to an email", "example": "I will attach the document.", "pronunciation": "a-TACH", "part_of_speech": "verb"},
    ],
    # Module 4 - Lesson 2: Debate: Technology in Schools
    "Debate: Technology in Schools": [
        {"word": "technology", "meaning": "modern devices and systems", "example": "Technology helps us learn.", "pronunciation": "tek-NOL-uh-jee", "part_of_speech": "noun"},
        {"word": "debate", "meaning": "a formal discussion of different views", "example": "We had a debate in class.", "pronunciation": "de-BAYT", "part_of_speech": "noun"},
        {"word": "argument", "meaning": "a reason for or against something", "example": "That is a strong argument.", "pronunciation": "AR-gyoo-ment", "part_of_speech": "noun"},
        {"word": "evidence", "meaning": "facts that prove something", "example": "Show me the evidence.", "pronunciation": "EV-uh-dens", "part_of_speech": "noun"},
        {"word": "benefit", "meaning": "an advantage or good result", "example": "Exercise has many benefits.", "pronunciation": "BEN-uh-fit", "part_of_speech": "noun"},
        {"word": "disadvantage", "meaning": "a drawback or negative side", "example": "Every choice has disadvantages.", "pronunciation": "dis-ad-VAN-tij", "part_of_speech": "noun"},
        {"word": "improve", "meaning": "to make better", "example": "Technology can improve education.", "pronunciation": "im-PROOV", "part_of_speech": "verb"},
        {"word": "distraction", "meaning": "something that takes attention away", "example": "Phones can be a distraction.", "pronunciation": "dis-TRAK-shun", "part_of_speech": "noun"},
        {"word": "opportunity", "meaning": "a chance for something good", "example": "Learning is a great opportunity.", "pronunciation": "op-er-TOO-nuh-tee", "part_of_speech": "noun"},
        {"word": "balance", "meaning": "a state of being equal", "example": "Find a balance between work and play.", "pronunciation": "BAL-ens", "part_of_speech": "noun"},
    ],
}

# ============================================================
# EXPANDED QUESTIONS DATA (10 per lesson)
# ============================================================
QUESTIONS_DATA = {
    "Meet & Greet": [
        {"type": "multiple_choice", "text": "What do you say when you meet someone for the first time?", "options": ["Goodbye", "Nice to meet you", "I am tired", "See you later"], "answer": "Nice to meet you", "difficulty": 1, "xp": 10, "explanation": "We say 'Nice to meet you' when we meet someone for the first time."},
        {"type": "multiple_choice", "text": "Which word is a greeting?", "options": ["Goodbye", "Hello", "Sorry", "Thank you"], "answer": "Hello", "difficulty": 1, "xp": 10, "explanation": "Hello is a common greeting."},
        {"type": "fill_blank", "text": "Complete: '___ name is Priya.'", "options": ["My", "Your", "His", "Her"], "answer": "My", "difficulty": 1, "xp": 10, "explanation": "We use 'my' to talk about ourselves."},
        {"type": "multiple_choice", "text": "What does 'student' mean?", "options": ["A person who teaches", "A person who studies", "A person who cooks", "A person who drives"], "answer": "A person who studies", "difficulty": 1, "xp": 10, "explanation": "A student is someone who studies at school."},
        {"type": "meaning_identification", "text": "What is the meaning of 'introduce'?", "options": ["To say goodbye", "To tell someone your name", "To eat food", "To sleep"], "answer": "To tell someone your name", "difficulty": 1, "xp": 10, "explanation": "To introduce means to tell someone your name."},
        {"type": "vocabulary_recall", "text": "Which word means 'a person you like and know well'?", "options": ["Teacher", "Student", "Friend", "Doctor"], "answer": "Friend", "difficulty": 1, "xp": 10, "explanation": "A friend is someone you like and know well."},
        {"type": "multiple_choice", "text": "What is a polite word to use when asking for something?", "options": ["Sorry", "Please", "Goodbye", "Hello"], "answer": "Please", "difficulty": 1, "xp": 10, "explanation": "Please is a polite word used when asking."},
        {"type": "fill_blank", "text": "Complete: 'Thank you ___ your help.'", "options": ["to", "for", "with", "in"], "answer": "for", "difficulty": 1, "xp": 10, "explanation": "We say 'thank you for' something."},
        {"type": "multiple_choice", "text": "What do you say when you leave?", "options": ["Hello", "Goodbye", "Please", "Sorry"], "answer": "Goodbye", "difficulty": 1, "xp": 10, "explanation": "Goodbye is what we say when leaving."},
        {"type": "vocabulary_recall", "text": "Which word means 'a person who teaches'?", "options": ["Student", "Doctor", "Teacher", "Driver"], "answer": "Teacher", "difficulty": 1, "xp": 10, "explanation": "A teacher is someone who teaches."},
    ],
    "Everyday Objects": [
        {"type": "multiple_choice", "text": "Which object do you use to write?", "options": ["Chair", "Pen", "Cup", "Key"], "answer": "Pen", "difficulty": 1, "xp": 10, "explanation": "A pen is used for writing."},
        {"type": "multiple_choice", "text": "What do you sit on?", "options": ["Table", "Chair", "Door", "Window"], "answer": "Chair", "difficulty": 1, "xp": 10, "explanation": "A chair is what you sit on."},
        {"type": "vocabulary_recall", "text": "Which word means 'a clear liquid we drink'?", "options": ["Milk", "Water", "Juice", "Tea"], "answer": "Water", "difficulty": 1, "xp": 10, "explanation": "Water is the clear liquid we drink."},
        {"type": "fill_blank", "text": "Complete: 'The book is ___ the table.'", "options": ["in", "on", "under", "behind"], "answer": "on", "difficulty": 1, "xp": 10, "explanation": "We use 'on' when something is on top of a surface."},
        {"type": "multiple_choice", "text": "What do you use to open a door?", "options": ["Pen", "Book", "Key", "Cup"], "answer": "Key", "difficulty": 1, "xp": 10, "explanation": "A key is used to open doors."},
        {"type": "meaning_identification", "text": "What is a 'clock'?", "options": ["Something that shows time", "Something you eat", "Something you wear", "Something you read"], "answer": "Something that shows time", "difficulty": 1, "xp": 10, "explanation": "A clock shows the time."},
        {"type": "multiple_choice", "text": "Which object has glass and you can see through it?", "options": ["Door", "Window", "Chair", "Bag"], "answer": "Window", "difficulty": 1, "xp": 10, "explanation": "A window has glass and you can see through it."},
        {"type": "vocabulary_recall", "text": "What do you use to carry things?", "options": ["Pen", "Bag", "Chair", "Table"], "answer": "Bag", "difficulty": 1, "xp": 10, "explanation": "A bag is used to carry things."},
        {"type": "fill_blank", "text": "Complete: 'I drink water from a ___.'", "options": ["plate", "cup", "book", "bag"], "answer": "cup", "difficulty": 1, "xp": 10, "explanation": "We drink from a cup."},
        {"type": "multiple_choice", "text": "Which of these is a piece of furniture?", "options": ["Pen", "Book", "Table", "Phone"], "answer": "Table", "difficulty": 1, "xp": 10, "explanation": "A table is a piece of furniture."},
    ],
    "Write About Yourself": [
        {"type": "fill_blank", "text": "Complete: '___ am a student.'", "options": ["You", "He", "I", "She"], "answer": "I", "difficulty": 1, "xp": 10, "explanation": "We use 'I' when talking about ourselves."},
        {"type": "multiple_choice", "text": "Which word shows where you come from?", "options": ["in", "at", "from", "to"], "answer": "from", "difficulty": 1, "xp": 10, "explanation": "We use 'from' to show where we come from."},
        {"type": "vocabulary_recall", "text": "What does 'hobby' mean?", "options": ["A job", "An activity you enjoy", "A type of food", "A place to live"], "answer": "An activity you enjoy", "difficulty": 1, "xp": 10, "explanation": "A hobby is something you enjoy doing in your free time."},
        {"type": "multiple_choice", "text": "Which word means 'to have your home in a place'?", "options": ["Like", "Live", "Love", "Learn"], "answer": "Live", "difficulty": 1, "xp": 10, "explanation": "To live means to have your home somewhere."},
        {"type": "fill_blank", "text": "Complete: 'I ___ ice cream.'", "options": ["am", "like", "from", "live"], "answer": "like", "difficulty": 1, "xp": 10, "explanation": "We use 'like' to say we enjoy something."},
        {"type": "multiple_choice", "text": "What is 'family'?", "options": ["Your friends", "Your parents and relatives", "Your teachers", "Your neighbors"], "answer": "Your parents and relatives", "difficulty": 1, "xp": 10, "explanation": "Family includes parents, children, and relatives."},
        {"type": "vocabulary_recall", "text": "Which word means 'how old someone is'?", "options": ["Name", "Age", "City", "Country"], "answer": "Age", "difficulty": 1, "xp": 10, "explanation": "Age is how old someone is."},
        {"type": "multiple_choice", "text": "Delhi is a big ___.", "options": ["country", "city", "village", "school"], "answer": "city", "difficulty": 1, "xp": 10, "explanation": "Delhi is a big city."},
        {"type": "fill_blank", "text": "Complete: 'India is my ___.'", "options": ["city", "country", "school", "home"], "answer": "country", "difficulty": 1, "xp": 10, "explanation": "India is a country."},
        {"type": "sentence_formation", "text": "Arrange: 'am / I / India / from'", "options": ["I am from India", "From India I am", "Am I from India", "India from I am"], "answer": "I am from India", "difficulty": 1, "xp": 15, "explanation": "The correct sentence is 'I am from India'."},
    ],
    "Listen: A New Friend": [
        {"type": "multiple_choice", "text": "What does 'listen' mean?", "options": ["To speak", "To pay attention to sound", "To write", "To read"], "answer": "To pay attention to sound", "difficulty": 1, "xp": 10, "explanation": "To listen means to pay attention to sound."},
        {"type": "vocabulary_recall", "text": "Which word means 'to say or do again'?", "options": ["Listen", "Repeat", "Speak", "Hear"], "answer": "Repeat", "difficulty": 1, "xp": 10, "explanation": "To repeat means to say or do something again."},
        {"type": "multiple_choice", "text": "What is a 'conversation'?", "options": ["A book", "A talk between people", "A type of food", "A place"], "answer": "A talk between people", "difficulty": 1, "xp": 10, "explanation": "A conversation is a talk between people."},
        {"type": "fill_blank", "text": "Complete: 'Please speak ___.' (not fast)", "options": ["quickly", "slowly", "loudly", "angrily"], "answer": "slowly", "difficulty": 1, "xp": 10, "explanation": "We ask someone to speak slowly when we want to understand."},
        {"type": "multiple_choice", "text": "What does 'understand' mean?", "options": ["To not know", "To know the meaning", "To forget", "To ignore"], "answer": "To know the meaning", "difficulty": 1, "xp": 10, "explanation": "To understand means to know the meaning of something."},
        {"type": "vocabulary_recall", "text": "Which word means 'a sentence that asks something'?", "options": ["Answer", "Question", "Story", "Word"], "answer": "Question", "difficulty": 1, "xp": 10, "explanation": "A question is a sentence that asks something."},
        {"type": "multiple_choice", "text": "What do you use to hear?", "options": ["Eyes", "Ears", "Hands", "Feet"], "answer": "Ears", "difficulty": 1, "xp": 10, "explanation": "We use our ears to hear."},
        {"type": "fill_blank", "text": "Complete: 'Can you ___ that? I didn't hear.'", "options": ["repeat", "forget", "leave", "stop"], "answer": "repeat", "difficulty": 1, "xp": 10, "explanation": "We ask someone to repeat when we didn't hear."},
        {"type": "meaning_identification", "text": "What does 'clearly' mean?", "options": ["In a fast way", "In a clear way", "In a loud way", "In a quiet way"], "answer": "In a clear way", "difficulty": 1, "xp": 10, "explanation": "Clearly means in a way that is easy to understand."},
        {"type": "multiple_choice", "text": "Which is a polite request?", "options": ["Go away!", "Give me!", "Can you help me?", "I want now!"], "answer": "Can you help me?", "difficulty": 1, "xp": 10, "explanation": "Can you help me? is a polite request."},
    ],
    "Say Hello": [
        {"type": "multiple_choice", "text": "What do you say in the morning?", "options": ["Good night", "Good morning", "Good evening", "Good afternoon"], "answer": "Good morning", "difficulty": 1, "xp": 10, "explanation": "We say 'Good morning' in the morning."},
        {"type": "fill_blank", "text": "Complete: '___ are you?'", "options": ["What", "How", "Where", "When"], "answer": "How", "difficulty": 1, "xp": 10, "explanation": "We ask 'How are you?' to ask about someone's well-being."},
        {"type": "multiple_choice", "text": "What is an informal greeting?", "options": ["Good morning", "Hello", "Hi", "Goodbye"], "answer": "Hi", "difficulty": 1, "xp": 10, "explanation": "Hi is an informal greeting."},
        {"type": "vocabulary_recall", "text": "What does 'fine' mean?", "options": ["Bad", "Good or well", "Tired", "Hungry"], "answer": "Good or well", "difficulty": 1, "xp": 10, "explanation": "Fine means feeling good or well."},
        {"type": "multiple_choice", "text": "What do you say at night before sleeping?", "options": ["Good morning", "Good afternoon", "Good night", "Good evening"], "answer": "Good night", "difficulty": 1, "xp": 10, "explanation": "We say 'Good night' before sleeping."},
        {"type": "fill_blank", "text": "Complete: 'See you ___!'", "options": ["now", "later", "today", "yesterday"], "answer": "later", "difficulty": 1, "xp": 10, "explanation": "We say 'See you later' when leaving."},
        {"type": "multiple_choice", "text": "What does 'great' mean?", "options": ["Very bad", "Very good", "Very small", "Very old"], "answer": "Very good", "difficulty": 1, "xp": 10, "explanation": "Great means very good."},
        {"type": "meaning_identification", "text": "What is the meaning of 'evening'?", "options": ["Early part of the day", "Middle of the day", "Late part of the day", "Dark part of the day"], "answer": "Late part of the day", "difficulty": 1, "xp": 10, "explanation": "Evening is the late part of the day."},
        {"type": "vocabulary_recall", "text": "Which word means 'to use your eyes'?", "options": ["Hear", "See", "Touch", "Taste"], "answer": "See", "difficulty": 1, "xp": 10, "explanation": "To see means to use your eyes."},
        {"type": "sentence_formation", "text": "Arrange: 'you / meet / Nice / to'", "options": ["You nice to meet", "Nice to meet you", "Meet you nice to", "To meet you nice"], "answer": "Nice to meet you", "difficulty": 1, "xp": 15, "explanation": "The correct phrase is 'Nice to meet you'."},
    ],
    "My Daily Routine": [
        {"type": "multiple_choice", "text": "What is the first meal of the day?", "options": ["Lunch", "Dinner", "Breakfast", "Snack"], "answer": "Breakfast", "difficulty": 2, "xp": 10, "explanation": "Breakfast is the first meal of the day."},
        {"type": "fill_blank", "text": "Complete: 'I ___ up at 6 AM.'", "options": ["get", "wake", "stand", "sit"], "answer": "wake", "difficulty": 2, "xp": 10, "explanation": "We say 'wake up' when we stop sleeping."},
        {"type": "vocabulary_recall", "text": "What does 'always' mean?", "options": ["Sometimes", "Never", "Every time", "Occasionally"], "answer": "Every time", "difficulty": 2, "xp": 10, "explanation": "Always means every time."},
        {"type": "multiple_choice", "text": "What do you do to your teeth in the morning?", "options": ["Wash", "Brush", "Comb", "Clean"], "answer": "Brush", "difficulty": 2, "xp": 10, "explanation": "We brush our teeth."},
        {"type": "meaning_identification", "text": "What is 'homework'?", "options": ["Work done at office", "School work done at home", "House cleaning", "Cooking"], "answer": "School work done at home", "difficulty": 2, "xp": 10, "explanation": "Homework is school work done at home."},
        {"type": "multiple_choice", "text": "Which word means 'most of the time'?", "options": ["Always", "Usually", "Never", "Sometimes"], "answer": "Usually", "difficulty": 2, "xp": 10, "explanation": "Usually means most of the time."},
        {"type": "fill_blank", "text": "Complete: 'I go to school ___ bus.'", "options": ["in", "on", "by", "with"], "answer": "by", "difficulty": 2, "xp": 10, "explanation": "We use 'by' for modes of transport."},
        {"type": "vocabulary_recall", "text": "What does 'never' mean?", "options": ["Every time", "Sometimes", "Not at any time", "Always"], "answer": "Not at any time", "difficulty": 2, "xp": 10, "explanation": "Never means not at any time."},
        {"type": "multiple_choice", "text": "What is the evening meal called?", "options": ["Breakfast", "Lunch", "Dinner", "Snack"], "answer": "Dinner", "difficulty": 2, "xp": 10, "explanation": "Dinner is the evening meal."},
        {"type": "sentence_formation", "text": "Arrange: 'breakfast / I / eat / always'", "options": ["I always eat breakfast", "Always I breakfast eat", "Eat I always breakfast", "Breakfast I always eat"], "answer": "I always eat breakfast", "difficulty": 2, "xp": 15, "explanation": "The correct sentence is 'I always eat breakfast'."},
    ],
    "At the Market": [
        {"type": "multiple_choice", "text": "Where do people buy and sell things?", "options": ["School", "Hospital", "Market", "Library"], "answer": "Market", "difficulty": 2, "xp": 10, "explanation": "A market is where people buy and sell things."},
        {"type": "vocabulary_recall", "text": "What does 'price' mean?", "options": ["How big something is", "How much something costs", "How old something is", "How heavy something is"], "answer": "How much something costs", "difficulty": 2, "xp": 10, "explanation": "Price is how much something costs."},
        {"type": "multiple_choice", "text": "Which word means 'low in price'?", "options": ["Expensive", "Cheap", "Big", "Small"], "answer": "Cheap", "difficulty": 2, "xp": 10, "explanation": "Cheap means low in price."},
        {"type": "fill_blank", "text": "Complete: 'I want to ___ some fruit.'", "options": ["sell", "buy", "make", "cook"], "answer": "buy", "difficulty": 2, "xp": 10, "explanation": "We use 'buy' when we get something by paying."},
        {"type": "meaning_identification", "text": "What is a 'shopkeeper'?", "options": ["A person who buys things", "A person who owns a shop", "A person who teaches", "A person who drives"], "answer": "A person who owns a shop", "difficulty": 2, "xp": 10, "explanation": "A shopkeeper owns a shop."},
        {"type": "multiple_choice", "text": "What is the opposite of 'cheap'?", "options": ["Small", "Expensive", "Big", "Light"], "answer": "Expensive", "difficulty": 2, "xp": 10, "explanation": "Expensive is the opposite of cheap."},
        {"type": "vocabulary_recall", "text": "What does 'bargain' mean?", "options": ["To pay full price", "To discuss a lower price", "To leave a shop", "To buy many things"], "answer": "To discuss a lower price", "difficulty": 2, "xp": 10, "explanation": "To bargain means to discuss a lower price."},
        {"type": "multiple_choice", "text": "What do you get after paying?", "options": ["A bag", "A receipt", "A key", "A pen"], "answer": "A receipt", "difficulty": 2, "xp": 10, "explanation": "A receipt is a paper showing what you paid."},
        {"type": "fill_blank", "text": "Complete: 'I like fresh ___ and vegetables.'", "options": ["fruit", "meat", "bread", "rice"], "answer": "fruit", "difficulty": 2, "xp": 10, "explanation": "Fruit and vegetables are common market items."},
        {"type": "multiple_choice", "text": "What do you use to pay?", "options": ["Books", "Money", "Clothes", "Food"], "answer": "Money", "difficulty": 2, "xp": 10, "explanation": "We use money to pay for things."},
    ],
    "Describe Your Family": [
        {"type": "multiple_choice", "text": "Who is your mother?", "options": ["Your male parent", "Your female parent", "Your brother", "Your sister"], "answer": "Your female parent", "difficulty": 2, "xp": 10, "explanation": "A mother is a female parent."},
        {"type": "vocabulary_recall", "text": "What does 'sibling' mean?", "options": ["Parent", "Brother or sister", "Grandparent", "Cousin"], "answer": "Brother or sister", "difficulty": 2, "xp": 10, "explanation": "Siblings are brothers and sisters."},
        {"type": "multiple_choice", "text": "Who is your father's mother?", "options": ["Aunt", "Grandmother", "Sister", "Cousin"], "answer": "Grandmother", "difficulty": 2, "xp": 10, "explanation": "Your father's mother is your grandmother."},
        {"type": "fill_blank", "text": "Complete: 'My uncle is my mother's ___.'", "options": ["father", "brother", "son", "husband"], "answer": "brother", "difficulty": 2, "xp": 10, "explanation": "An uncle is the brother of your parent."},
        {"type": "meaning_identification", "text": "What is a 'cousin'?", "options": ["Your parent's sibling", "Your aunt/uncle's child", "Your grandparent", "Your sibling"], "answer": "Your aunt/uncle's child", "difficulty": 2, "xp": 10, "explanation": "A cousin is the child of your aunt or uncle."},
        {"type": "multiple_choice", "text": "Which word means 'with each other'?", "options": ["Alone", "Together", "Separate", "Apart"], "answer": "Together", "difficulty": 2, "xp": 10, "explanation": "Together means with each other."},
        {"type": "vocabulary_recall", "text": "What does 'aunt' mean?", "options": ["The brother of your parent", "The sister of your parent", "Your grandmother", "Your cousin"], "answer": "The sister of your parent", "difficulty": 2, "xp": 10, "explanation": "An aunt is the sister of your parent."},
        {"type": "fill_blank", "text": "Complete: 'My family ___ four people.'", "options": ["have", "has", "is", "are"], "answer": "has", "difficulty": 2, "xp": 10, "explanation": "We use 'has' with singular subjects like family."},
        {"type": "multiple_choice", "text": "Who is older, grandfather or father?", "options": ["Father", "Grandfather", "Same age", "Brother"], "answer": "Grandfather", "difficulty": 2, "xp": 10, "explanation": "A grandfather is older than a father."},
        {"type": "sentence_formation", "text": "Arrange: 'sister / My / a / is / teacher'", "options": ["My sister a teacher is", "My sister is a teacher", "A teacher is my sister", "Is my sister a teacher"], "answer": "My sister is a teacher", "difficulty": 2, "xp": 15, "explanation": "The correct sentence is 'My sister is a teacher'."},
    ],
    "Listen: At the Shop": [
        {"type": "multiple_choice", "text": "What is a 'customer'?", "options": ["A person who sells things", "A person who buys things", "A person who works in a shop", "A person who owns a shop"], "answer": "A person who buys things", "difficulty": 2, "xp": 10, "explanation": "A customer is a person who buys things."},
        {"type": "vocabulary_recall", "text": "What does 'size' mean?", "options": ["How much something costs", "How big or small something is", "What color something is", "What something is made of"], "answer": "How big or small something is", "difficulty": 2, "xp": 10, "explanation": "Size is how big or small something is."},
        {"type": "multiple_choice", "text": "What do you say when you want to test clothes?", "options": ["I want to buy", "Can I try this?", "I like this", "This is nice"], "answer": "Can I try this?", "difficulty": 2, "xp": 10, "explanation": "We ask 'Can I try this?' to test clothes."},
        {"type": "fill_blank", "text": "Complete: 'This dress ___ me well.'", "options": ["fits", "sits", "hits", "wins"], "answer": "fits", "difficulty": 2, "xp": 10, "explanation": "When clothes are the right size, they fit."},
        {"type": "meaning_identification", "text": "What is a 'discount'?", "options": ["An extra charge", "A reduction in price", "A free item", "A gift"], "answer": "A reduction in price", "difficulty": 2, "xp": 10, "explanation": "A discount is a reduction in price."},
        {"type": "multiple_choice", "text": "What do you say if you want to give something back?", "options": ["I want to buy", "I want to return", "I want to try", "I want to keep"], "answer": "I want to return", "difficulty": 2, "xp": 10, "explanation": "We say 'I want to return' when giving something back."},
        {"type": "vocabulary_recall", "text": "What does 'exchange' mean?", "options": ["To keep something", "To give one thing for another", "To throw away", "To break something"], "answer": "To give one thing for another", "difficulty": 2, "xp": 10, "explanation": "To exchange means to give one thing for another."},
        {"type": "multiple_choice", "text": "What colors do you know?", "options": ["Big, small", "Red, blue, green", "Fast, slow", "Happy, sad"], "answer": "Red, blue, green", "difficulty": 2, "xp": 10, "explanation": "Red, blue, and green are colors."},
        {"type": "fill_blank", "text": "Complete: 'Here is your ___.' (money back)", "options": ["change", "bill", "price", "size"], "answer": "change", "difficulty": 2, "xp": 10, "explanation": "Change is the money returned after payment."},
        {"type": "multiple_choice", "text": "What do you look at to choose food in a restaurant?", "options": ["The bill", "The menu", "The table", "The door"], "answer": "The menu", "difficulty": 2, "xp": 10, "explanation": "A menu lists the food available."},
    ],
    "Order Food": [
        {"type": "multiple_choice", "text": "What do you look at to choose food?", "options": ["Bill", "Menu", "Plate", "Glass"], "answer": "Menu", "difficulty": 2, "xp": 10, "explanation": "A menu shows what food is available."},
        {"type": "vocabulary_recall", "text": "What does 'delicious' mean?", "options": ["Very bad", "Very tasty", "Very spicy", "Very cold"], "answer": "Very tasty", "difficulty": 2, "xp": 10, "explanation": "Delicious means very tasty."},
        {"type": "multiple_choice", "text": "Who serves food in a restaurant?", "options": ["Cook", "Waiter", "Manager", "Cashier"], "answer": "Waiter", "difficulty": 2, "xp": 10, "explanation": "A waiter serves food in a restaurant."},
        {"type": "fill_blank", "text": "Complete: 'I am ___. I want to eat.'", "options": ["thirsty", "hungry", "tired", "sleepy"], "answer": "hungry", "difficulty": 2, "xp": 10, "explanation": "We say 'I am hungry' when we want to eat."},
        {"type": "meaning_identification", "text": "What does 'spicy' mean?", "options": ["Sweet taste", "Strong hot flavor", "Salty taste", "Sour taste"], "answer": "Strong hot flavor", "difficulty": 2, "xp": 10, "explanation": "Spicy food has a strong hot flavor."},
        {"type": "multiple_choice", "text": "What do you ask for at the end of a meal?", "options": ["The menu", "The bill", "The food", "The table"], "answer": "The bill", "difficulty": 2, "xp": 10, "explanation": "We ask for the bill at the end of a meal."},
        {"type": "vocabulary_recall", "text": "What is a 'tip'?", "options": ["The total amount to pay", "Extra money for good service", "A type of food", "A drink"], "answer": "Extra money for good service", "difficulty": 2, "xp": 10, "explanation": "A tip is extra money for good service."},
        {"type": "fill_blank", "text": "Complete: 'I am ___. Can I have water?'", "options": ["hungry", "thirsty", "tired", "happy"], "answer": "thirsty", "difficulty": 2, "xp": 10, "explanation": "We say 'I am thirsty' when we want to drink."},
        {"type": "multiple_choice", "text": "Which word describes sugar taste?", "options": ["Spicy", "Sour", "Sweet", "Bitter"], "answer": "Sweet", "difficulty": 2, "xp": 10, "explanation": "Sweet describes the taste of sugar."},
        {"type": "sentence_formation", "text": "Arrange: 'coffee / like / I / a / of / cup'", "options": ["I like a cup of coffee", "A cup of coffee I like", "Like I a cup of coffee", "Coffee a cup of I like"], "answer": "I like a cup of coffee", "difficulty": 2, "xp": 15, "explanation": "The correct sentence is 'I like a cup of coffee'."},
    ],
    "A Short Story": [
        {"type": "multiple_choice", "text": "What is a 'story'?", "options": ["A math problem", "A tale or account of events", "A type of food", "A building"], "answer": "A tale or account of events", "difficulty": 3, "xp": 10, "explanation": "A story is a tale or account of events."},
        {"type": "vocabulary_recall", "text": "What does 'decide' mean?", "options": ["To wait", "To make a choice", "To forget", "To ask"], "answer": "To make a choice", "difficulty": 3, "xp": 10, "explanation": "To decide means to make a choice."},
        {"type": "multiple_choice", "text": "What is the opposite of 'difficult'?", "options": ["Hard", "Easy", "Long", "Short"], "answer": "Easy", "difficulty": 3, "xp": 10, "explanation": "Easy is the opposite of difficult."},
        {"type": "fill_blank", "text": "Complete: 'Practice makes ___.'", "options": ["easy", "perfect", "difficult", "fun"], "answer": "perfect", "difficulty": 3, "xp": 10, "explanation": "The proverb is 'Practice makes perfect'."},
        {"type": "meaning_identification", "text": "What does 'improve' mean?", "options": ["To become worse", "To become better", "To stay the same", "To stop"], "answer": "To become better", "difficulty": 3, "xp": 10, "explanation": "To improve means to become better."},
        {"type": "multiple_choice", "text": "What leads to success?", "options": ["Giving up", "Hard work", "Sleeping", "Waiting"], "answer": "Hard work", "difficulty": 3, "xp": 10, "explanation": "Hard work leads to success."},
        {"type": "vocabulary_recall", "text": "What does 'remember' mean?", "options": ["To forget", "To keep in memory", "To lose", "To ignore"], "answer": "To keep in memory", "difficulty": 3, "xp": 10, "explanation": "To remember means to keep in memory."},
        {"type": "fill_blank", "text": "Complete: 'Don't ___ your homework.'", "options": ["remember", "forget", "finish", "start"], "answer": "forget", "difficulty": 3, "xp": 10, "explanation": "We say 'Don't forget' as a reminder."},
        {"type": "multiple_choice", "text": "What does 'achieve' mean?", "options": ["To give up", "To reach a goal", "To start something", "To lose something"], "answer": "To reach a goal", "difficulty": 3, "xp": 10, "explanation": "To achieve means to reach a goal."},
        {"type": "sentence_formation", "text": "Arrange: 'can / You / anything / achieve'", "options": ["You achieve can anything", "You can achieve anything", "Can you anything achieve", "Achieve you can anything"], "answer": "You can achieve anything", "difficulty": 3, "xp": 15, "explanation": "The correct sentence is 'You can achieve anything'."},
    ],
    "Sharing Opinions": [
        {"type": "multiple_choice", "text": "What is an 'opinion'?", "options": ["A fact", "A personal belief or view", "A question", "A story"], "answer": "A personal belief or view", "difficulty": 3, "xp": 10, "explanation": "An opinion is a personal belief or view."},
        {"type": "vocabulary_recall", "text": "What does 'agree' mean?", "options": ["To have a different opinion", "To have the same opinion", "To ask a question", "To tell a story"], "answer": "To have the same opinion", "difficulty": 3, "xp": 10, "explanation": "To agree means to have the same opinion."},
        {"type": "multiple_choice", "text": "What is the opposite of 'agree'?", "options": ["Disagree", "Accept", "Confirm", "Approve"], "answer": "Disagree", "difficulty": 3, "xp": 10, "explanation": "Disagree is the opposite of agree."},
        {"type": "fill_blank", "text": "Complete: 'In my ___, reading is fun.'", "options": ["mind", "opinion", "thought", "idea"], "answer": "opinion", "difficulty": 3, "xp": 10, "explanation": "We say 'In my opinion' to share our view."},
        {"type": "meaning_identification", "text": "What does 'prefer' mean?", "options": ["To dislike something", "To like one thing more than another", "To ignore something", "To forget something"], "answer": "To like one thing more than another", "difficulty": 3, "xp": 10, "explanation": "To prefer means to like one thing more than another."},
        {"type": "multiple_choice", "text": "Which word introduces a reason?", "options": ["But", "Because", "And", "Or"], "answer": "Because", "difficulty": 3, "xp": 10, "explanation": "Because introduces a reason."},
        {"type": "vocabulary_recall", "text": "What is a 'suggestion'?", "options": ["A command", "An idea or recommendation", "A question", "A story"], "answer": "An idea or recommendation", "difficulty": 3, "xp": 10, "explanation": "A suggestion is an idea or recommendation."},
        {"type": "fill_blank", "text": "Complete: 'I ___ you are right.'", "options": ["think", "believe", "know", "Both A and B"], "answer": "Both A and B", "difficulty": 3, "xp": 10, "explanation": "Both 'I think' and 'I believe' work here."},
        {"type": "multiple_choice", "text": "What do you give to support your opinion?", "options": ["A question", "A reason", "A story", "A word"], "answer": "A reason", "difficulty": 3, "xp": 10, "explanation": "We give reasons to support our opinions."},
        {"type": "sentence_formation", "text": "Arrange: 'tea / prefer / I / to / coffee'", "options": ["I prefer tea to coffee", "Prefer I tea to coffee", "I tea prefer to coffee", "Tea I prefer to coffee"], "answer": "I prefer tea to coffee", "difficulty": 3, "xp": 15, "explanation": "The correct sentence is 'I prefer tea to coffee'."},
    ],
    "Give a Recommendation": [
        {"type": "multiple_choice", "text": "What does 'recommend' mean?", "options": ["To order someone", "To suggest as good", "To force someone", "To ignore"], "answer": "To suggest as good", "difficulty": 3, "xp": 10, "explanation": "To recommend means to suggest as good."},
        {"type": "vocabulary_recall", "text": "What is 'advice'?", "options": ["A command", "A suggestion about what to do", "A question", "A product"], "answer": "A suggestion about what to do", "difficulty": 3, "xp": 10, "explanation": "Advice is a suggestion about what to do."},
        {"type": "multiple_choice", "text": "Which modal verb is used for advice?", "options": ["Can", "Should", "May", "Will"], "answer": "Should", "difficulty": 3, "xp": 10, "explanation": "We use 'should' to give advice."},
        {"type": "fill_blank", "text": "Complete: 'You ___ practice daily.'", "options": ["can", "should", "may", "will"], "answer": "should", "difficulty": 3, "xp": 10, "explanation": "We use 'should' to give advice."},
        {"type": "meaning_identification", "text": "What does 'useful' mean?", "options": ["Not helpful", "Helpful or practical", "Difficult to use", "Expensive"], "answer": "Helpful or practical", "difficulty": 3, "xp": 10, "explanation": "Useful means helpful or practical."},
        {"type": "multiple_choice", "text": "What is the superlative of 'good'?", "options": ["Better", "Best", "Goodest", "Most good"], "answer": "Best", "difficulty": 3, "xp": 10, "explanation": "The superlative of 'good' is 'best'."},
        {"type": "vocabulary_recall", "text": "What does 'option' mean?", "options": ["A problem", "A choice or possibility", "A command", "A rule"], "answer": "A choice or possibility", "difficulty": 3, "xp": 10, "explanation": "An option is a choice or possibility."},
        {"type": "fill_blank", "text": "Complete: 'This is the ___ option.' (superlative of good)", "options": ["better", "best", "good", "well"], "answer": "best", "difficulty": 3, "xp": 10, "explanation": "Best is the superlative of good."},
        {"type": "multiple_choice", "text": "What do you say when giving a suggestion?", "options": ["You must!", "I recommend that...", "Do this now!", "That is wrong"], "answer": "I recommend that...", "difficulty": 3, "xp": 10, "explanation": "I recommend that... is a polite way to suggest."},
        {"type": "sentence_formation", "text": "Arrange: 'recommend / I / book / this'", "options": ["I recommend this book", "Recommend I this book", "This book I recommend", "I this book recommend"], "answer": "I recommend this book", "difficulty": 3, "xp": 15, "explanation": "The correct sentence is 'I recommend this book'."},
    ],
    "Workplace Email": [
        {"type": "multiple_choice", "text": "What is an 'email'?", "options": ["A paper letter", "An electronic message", "A phone call", "A meeting"], "answer": "An electronic message", "difficulty": 4, "xp": 10, "explanation": "An email is an electronic message sent via internet."},
        {"type": "vocabulary_recall", "text": "What does 'deadline' mean?", "options": ["The start time", "The final time to finish", "A meeting time", "A break time"], "answer": "The final time to finish", "difficulty": 4, "xp": 10, "explanation": "A deadline is the final time to finish something."},
        {"type": "multiple_choice", "text": "Who is a 'colleague'?", "options": ["A family member", "A person you work with", "A teacher", "A friend from school"], "answer": "A person you work with", "difficulty": 4, "xp": 10, "explanation": "A colleague is someone you work with."},
        {"type": "fill_blank", "text": "Complete: 'Please ___ the meeting time.'", "options": ["confirm", "confuse", "refuse", "deny"], "answer": "confirm", "difficulty": 4, "xp": 10, "explanation": "To confirm means to say something is certain."},
        {"type": "meaning_identification", "text": "What does 'attach' mean in email context?", "options": ["To write a message", "To add a file to an email", "To send an email", "To delete an email"], "answer": "To add a file to an email", "difficulty": 4, "xp": 10, "explanation": "To attach means to add a file to an email."},
        {"type": "multiple_choice", "text": "How do you start a formal email?", "options": ["Hey!", "Dear Sir/Madam,", "What's up?", "Hello there"], "answer": "Dear Sir/Madam,", "difficulty": 4, "xp": 10, "explanation": "Dear Sir/Madam is a formal email opening."},
        {"type": "vocabulary_recall", "text": "What is a 'project'?", "options": ["A short task", "A planned piece of work", "A meeting", "A holiday"], "answer": "A planned piece of work", "difficulty": 4, "xp": 10, "explanation": "A project is a planned piece of work."},
        {"type": "fill_blank", "text": "Complete: 'I ___ a day off.' (formally ask)", "options": ["want", "request", "need", "take"], "answer": "request", "difficulty": 4, "xp": 10, "explanation": "Request is a formal way to ask."},
        {"type": "multiple_choice", "text": "How do you end a formal email?", "options": ["Bye!", "Regards,", "See ya!", "Later!"], "answer": "Regards,", "difficulty": 4, "xp": 10, "explanation": "Regards is a formal email closing."},
        {"type": "sentence_formation", "text": "Arrange: 'meeting / schedule / Let / check / my'", "options": ["Let check my meeting schedule", "Let me check my schedule", "Check let me my schedule", "My schedule let me check"], "answer": "Let me check my schedule", "difficulty": 4, "xp": 15, "explanation": "The correct sentence is 'Let me check my schedule'."},
    ],
    "Debate: Technology in Schools": [
        {"type": "multiple_choice", "text": "What is 'technology'?", "options": ["Old books", "Modern devices and systems", "Traditional tools", "Natural resources"], "answer": "Modern devices and systems", "difficulty": 4, "xp": 10, "explanation": "Technology refers to modern devices and systems."},
        {"type": "vocabulary_recall", "text": "What is a 'debate'?", "options": ["A casual chat", "A formal discussion of different views", "A lecture", "A test"], "answer": "A formal discussion of different views", "difficulty": 4, "xp": 10, "explanation": "A debate is a formal discussion of different views."},
        {"type": "multiple_choice", "text": "What is an 'argument' in a debate?", "options": ["A fight", "A reason for or against something", "A question", "A story"], "answer": "A reason for or against something", "difficulty": 4, "xp": 10, "explanation": "An argument is a reason for or against something."},
        {"type": "fill_blank", "text": "Complete: 'Show me the ___.' (proof)", "options": ["opinion", "evidence", "story", "question"], "answer": "evidence", "difficulty": 4, "xp": 10, "explanation": "Evidence is proof that supports an argument."},
        {"type": "meaning_identification", "text": "What is a 'benefit'?", "options": ["A disadvantage", "An advantage or good result", "A problem", "A cost"], "answer": "An advantage or good result", "difficulty": 4, "xp": 10, "explanation": "A benefit is an advantage or good result."},
        {"type": "multiple_choice", "text": "What is the opposite of 'benefit'?", "options": ["Advantage", "Disadvantage", "Improvement", "Progress"], "answer": "Disadvantage", "difficulty": 4, "xp": 10, "explanation": "Disadvantage is the opposite of benefit."},
        {"type": "vocabulary_recall", "text": "What is a 'distraction'?", "options": ["Something that helps focus", "Something that takes attention away", "A learning tool", "A type of technology"], "answer": "Something that takes attention away", "difficulty": 4, "xp": 10, "explanation": "A distraction takes attention away from what you should be doing."},
        {"type": "fill_blank", "text": "Complete: 'Find a ___ between work and play.'", "options": ["balance", "break", "difference", "similarity"], "answer": "balance", "difficulty": 4, "xp": 10, "explanation": "Balance means a state of being equal."},
        {"type": "multiple_choice", "text": "What is an 'opportunity'?", "options": ["A problem", "A chance for something good", "A rule", "A command"], "answer": "A chance for something good", "difficulty": 4, "xp": 10, "explanation": "An opportunity is a chance for something good."},
        {"type": "sentence_formation", "text": "Arrange: 'education / Technology / improve / can'", "options": ["Technology can improve education", "Can technology education improve", "Education can technology improve", "Improve can technology education"], "answer": "Technology can improve education", "difficulty": 4, "xp": 15, "explanation": "The correct sentence is 'Technology can improve education'."},
    ],
}

# ============================================================
# LEARNING TIPS DATA
# ============================================================
TIPS_DATA = {
    "Meet & Greet": [
        {"tip": "Always smile when greeting someone - it makes the greeting friendly!", "type": "general"},
        {"tip": "In English, we say 'Good morning' until 12 PM, then 'Good afternoon' until 6 PM.", "type": "culture"},
        {"tip": "Practice saying 'Nice to meet you' with a clear, confident voice.", "type": "pronunciation"},
        {"tip": "Remember: 'How are you?' is a greeting, not always a real question about your health.", "type": "culture"},
    ],
    "Everyday Objects": [
        {"tip": "Use 'a' before words starting with consonants (a book, a chair) and 'an' before vowels (an apple).", "type": "grammar"},
        {"tip": "Try labeling objects in your room with sticky notes to remember their English names.", "type": "general"},
        {"tip": "The word 'water' is uncountable - we say 'some water' not 'a water'.", "type": "grammar"},
    ],
    "Write About Yourself": [
        {"tip": "When writing about yourself, start with your name, then where you're from, then what you like.", "type": "general"},
        {"tip": "Use 'I am' (contracted to 'I'm') for describing yourself.", "type": "grammar"},
        {"tip": "Connect your sentences with 'and' to make your writing flow better.", "type": "grammar"},
    ],
    "Listen: A New Friend": [
        {"tip": "When listening, focus on key words like names, numbers, and places.", "type": "general"},
        {"tip": "Don't worry if you don't understand every word - try to understand the main idea.", "type": "general"},
        {"tip": "Practice listening to English songs and watching videos with subtitles.", "type": "general"},
    ],
    "Say Hello": [
        {"tip": "Practice saying greetings with different emotions - happy, formal, casual.", "type": "pronunciation"},
        {"tip": "In informal situations, 'Hi' and 'Hey' are common. In formal situations, use 'Hello'.", "type": "culture"},
        {"tip": "When saying 'Good morning', stress the 'MOR' part: good MOR-ning.", "type": "pronunciation"},
    ],
    "My Daily Routine": [
        {"tip": "Use the present simple tense for routines: I wake up, I eat, I go.", "type": "grammar"},
        {"tip": "Add 's' for he/she/it: He wakes up, She eats, It works.", "type": "grammar"},
        {"tip": "Use adverbs of frequency (always, usually, sometimes, never) before the main verb.", "type": "grammar"},
    ],
    "At the Market": [
        {"tip": "In many markets, you can bargain. Start with a lower price than you want to pay.", "type": "culture"},
        {"tip": "Use 'How much is this?' to ask the price of one item.", "type": "general"},
        {"tip": "Use 'How much are these?' to ask the price of multiple items.", "type": "grammar"},
    ],
    "Describe Your Family": [
        {"tip": "Use possessive 's: My mother's name, My father's job.", "type": "grammar"},
        {"tip": "To describe family members, use: tall, short, kind, funny, hardworking.", "type": "general"},
        {"tip": "In Indian culture, we often live with extended family. In English, 'family' can mean different things.", "type": "culture"},
    ],
    "Listen: At the Shop": [
        {"tip": "Listen for numbers when shopping - they tell you the price!", "type": "general"},
        {"tip": "If you don't understand the price, say 'Could you repeat that, please?'", "type": "general"},
        {"tip": "Colors are important when shopping - learn: red, blue, green, yellow, black, white.", "type": "vocabulary"},
    ],
    "Order Food": [
        {"tip": "Politely say 'I would like...' instead of 'I want...' when ordering.", "type": "culture"},
        {"tip": "If you have allergies, learn to say 'I am allergic to...'", "type": "general"},
        {"tip": "In Indian restaurants, 'spicy' can mean very hot! Ask 'Is this very spicy?' if unsure.", "type": "culture"},
    ],
    "A Short Story": [
        {"tip": "Use past tense for stories: 'Ravi decided', 'He practiced', 'He sold'.", "type": "grammar"},
        {"tip": "A good story has: beginning, middle, and end.", "type": "general"},
        {"tip": "Use time words: first, then, after that, finally to show the order of events.", "type": "grammar"},
    ],
    "Sharing Opinions": [
        {"tip": "Start opinions with: 'In my opinion...', 'I think...', 'I believe...'", "type": "general"},
        {"tip": "Respect others' opinions even if you disagree. Say 'I see your point, but...'", "type": "culture"},
        {"tip": "Use 'because' to give reasons for your opinion.", "type": "grammar"},
    ],
    "Give a Recommendation": [
        {"tip": "Use 'I recommend...' or 'I suggest...' for polite recommendations.", "type": "general"},
        {"tip": "Use 'should' for strong advice: 'You should try this restaurant.'", "type": "grammar"},
        {"tip": "When comparing options, use 'better than' and 'the best'.", "type": "grammar"},
    ],
    "Workplace Email": [
        {"tip": "Always use a clear subject line for work emails.", "type": "general"},
        {"tip": "Keep work emails professional and to the point.", "type": "general"},
        {"tip": "Use 'Dear [Name]' for known recipients and 'Dear Sir/Madam' for unknown.", "type": "culture"},
    ],
    "Debate: Technology in Schools": [
        {"tip": "In a debate, listen to the other side and respond to their points.", "type": "general"},
        {"tip": "Use linking words: however, on the other hand, furthermore, moreover.", "type": "grammar"},
        {"tip": "Support your arguments with examples and evidence.", "type": "general"},
    ],
}

# ============================================================
# IMAGE DATA (educational illustrations via URLs)
# ============================================================
IMAGES_DATA = {
    "Meet & Greet": [
        {"url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400", "alt": "Two people greeting each other", "caption": "People greeting each other", "type": "illustration"},
        {"url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400", "alt": "Group of friends", "caption": "A group of friends", "type": "illustration"},
    ],
    "Everyday Objects": [
        {"url": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", "alt": "Stack of books", "caption": "Books on a shelf", "type": "object"},
        {"url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400", "alt": "Office workspace with chair and table", "caption": "A desk with chair and table", "type": "object"},
    ],
    "Write About Yourself": [
        {"url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400", "alt": "Person writing in a notebook", "caption": "Writing about yourself", "type": "illustration"},
    ],
    "Listen: A New Friend": [
        {"url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400", "alt": "Friends talking", "caption": "Friends having a conversation", "type": "illustration"},
    ],
    "Say Hello": [
        {"url": "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400", "alt": "Person waving hello", "caption": "Waving hello", "type": "action"},
    ],
    "My Daily Routine": [
        {"url": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400", "alt": "Morning routine", "caption": "A typical morning routine", "type": "illustration"},
        {"url": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400", "alt": "Daily schedule", "caption": "Daily schedule planner", "type": "illustration"},
    ],
    "At the Market": [
        {"url": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400", "alt": "Fresh vegetables at market", "caption": "Fresh vegetables at a market", "type": "food"},
        {"url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", "alt": "Fruits at market", "caption": "Colorful fruits at the market", "type": "food"},
    ],
    "Describe Your Family": [
        {"url": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400", "alt": "Happy family", "caption": "A happy family together", "type": "illustration"},
    ],
    "Listen: At the Shop": [
        {"url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", "alt": "Clothing shop", "caption": "A clothing shop", "type": "place"},
    ],
    "Order Food": [
        {"url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", "alt": "Restaurant interior", "caption": "A restaurant", "type": "place"},
        {"url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", "alt": "Delicious food", "caption": "Delicious restaurant food", "type": "food"},
    ],
    "A Short Story": [
        {"url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400", "alt": "Person reading a book", "caption": "Reading a story", "type": "illustration"},
    ],
    "Sharing Opinions": [
        {"url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400", "alt": "People discussing", "caption": "People sharing opinions", "type": "illustration"},
    ],
    "Give a Recommendation": [
        {"url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400", "alt": "Person giving advice", "caption": "Giving a recommendation", "type": "illustration"},
    ],
    "Workplace Email": [
        {"url": "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400", "alt": "Laptop with email", "caption": "Writing a work email", "type": "illustration"},
    ],
    "Debate: Technology in Schools": [
        {"url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400", "alt": "Students with technology", "caption": "Students using technology in class", "type": "illustration"},
    ],
}


def seed_expanded():
    """Add expanded curriculum content to existing lessons."""
    with app.app_context():
        db.create_all()
        
        lessons = Lesson.query.all()
        lesson_map = {l.title: l for l in lessons}
        
        vocab_count = 0
        question_count = 0
        option_count = 0
        tip_count = 0
        image_count = 0
        
        for lesson_title, vocab_list in VOCABULARY_DATA.items():
            lesson = lesson_map.get(lesson_title)
            if not lesson:
                print(f"  WARNING: Lesson '{lesson_title}' not found, skipping vocabulary")
                continue
            
            # Add introduction and learning objective if not set
            if not lesson.introduction:
                lesson.introduction = f"Welcome to '{lesson_title}'! In this lesson, you will learn important vocabulary and concepts."
                lesson.learning_objective = f"By the end of this lesson, you will be able to understand and use vocabulary related to {lesson_title.lower()}."
                lesson.estimated_minutes = 15
            
            # Add vocabulary
            for v in vocab_list:
                existing = Vocabulary.query.filter_by(lesson_id=lesson.id, word=v["word"]).first()
                if not existing:
                    db.session.add(Vocabulary(
                        lesson_id=lesson.id,
                        word=v["word"],
                        meaning=v["meaning"],
                        example_sentence=v.get("example", ""),
                        pronunciation_text=v.get("pronunciation", ""),
                        part_of_speech=v.get("part_of_speech", ""),
                    ))
                    vocab_count += 1
            
            # Add questions
            questions = QUESTIONS_DATA.get(lesson_title, [])
            for i, q in enumerate(questions):
                existing = Question.query.filter_by(
                    lesson_id=lesson.id, 
                    question_text=q["text"]
                ).first()
                if not existing:
                    question = Question(
                        lesson_id=lesson.id,
                        question_type=q["type"],
                        question_text=q["text"],
                        correct_answer=q["answer"],
                        difficulty=q.get("difficulty", 1),
                        explanation=q.get("explanation", ""),
                        xp_reward=q.get("xp", 10),
                        order=i + 1,
                    )
                    db.session.add(question)
                    db.session.flush()
                    question_count += 1
                    
                    # Add options
                    options = q.get("options", [])
                    for j, opt in enumerate(options):
                        db.session.add(QuestionOption(
                            question_id=question.id,
                            option_text=opt,
                            is_correct=(opt == q["answer"]),
                            order=j + 1,
                        ))
                        option_count += 1
            
            # Add learning tips
            tips = TIPS_DATA.get(lesson_title, [])
            for i, t in enumerate(tips):
                existing = LearningTip.query.filter_by(
                    lesson_id=lesson.id, 
                    tip_text=t["tip"]
                ).first()
                if not existing:
                    db.session.add(LearningTip(
                        lesson_id=lesson.id,
                        tip_text=t["tip"],
                        tip_type=t.get("type", "general"),
                        order=i + 1,
                    ))
                    tip_count += 1
            
            # Add images
            images = IMAGES_DATA.get(lesson_title, [])
            for i, img in enumerate(images):
                existing = LessonImage.query.filter_by(
                    lesson_id=lesson.id, 
                    image_url=img["url"]
                ).first()
                if not existing:
                    db.session.add(LessonImage(
                        lesson_id=lesson.id,
                        image_url=img["url"],
                        alt_text=img.get("alt", ""),
                        caption=img.get("caption", ""),
                        image_type=img.get("type", "illustration"),
                        order=i + 1,
                    ))
                    image_count += 1
        
        db.session.commit()
        print(f"Expanded curriculum seeded successfully!")
        print(f"  - {vocab_count} vocabulary words added")
        print(f"  - {question_count} questions added ({option_count} options)")
        print(f"  - {tip_count} learning tips added")
        print(f"  - {image_count} images added")
        print(f"  - {len(lessons)} lessons updated with introductions/objectives")


if __name__ == "__main__":
    seed_expanded()