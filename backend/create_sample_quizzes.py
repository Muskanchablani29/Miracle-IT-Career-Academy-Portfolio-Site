import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from quizzes.models import CourseQuiz, QuizQuestion, QuizOption

def create_sample_quizzes():
    # Get all courses
    courses = Course.objects.all()
    
    # Sample languages for each course
    languages_map = {
        'Python': ['Python', 'Django', 'Flask'],
        'Java': ['Java', 'Spring Boot', 'Hibernate'],
        'JavaScript': ['JavaScript', 'React', 'Node.js'],
        'Data Science': ['Python', 'R', 'SQL'],
        'Machine Learning': ['Python', 'TensorFlow', 'Scikit-learn'],
        'Web Development': ['HTML', 'CSS', 'JavaScript'],
        'Cloud Computing': ['AWS', 'Azure', 'Docker'],
        'DevOps': ['Docker', 'Kubernetes', 'Jenkins'],
    }
    
    # Sample questions for different languages
    sample_questions = {
        'Python': [
            {
                'question': 'What is the correct way to create a list in Python?',
                'options': ['list = []', 'list = ()', 'list = {}', 'list = ""'],
                'correct': 0
            },
            {
                'question': 'Which keyword is used to define a function in Python?',
                'options': ['function', 'def', 'func', 'define'],
                'correct': 1
            },
            {
                'question': 'What does the len() function do?',
                'options': ['Returns length of object', 'Creates a list', 'Prints output', 'None of these'],
                'correct': 0
            },
            {
                'question': 'Which of these is a mutable data type?',
                'options': ['tuple', 'string', 'list', 'int'],
                'correct': 2
            },
            {
                'question': 'What is the output of print(2 ** 3)?',
                'options': ['6', '8', '9', '5'],
                'correct': 1
            },
            {
                'question': 'Which method is used to add an element to a list?',
                'options': ['add()', 'append()', 'insert()', 'push()'],
                'correct': 1
            },
            {
                'question': 'What is the correct syntax for a for loop?',
                'options': ['for i in range(10):', 'for (i=0; i<10; i++):', 'for i to 10:', 'for i = 1 to 10:'],
                'correct': 0
            },
            {
                'question': 'Which operator is used for floor division?',
                'options': ['/', '//', '%', '**'],
                'correct': 1
            },
            {
                'question': 'What is the correct way to import a module?',
                'options': ['include module', 'import module', 'require module', 'use module'],
                'correct': 1
            },
            {
                'question': 'Which of these is not a Python data type?',
                'options': ['list', 'dict', 'array', 'tuple'],
                'correct': 2
            },
            {
                'question': 'What does the range(5) function return?',
                'options': ['[1,2,3,4,5]', '[0,1,2,3,4]', '[0,1,2,3,4,5]', '5'],
                'correct': 1
            },
            {
                'question': 'Which method converts a string to lowercase?',
                'options': ['lower()', 'toLower()', 'lowercase()', 'downcase()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to handle exceptions?',
                'options': ['try-catch', 'try-except', 'try-error', 'catch-error'],
                'correct': 1
            },
            {
                'question': 'Which keyword is used to create a class?',
                'options': ['class', 'Class', 'define', 'object'],
                'correct': 0
            },
            {
                'question': 'What is the output of bool(0)?',
                'options': ['True', 'False', '0', 'None'],
                'correct': 1
            },
            {
                'question': 'Which method is used to remove an item from a list?',
                'options': ['delete()', 'remove()', 'pop()', 'Both B and C'],
                'correct': 3
            },
            {
                'question': 'What is the correct way to create a dictionary?',
                'options': ['dict = []', 'dict = ()', 'dict = {}', 'dict = ""'],
                'correct': 2
            },
            {
                'question': 'Which function is used to get user input?',
                'options': ['input()', 'get()', 'read()', 'scan()'],
                'correct': 0
            },
            {
                'question': 'What is the output of print("Hello" + "World")?',
                'options': ['Hello World', 'HelloWorld', 'Hello+World', 'Error'],
                'correct': 1
            },
            {
                'question': 'Which of these is the correct way to comment in Python?',
                'options': ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
                'correct': 2
            }
        ],
        'JavaScript': [
            {
                'question': 'Which method is used to add an element to an array?',
                'options': ['add()', 'append()', 'push()', 'insert()'],
                'correct': 2
            },
            {
                'question': 'What is the correct way to declare a variable?',
                'options': ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
                'correct': 0
            },
            {
                'question': 'Which operator is used for strict equality?',
                'options': ['==', '===', '=', '!='],
                'correct': 1
            },
            {
                'question': 'What does DOM stand for?',
                'options': ['Document Object Model', 'Data Object Management', 'Dynamic Object Model', 'Document Oriented Model'],
                'correct': 0
            },
            {
                'question': 'Which method is used to select an element by ID?',
                'options': ['getElementById()', 'selectById()', 'getElement()', 'findById()'],
                'correct': 0
            },
            {
                'question': 'What is the output of typeof null?',
                'options': ['null', 'undefined', 'object', 'boolean'],
                'correct': 2
            },
            {
                'question': 'Which keyword is used to define a function?',
                'options': ['function', 'def', 'func', 'method'],
                'correct': 0
            },
            {
                'question': 'What is the correct syntax for an if statement?',
                'options': ['if (condition) {}', 'if condition {}', 'if (condition) then {}', 'if condition then {}'],
                'correct': 0
            },
            {
                'question': 'Which method is used to convert a string to a number?',
                'options': ['parseInt()', 'toNumber()', 'convert()', 'number()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to create an object?',
                'options': ['var obj = [];', 'var obj = {};', 'var obj = ();', 'var obj = "";'],
                'correct': 1
            },
            {
                'question': 'Which event is triggered when a page loads?',
                'options': ['onload', 'onstart', 'onopen', 'onbegin'],
                'correct': 0
            },
            {
                'question': 'What is the output of 5 + "5"?',
                'options': ['10', '55', 'Error', 'NaN'],
                'correct': 1
            },
            {
                'question': 'Which method is used to remove the last element from an array?',
                'options': ['pop()', 'remove()', 'delete()', 'shift()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to write a JavaScript array?',
                'options': ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
                'correct': 2
            },
            {
                'question': 'Which statement is used to stop a loop?',
                'options': ['break', 'stop', 'exit', 'end'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to write a JavaScript comment?',
                'options': ['# This is a comment', '// This is a comment', '<!-- This is a comment -->', '/* This is a comment'],
                'correct': 1
            },
            {
                'question': 'Which method is used to join array elements into a string?',
                'options': ['join()', 'concat()', 'merge()', 'combine()'],
                'correct': 0
            },
            {
                'question': 'What is the output of Boolean(0)?',
                'options': ['true', 'false', '0', 'undefined'],
                'correct': 1
            },
            {
                'question': 'Which keyword is used to declare a constant?',
                'options': ['const', 'constant', 'final', 'static'],
                'correct': 0
            },
            {
                'question': 'What is the correct syntax for a for loop?',
                'options': ['for (i = 0; i <= 5; i++)', 'for i = 1 to 5', 'for (i <= 5; i++)', 'for (i = 0; i <= 5)'],
                'correct': 0
            }
        ],
        'Java': [
            {
                'question': 'Which keyword is used to define a class in Java?',
                'options': ['class', 'Class', 'define', 'object'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to declare a variable?',
                'options': ['int x = 5;', 'integer x = 5;', 'var x = 5;', 'number x = 5;'],
                'correct': 0
            },
            {
                'question': 'Which method is the entry point of a Java program?',
                'options': ['start()', 'main()', 'begin()', 'run()'],
                'correct': 1
            },
            {
                'question': 'What does JVM stand for?',
                'options': ['Java Virtual Machine', 'Java Variable Method', 'Java Visual Model', 'Java Version Manager'],
                'correct': 0
            },
            {
                'question': 'Which access modifier makes a member accessible only within the same class?',
                'options': ['public', 'private', 'protected', 'default'],
                'correct': 1
            },
            {
                'question': 'What is the output of System.out.println(5 + 3)?',
                'options': ['53', '8', 'Error', '5+3'],
                'correct': 1
            },
            {
                'question': 'Which keyword is used for inheritance?',
                'options': ['extends', 'inherits', 'implements', 'super'],
                'correct': 0
            },
            {
                'question': 'What is the correct syntax for a for loop?',
                'options': ['for (int i = 0; i < 10; i++)', 'for i in range(10)', 'for (i = 0; i < 10; i++)', 'for i = 0 to 10'],
                'correct': 0
            },
            {
                'question': 'Which method is used to get the length of a string?',
                'options': ['length()', 'size()', 'len()', 'count()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to create an array?',
                'options': ['int[] arr = new int[5];', 'int arr[] = new int[5];', 'Both A and B', 'int arr = new int[5];'],
                'correct': 2
            },
            {
                'question': 'Which keyword is used to handle exceptions?',
                'options': ['try', 'catch', 'finally', 'All of the above'],
                'correct': 3
            },
            {
                'question': 'What is the default value of a boolean variable?',
                'options': ['true', 'false', '0', 'null'],
                'correct': 1
            },
            {
                'question': 'Which operator is used for string concatenation?',
                'options': ['+', '&', 'concat', 'append'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to create an object?',
                'options': ['ClassName obj = new ClassName();', 'ClassName obj = ClassName();', 'obj = new ClassName();', 'new ClassName obj;'],
                'correct': 0
            },
            {
                'question': 'Which collection class allows duplicate elements?',
                'options': ['Set', 'List', 'Map', 'Queue'],
                'correct': 1
            },
            {
                'question': 'What is the output of "Hello".charAt(1)?',
                'options': ['H', 'e', 'l', '1'],
                'correct': 1
            },
            {
                'question': 'Which keyword is used to prevent inheritance?',
                'options': ['final', 'static', 'private', 'abstract'],
                'correct': 0
            },
            {
                'question': 'What is the correct syntax for an if statement?',
                'options': ['if (condition) {}', 'if condition {}', 'if (condition) then {}', 'if condition then {}'],
                'correct': 0
            },
            {
                'question': 'Which method is used to convert a string to integer?',
                'options': ['Integer.parseInt()', 'Integer.valueOf()', 'Both A and B', 'toInt()'],
                'correct': 2
            },
            {
                'question': 'What is the correct way to declare a constant?',
                'options': ['final int x = 5;', 'const int x = 5;', 'constant int x = 5;', 'static int x = 5;'],
                'correct': 0
            }
        ],
        'React': [
            {
                'question': 'What is JSX?',
                'options': ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'],
                'correct': 0
            },
            {
                'question': 'Which method is used to create a React component?',
                'options': ['React.createComponent()', 'React.Component', 'createReactClass()', 'Both B and C'],
                'correct': 3
            },
            {
                'question': 'What is the correct way to pass props?',
                'options': ['<Component prop="value" />', '<Component prop={value} />', 'Both A and B', '<Component prop=value />'],
                'correct': 2
            },
            {
                'question': 'Which hook is used to manage state?',
                'options': ['useState', 'useEffect', 'useContext', 'useReducer'],
                'correct': 0
            },
            {
                'question': 'What is the virtual DOM?',
                'options': ['A copy of the real DOM', 'A JavaScript representation of DOM', 'A faster DOM', 'All of the above'],
                'correct': 3
            },
            {
                'question': 'Which method is called after a component is mounted?',
                'options': ['componentDidMount', 'componentWillMount', 'componentDidUpdate', 'componentWillUpdate'],
                'correct': 0
            },
            {
                'question': 'What is the correct syntax for conditional rendering?',
                'options': ['{condition && <Component />}', '{condition ? <Component /> : null}', 'Both A and B', 'if(condition) <Component />'],
                'correct': 2
            },
            {
                'question': 'Which hook is used for side effects?',
                'options': ['useState', 'useEffect', 'useContext', 'useMemo'],
                'correct': 1
            },
            {
                'question': 'What is the correct way to handle events?',
                'options': ['onClick={handleClick}', 'onClick="handleClick()"', 'onClick={handleClick()}', 'onClick="handleClick"'],
                'correct': 0
            },
            {
                'question': 'Which method is used to update state?',
                'options': ['setState()', 'updateState()', 'changeState()', 'modifyState()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to create a functional component?',
                'options': ['function Component() {}', 'const Component = () => {}', 'Both A and B', 'class Component extends React.Component {}'],
                'correct': 2
            },
            {
                'question': 'Which prop is used to pass data to child components?',
                'options': ['props', 'data', 'params', 'attributes'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to import React?',
                'options': ['import React from "react"', 'import * as React from "react"', 'Both A and B', 'require("react")'],
                'correct': 2
            },
            {
                'question': 'Which method is used to render a component?',
                'options': ['render()', 'display()', 'show()', 'output()'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to use keys in lists?',
                'options': ['key="unique-id"', 'key={index}', 'key={item.id}', 'Both A and C'],
                'correct': 3
            },
            {
                'question': 'Which hook is used to optimize performance?',
                'options': ['useMemo', 'useCallback', 'Both A and B', 'useEffect'],
                'correct': 2
            },
            {
                'question': 'What is the correct way to handle forms?',
                'options': ['Controlled components', 'Uncontrolled components', 'Both A and B', 'Form components'],
                'correct': 2
            },
            {
                'question': 'Which method is called before a component is unmounted?',
                'options': ['componentWillUnmount', 'componentDidUnmount', 'componentWillDestroy', 'componentDidDestroy'],
                'correct': 0
            },
            {
                'question': 'What is the correct way to use CSS in React?',
                'options': ['className', 'class', 'style', 'Both A and C'],
                'correct': 3
            },
            {
                'question': 'Which tool is commonly used to create React apps?',
                'options': ['create-react-app', 'react-cli', 'react-generator', 'react-starter'],
                'correct': 0
            }
        ]
    }
    
    # Create quizzes for each course
    for course in courses:
        # Determine languages for this course
        course_languages = []
        for key, languages in languages_map.items():
            if key.lower() in course.title.lower():
                course_languages = languages
                break
        
        if not course_languages:
            # Default languages if no match found
            course_languages = ['General', 'Fundamentals', 'Advanced']
        
        # Create quizzes for each language
        for language in course_languages:
            # Check if quiz already exists
            if CourseQuiz.objects.filter(course=course, language=language).exists():
                print(f"Quiz already exists for {course.title} - {language}")
                continue
            
            # Create quiz
            quiz = CourseQuiz.objects.create(
                course=course,
                language=language,
                title=f"{course.title} - {language} Quiz",
                description=f"Test your knowledge of {language} concepts in {course.title}",
                total_questions=20,
                time_limit=30,
                passing_score=16
            )
            
            # Get sample questions for this language
            questions_data = sample_questions.get(language, sample_questions['Python'])
            
            # Create 20 questions
            for i, q_data in enumerate(questions_data):
                question = QuizQuestion.objects.create(
                    quiz=quiz,
                    question_text=q_data['question'],
                    question_type='mcq',
                    order=i + 1
                )
                
                # Create options
                for j, option_text in enumerate(q_data['options']):
                    QuizOption.objects.create(
                        question=question,
                        option_text=option_text,
                        is_correct=(j == q_data['correct']),
                        order=j + 1
                    )
            
            print(f"Created quiz: {quiz.title}")
    
    print("Sample quizzes created successfully!")

if __name__ == "__main__":
    create_sample_quizzes()