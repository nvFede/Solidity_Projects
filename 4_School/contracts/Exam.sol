// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExamFactory {
    address[] public deployedExams;

    mapping(address => bool) public authorizedCreators;

    modifier onlyAuthorized() {
        require(
            authorizedCreators[msg.sender],
            "You are not authorized to create exams."
        );
        _;
    }

    uint public maxExams = 100;

    function createExam(string memory questions) public onlyAuthorized {
        require(
            deployedExams.length < maxExams,
            "Maximum number of exams reached."
        );
        address newExam = address(new Exam(questions));
        deployedExams.push(newExam);
    }
}

contract Exam {
    struct ExamData {
        address student;
        address teacher;
        string questions;
        string answers;
        bool evaluated;
        bool submitted;
        bool gradeFinalized;
        uint grade;
    }

    enum Role {
        Student,
        Teacher
    }

    mapping(address => Role) public roles;

    ExamData public examData;

    event NewExam(address student);
    event ExamEvaluated(uint grade);

    constructor(string memory questions) {
        examData.student = msg.sender;
        examData.questions = questions;
        examData.answers = "";
        examData.evaluated = false;
        emit NewExam(msg.sender);
    }

    function validateAnswers(
        string memory answers
    ) internal view returns (bool) {
        // implement validation logic here
        // example: check if answers contain only alphanumeric characters
       
        return true;
    }

    function submitAnswers(string memory answers) public {
        require(
            examData.student != msg.sender,
            "You have already taken this exam."
        );
        require(!examData.evaluated, "This exam has already been evaluated.");
        require(!examData.submitted, "This exam has already been submitted.");
        require(
            validateAnswers(answers),
            "Answers are not in the correct format."
        );

        examData.answers = answers;
        examData.submitted = true;
    }

    function evaluateExam(address student, uint grade) public {
        require(
            roles[msg.sender] == Role.Teacher && examData.teacher == msg.sender,
            "You are not authorized to grade this exam."
        );
        require(
            examData.student == student,
            "This exam does not belong to the student you are trying to evaluate."
        );
        require(!examData.evaluated, "This exam has already been evaluated.");
        require(examData.submitted, "This exam has not been submitted yet.");
        require(
            !examData.gradeFinalized,
            "This student has already been graded."
        );
        require(grade <= 100 && grade >= 0, "Invalid grade.");

        examData.grade = grade;
        examData.evaluated = true;
        examData.gradeFinalized = true;
        emit ExamEvaluated(grade);
    }

    mapping(address => bool) teachers;

    function isTeacher() public view returns (bool) {
        return teachers[msg.sender];
    }
}
