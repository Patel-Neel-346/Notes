/**
 * generate.js
 * ============================================================
 * Seed data generator for CMU 15-445 Modern SQL study notes.
 * Produces a ready-to-run SQL file with:
 *   - 1000 students
 *   - 20  courses
 *   - ~2000 enrollments (realistic distribution)
 *
 * Usage:
 *   node generate.js                    → writes seed.sql
 *   node generate.js --out custom.sql   → writes custom.sql
 *   node generate.js --dialect mysql    → MySQL-compatible output
 *   node generate.js --dialect sqlite   → SQLite-compatible output
 *
 * Supported dialects: postgres (default) | mysql | sqlite
 * ============================================================
 */

import { faker } from "@faker-js/faker";
import fs from "fs";

// ── CLI args ─────────────────────────────────────────────────
const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const dialectFlag = args.indexOf("--dialect");
const OUT_FILE = outFlag !== -1 ? args[outFlag + 1] : "seed.sql";
const DIALECT =
    dialectFlag !== -1 ? args[dialectFlag + 1].toLowerCase() : "postgres";

const VALID_DIALECTS = ["postgres", "mysql", "sqlite"];
if (!VALID_DIALECTS.includes(DIALECT)) {
    console.error(`Unknown dialect "${DIALECT}". Use: ${VALID_DIALECTS.join(" | ")}`);
    process.exit(1);
}

// ── Config ───────────────────────────────────────────────────
const NUM_STUDENTS = 1000;
const GRADES = ["A", "A", "A", "B", "B", "B", "C", "C", "D", "F"]; // weighted
const BATCH_SIZE = 100; // rows per INSERT statement

faker.seed(15445); // deterministic output

// ── Helpers ──────────────────────────────────────────────────
/** Escape a string value safely for SQL */
const esc = (str) => str.replace(/'/g, "''");

/** Chunk an array into groups of `size` */
const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );

/** Pick a random element from an array */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Random integer between min and max (inclusive) */
const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

/** Round to 2 decimal places */
const round2 = (n) => Math.round(n * 100) / 100;

// ── Dialect helpers ───────────────────────────────────────────
const dialect = {
    /** Comment block header */
    comment: (text) => `-- ${text}`,

    /** DROP TABLE IF EXISTS (all dialects support this) */
    dropTable: (name) => `DROP TABLE IF EXISTS ${name};`,

    /** Disable FK checks during inserts (avoids ordering issues) */
    disableFk: () => {
        if (DIALECT === "mysql") return "SET FOREIGN_KEY_CHECKS = 0;";
        if (DIALECT === "sqlite") return "PRAGMA foreign_keys = OFF;";
        return "-- PostgreSQL enforces FK order; tables inserted in correct order";
    },

    enableFk: () => {
        if (DIALECT === "mysql") return "SET FOREIGN_KEY_CHECKS = 1;";
        if (DIALECT === "sqlite") return "PRAGMA foreign_keys = ON;";
        return "";
    },

    /** Wrap in a transaction */
    beginTx: () => "BEGIN;",
    commitTx: () => "COMMIT;",
};

// ── Course catalogue ─────────────────────────────────────────
const COURSES = [
    { cid: "15-445", name: "Database Systems" },
    { cid: "15-721", name: "Advanced Database Systems" },
    { cid: "15-826", name: "Data Mining" },
    { cid: "15-799", name: "Special Topics in Databases" },
    { cid: "15-410", name: "Operating System Design" },
    { cid: "15-418", name: "Parallel Computer Architecture" },
    { cid: "15-440", name: "Distributed Systems" },
    { cid: "15-451", name: "Algorithm Design and Analysis" },
    { cid: "15-462", name: "Computer Graphics" },
    { cid: "15-464", name: "Technical Animation" },
    { cid: "15-513", name: "Introduction to Computer Systems" },
    { cid: "15-619", name: "Cloud Computing" },
    { cid: "15-650", name: "Algorithms and Advanced Data Structures" },
    { cid: "15-712", name: "Advanced Operating Systems" },
    { cid: "15-740", name: "Computer Architecture" },
    { cid: "17-313", name: "Foundations of Software Engineering" },
    { cid: "17-437", name: "Web Application Development" },
    { cid: "10-601", name: "Introduction to Machine Learning" },
    { cid: "10-701", name: "PhD Machine Learning" },
    { cid: "21-301", name: "Combinatorics" },
];

// ── Generate students ─────────────────────────────────────────
console.log(`Generating ${NUM_STUDENTS} students...`);

const usedLogins = new Set();
const students = [];

for (let i = 1; i <= NUM_STUDENTS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`.slice(0, 16);

    // Build a unique login: firstnamelastname@domain, truncated
    const domain = pick(["cs", "ece", "ml", "scs", "cmu"]);
    let baseLogin = `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
        /[^a-z]/g, ""
    );
    if (baseLogin.length > 20) baseLogin = baseLogin.slice(0, 20);
    let login = `${baseLogin}@${domain}`;
    // Deduplicate
    let suffix = 1;
    while (usedLogins.has(login)) {
        login = `${baseLogin}${suffix}@${domain}`;
        suffix++;
    }
    usedLogins.add(login);
    login = login.slice(0, 32);

    const age = randInt(18, 65);
    // GPA: normally distributed around 3.2, clamped to [0.0, 4.0]
    const raw = faker.number.float({ min: 0.0, max: 4.0, fractionDigits: 2 });
    const gpa = round2(Math.max(0, Math.min(4.0, raw)));

    students.push({ sid: i, name, login, age, gpa });
}

// ── Generate enrollments ─────────────────────────────────────
// Strategy: each student enrolls in 0–5 courses (weighted toward 1–3)
// Target ~2000 total enrollments across 1000 students
console.log("Generating enrollments...");

const enrollmentWeights = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5]; // 0 = some students take nothing
const enrollments = [];
const enrollmentSet = new Set(); // prevent duplicate (sid, cid) pairs

for (const student of students) {
    const numCourses = pick(enrollmentWeights);
    const shuffledCourses = [...COURSES].sort(() => Math.random() - 0.5);
    let enrolled = 0;

    for (const course of shuffledCourses) {
        if (enrolled >= numCourses) break;
        const key = `${student.sid}:${course.cid}`;
        if (!enrollmentSet.has(key)) {
            enrollmentSet.add(key);
            enrollments.push({
                sid: student.sid,
                cid: course.cid,
                grade: pick(GRADES),
            });
            enrolled++;
        }
    }
}

console.log(`  → ${enrollments.length} enrollments generated`);

// ── Build SQL output ─────────────────────────────────────────
console.log(`Building SQL (dialect: ${DIALECT})...`);

const lines = [];

const hdr = (text) => {
    const bar = "=".repeat(60);
    lines.push(`-- ${bar}`);
    lines.push(`-- ${text}`);
    lines.push(`-- ${bar}`);
};

// File header
hdr("CMU 15-445/645 Modern SQL — Study Seed Data");
lines.push(`-- Dialect  : ${DIALECT}`);
lines.push(`-- Students : ${NUM_STUDENTS}`);
lines.push(`-- Courses  : ${COURSES.length}`);
lines.push(`-- Enrollments: ${enrollments.length}`);
lines.push(`-- Generated: ${new Date().toISOString()}`);
lines.push(`-- Run this file against your local DB to practice all exercises.`);
lines.push("");

// Transaction + FK
lines.push(dialect.beginTx());
lines.push(dialect.disableFk());
lines.push("");

// ── DROP ─────────────────────────────────────────────────────
hdr("DROP existing tables (safe re-run)");
lines.push(dialect.dropTable("enrolled"));
lines.push(dialect.dropTable("student"));
lines.push(dialect.dropTable("course"));
lines.push("");

// ── CREATE ────────────────────────────────────────────────────
hdr("CREATE TABLE definitions");

if (DIALECT === "mysql") {
    lines.push(`CREATE TABLE student (
  sid   INT          PRIMARY KEY,
  name  VARCHAR(16)  NOT NULL,
  login VARCHAR(32)  NOT NULL UNIQUE,
  age   SMALLINT,
  gpa   DECIMAL(3,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    lines.push(`
CREATE TABLE course (
  cid  VARCHAR(32)  PRIMARY KEY,
  name VARCHAR(64)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    lines.push(`
CREATE TABLE enrolled (
  sid   INT         NOT NULL,
  cid   VARCHAR(32) NOT NULL,
  grade CHAR(1),
  PRIMARY KEY (sid, cid),
  FOREIGN KEY (sid) REFERENCES student(sid) ON DELETE CASCADE,
  FOREIGN KEY (cid) REFERENCES course(cid)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

} else if (DIALECT === "sqlite") {
    lines.push(`CREATE TABLE student (
  sid   INTEGER PRIMARY KEY,
  name  TEXT    NOT NULL,
  login TEXT    NOT NULL UNIQUE,
  age   INTEGER,
  gpa   REAL
);`);

    lines.push(`
CREATE TABLE course (
  cid  TEXT PRIMARY KEY,
  name TEXT NOT NULL
);`);

    lines.push(`
CREATE TABLE enrolled (
  sid   INTEGER NOT NULL REFERENCES student(sid),
  cid   TEXT    NOT NULL REFERENCES course(cid),
  grade TEXT,
  PRIMARY KEY (sid, cid)
);`);

} else {
    // PostgreSQL (default)
    lines.push(`CREATE TABLE student (
  sid   INT          PRIMARY KEY,
  name  VARCHAR(16)  NOT NULL,
  login VARCHAR(32)  NOT NULL UNIQUE,
  age   SMALLINT,
  gpa   FLOAT
);`);

    lines.push(`
CREATE TABLE course (
  cid  VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);`);

    lines.push(`
CREATE TABLE enrolled (
  sid   INT         NOT NULL REFERENCES student(sid),
  cid   VARCHAR(32) NOT NULL REFERENCES course(cid),
  grade CHAR(1),
  PRIMARY KEY (sid, cid)
);`);
}

lines.push("");

// ── INSERT courses ─────────────────────────────────────────────
hdr(`INSERT ${COURSES.length} courses`);
const courseValueRows = COURSES.map(
    (c) => `  ('${esc(c.cid)}', '${esc(c.name)}')`
);
lines.push(`INSERT INTO course (cid, name) VALUES`);
lines.push(courseValueRows.join(",\n") + ";");
lines.push("");

// ── INSERT students (batched) ─────────────────────────────────
hdr(`INSERT ${students.length} students (batches of ${BATCH_SIZE})`);
const studentBatches = chunk(students, BATCH_SIZE);
for (const batch of studentBatches) {
    const vals = batch.map(
        (s) =>
            `  (${s.sid}, '${esc(s.name)}', '${esc(s.login)}', ${s.age}, ${s.gpa})`
    );
    lines.push(`INSERT INTO student (sid, name, login, age, gpa) VALUES`);
    lines.push(vals.join(",\n") + ";");
}
lines.push("");

// ── INSERT enrollments (batched) ──────────────────────────────
hdr(`INSERT ${enrollments.length} enrollments (batches of ${BATCH_SIZE})`);
const enrollBatches = chunk(enrollments, BATCH_SIZE);
for (const batch of enrollBatches) {
    const vals = batch.map(
        (e) => `  (${e.sid}, '${esc(e.cid)}', '${esc(e.grade)}')`
    );
    lines.push(`INSERT INTO enrolled (sid, cid, grade) VALUES`);
    lines.push(vals.join(",\n") + ";");
}
lines.push("");

// ── Re-enable FK + commit ─────────────────────────────────────
const fkOn = dialect.enableFk();
if (fkOn) lines.push(fkOn);
lines.push(dialect.commitTx());
lines.push("");

// ── Quick sanity-check queries at the bottom ──────────────────
hdr("Quick sanity checks — run these after seeding");
lines.push(`-- Row counts (expect: student=1000, course=${COURSES.length}, enrolled≈${enrollments.length})`);
lines.push(`SELECT 'student'  AS tbl, COUNT(*) AS cnt FROM student`);
lines.push(`UNION ALL`);
lines.push(`SELECT 'course'   AS tbl, COUNT(*) AS cnt FROM course`);
lines.push(`UNION ALL`);
lines.push(`SELECT 'enrolled' AS tbl, COUNT(*) AS cnt FROM enrolled;`);
lines.push("");
lines.push(`-- GPA distribution`);
lines.push(`SELECT ROUND(gpa) AS gpa_bucket, COUNT(*) AS students`);
lines.push(`FROM student GROUP BY ROUND(gpa) ORDER BY gpa_bucket;`);
lines.push("");
lines.push(`-- Top 5 most enrolled courses`);
lines.push(`SELECT c.name, COUNT(*) AS enrolled`);
lines.push(`FROM enrolled AS e JOIN course AS c ON e.cid = c.cid`);
lines.push(`GROUP BY c.name ORDER BY enrolled DESC`);
if (DIALECT === "mysql") lines.push(`LIMIT 5;`);
else lines.push(`FETCH FIRST 5 ROWS ONLY;`);

// ── Write file ────────────────────────────────────────────────
const sql = lines.join("\n");
fs.writeFileSync(OUT_FILE, sql, "utf-8");

const stats = fs.statSync(OUT_FILE);
const kb = (stats.size / 1024).toFixed(1);

console.log(`\n✅  Done!`);
console.log(`   File    : ${OUT_FILE}`);
console.log(`   Size    : ${kb} KB`);
console.log(`   Students: ${students.length}`);
console.log(`   Courses : ${COURSES.length}`);
console.log(`   Enrolls : ${enrollments.length}`);
console.log(`\nUsage examples:`);
console.log(`   psql -d mydb -f ${OUT_FILE}`);
console.log(`   mysql -u root -p mydb < ${OUT_FILE}`);
console.log(`   sqlite3 study.db < ${OUT_FILE}`);