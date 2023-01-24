<h1>ExamFactory and Exam Smart Contracts</h1>
This is a set of smart contracts for creating and managing exams on the Ethereum blockchain.
<h2>ExamFactory Contract</h2>
The ExamFactory contract is the main contract for creating and managing exams. It has the following functionality:
<ul><li>deploys new Exam contracts</li><li>keeps track of all deployed Exam contracts</li><li>creates a mapping of authorized exam creators</li><li>allows the owner to add/remove authorized exam creators</li><li>allows the owner to change the contract owner</li></ul><h2>Exam Contract</h2>
The Exam contract is the contract for creating and managing individual exams. It has the following functionality:
<ul><li>stores exam data such as questions, answers, and grade</li><li>validates answers</li><li>allows students to submit answers</li><li>allows teachers to evaluate exams</li><li>emits events when a new exam is created and when an exam is evaluated</li></ul><h2>Roles</h2>
The Exam contract has two roles: Student and Teacher. A student is the person who takes the exam, and a teacher is the person who evaluates the exam. The Exam contract uses a mapping to keep track of the role of each address.
<h2>Events</h2>
The Exam contract emits events when a new exam is created and when an exam is evaluated. These events can be used to trigger other functionality in your application.