import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Create admin user ─────────────────────────────────────────────────────
  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@examhub.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@examhub.com",
      password: hashedAdmin,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ── Exam 1: Python Fundamentals ───────────────────────────────────────────
  const python = await prisma.exam.upsert({
    where: { id: "exam-python-fundamentals" },
    update: {},
    create: {
      id: "exam-python-fundamentals",
      title: "Python Fundamentals",
      duration: 30,
      published: true,
      createdBy: admin.id,
      questions: {
        create: [
          {
            type: "MCQ",
            text: "Which keyword is used to define a function in Python?",
            options: JSON.stringify(["func", "def", "function", "lambda"]),
            correctAnswer: "def",
            points: 2,
          },
          {
            type: "MCQ",
            text: "What is the output of: print(type([]))?",
            options: JSON.stringify(["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "list"]),
            correctAnswer: "<class 'list'>",
            points: 2,
          },
          {
            type: "MCQ",
            text: "Which of these is NOT a valid Python data type?",
            options: JSON.stringify(["int", "float", "char", "bool"]),
            correctAnswer: "char",
            points: 2,
          },
          {
            type: "SHORT",
            text: "Explain the difference between a list and a tuple in Python.",
            options: null,
            correctAnswer: "list is mutable tuple is immutable",
            points: 3,
          },
          {
            type: "CODE",
            text: "Write a Python function `fibonacci(n)` that returns the nth Fibonacci number.",
            options: null,
            correctAnswer: "55",
            points: 5,
          },
        ],
      },
    },
  });
  console.log("✅ Exam created:", python.title);

  // ── Exam 2: Java OOP ──────────────────────────────────────────────────────
  const java = await prisma.exam.upsert({
    where: { id: "exam-java-oop" },
    update: {},
    create: {
      id: "exam-java-oop",
      title: "Java OOP Concepts",
      duration: 45,
      published: true,
      createdBy: admin.id,
      questions: {
        create: [
          {
            type: "MCQ",
            text: "Which concept of OOP allows a class to inherit properties from another class?",
            options: JSON.stringify(["Polymorphism", "Encapsulation", "Inheritance", "Abstraction"]),
            correctAnswer: "Inheritance",
            points: 2,
          },
          {
            type: "MCQ",
            text: "What is the default access modifier in Java?",
            options: JSON.stringify(["public", "private", "protected", "package-private"]),
            correctAnswer: "package-private",
            points: 2,
          },
          {
            type: "MCQ",
            text: "Which keyword is used to prevent a class from being subclassed in Java?",
            options: JSON.stringify(["static", "final", "abstract", "sealed"]),
            correctAnswer: "final",
            points: 2,
          },
          {
            type: "MCQ",
            text: "What does the 'super' keyword refer to in Java?",
            options: JSON.stringify([
              "The current class instance",
              "The parent class",
              "A static method",
              "The interface",
            ]),
            correctAnswer: "The parent class",
            points: 2,
          },
          {
            type: "SHORT",
            text: "What is method overloading? Give an example use case.",
            options: null,
            correctAnswer: "same method name different parameters",
            points: 4,
          },
          {
            type: "CODE",
            text: "Write a Java class `Animal` with a method `speak()` and a subclass `Dog` that overrides it to print 'Woof!'.",
            options: null,
            correctAnswer: "Woof!",
            points: 6,
          },
        ],
      },
    },
  });
  console.log("✅ Exam created:", java.title);

  // ── Exam 3: Data Structures & Algorithms ─────────────────────────────────
  const dsa = await prisma.exam.upsert({
    where: { id: "exam-dsa-basics" },
    update: {},
    create: {
      id: "exam-dsa-basics",
      title: "Data Structures & Algorithms",
      duration: 60,
      published: true,
      createdBy: admin.id,
      questions: {
        create: [
          {
            type: "MCQ",
            text: "What is the time complexity of binary search?",
            options: JSON.stringify(["O(n)", "O(n²)", "O(log n)", "O(1)"]),
            correctAnswer: "O(log n)",
            points: 2,
          },
          {
            type: "MCQ",
            text: "Which data structure uses LIFO order?",
            options: JSON.stringify(["Queue", "Stack", "Linked List", "Heap"]),
            correctAnswer: "Stack",
            points: 2,
          },
          {
            type: "MCQ",
            text: "What is the worst-case time complexity of QuickSort?",
            options: JSON.stringify(["O(n log n)", "O(n)", "O(n²)", "O(log n)"]),
            correctAnswer: "O(n²)",
            points: 2,
          },
          {
            type: "MCQ",
            text: "A Graph with no cycles is called a:",
            options: JSON.stringify(["Complete Graph", "Bipartite Graph", "Tree", "DAG"]),
            correctAnswer: "Tree",
            points: 2,
          },
          {
            type: "SHORT",
            text: "Explain the difference between BFS and DFS traversal.",
            options: null,
            correctAnswer: "BFS uses queue level by level DFS uses stack depth first",
            points: 4,
          },
          {
            type: "CODE",
            text: "Write a function `is_palindrome(s)` in Python that returns True if string s is a palindrome, False otherwise.",
            options: null,
            correctAnswer: "True",
            points: 5,
          },
        ],
      },
    },
  });
  console.log("✅ Exam created:", dsa.title);

  // ── Exam 4: Web Development Basics ───────────────────────────────────────
  const web = await prisma.exam.upsert({
    where: { id: "exam-web-dev-basics" },
    update: {},
    create: {
      id: "exam-web-dev-basics",
      title: "Web Development Basics",
      duration: 25,
      published: true,
      createdBy: admin.id,
      questions: {
        create: [
          {
            type: "MCQ",
            text: "Which HTML tag is used to link a CSS file?",
            options: JSON.stringify(["<style>", "<link>", "<script>", "<css>"]),
            correctAnswer: "<link>",
            points: 1,
          },
          {
            type: "MCQ",
            text: "What does CSS stand for?",
            options: JSON.stringify([
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style System",
              "Custom Styling Script",
            ]),
            correctAnswer: "Cascading Style Sheets",
            points: 1,
          },
          {
            type: "MCQ",
            text: "Which JavaScript method is used to fetch data from an API?",
            options: JSON.stringify(["get()", "fetch()", "request()", "http()"]),
            correctAnswer: "fetch()",
            points: 1,
          },
          {
            type: "SHORT",
            text: "Explain what REST API means and list 3 common HTTP methods.",
            options: null,
            correctAnswer: "Representational State Transfer GET POST PUT DELETE",
            points: 3,
          },
        ],
      },
    },
  });
  console.log("✅ Exam created:", web.title);

  // ── Exam 5: SQL & Databases ───────────────────────────────────────────────
  const sql = await prisma.exam.upsert({
    where: { id: "exam-sql-databases" },
    update: {},
    create: {
      id: "exam-sql-databases",
      title: "SQL & Databases",
      duration: 40,
      published: true,
      createdBy: admin.id,
      questions: {
        create: [
          {
            type: "MCQ",
            text: "Which SQL clause is used to filter results?",
            options: JSON.stringify(["ORDER BY", "GROUP BY", "WHERE", "HAVING"]),
            correctAnswer: "WHERE",
            points: 2,
          },
          {
            type: "MCQ",
            text: "What does PRIMARY KEY ensure in a database table?",
            options: JSON.stringify([
              "Allows duplicate values",
              "Uniquely identifies each row",
              "Links two tables",
              "Makes the column required",
            ]),
            correctAnswer: "Uniquely identifies each row",
            points: 2,
          },
          {
            type: "MCQ",
            text: "Which JOIN returns all rows from both tables even when there's no match?",
            options: JSON.stringify(["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]),
            correctAnswer: "FULL OUTER JOIN",
            points: 2,
          },
          {
            type: "SHORT",
            text: "What is the difference between DELETE and TRUNCATE in SQL?",
            options: null,
            correctAnswer: "DELETE removes rows one by one with WHERE TRUNCATE removes all rows faster",
            points: 3,
          },
          {
            type: "CODE",
            text: "Write a SQL query to find the second highest salary from an `employees` table.",
            options: null,
            correctAnswer: "second highest salary",
            points: 5,
          },
        ],
      },
    },
  });
  console.log("✅ Exam created:", sql.title);

  // ── Create attempts for ALL existing students ─────────────────────────────
  const allStudents = await prisma.user.findMany({ where: { role: "STUDENT" } });
  
  for (const stu of allStudents) {
    console.log(`📡 Seeding for student: ${stu.email}`);
    
    async function seedForUser(examId: string, score: number, minutes: number) {
      const old = await prisma.attempt.findMany({ where: { userId: stu.id, examId } });
      for (const a of old) {
        await prisma.answer.deleteMany({ where: { attemptId: a.id } });
      }
      await prisma.attempt.deleteMany({ where: { userId: stu.id, examId } });
      
      const start = new Date(Date.now() - minutes * 60 * 1000 - 86400000);
      const end = new Date(start.getTime() + minutes * 60 * 1000);
      
      await prisma.attempt.create({
        data: {
          userId: stu.id,
          examId,
          score,
          startTime: start,
          endTime: end,
          submitted: true,
        },
      });
    }

    await seedForUser("exam-python-fundamentals", 88, 25);
    await seedForUser("exam-java-oop", 76, 40);
    await seedForUser("exam-sql-databases", 94, 30);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("────────────────────────────────");
  console.log("Admin   → admin@examhub.com  / admin123");
  console.log("Students now have 3 completed exams in 'Exams Taken'");
  console.log("────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
