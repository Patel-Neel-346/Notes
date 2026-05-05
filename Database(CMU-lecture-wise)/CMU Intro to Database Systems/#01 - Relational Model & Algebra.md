DATABASE
Organized collection of inter-related data that models
some aspect of the real-world.
Databases are the core component of most computer
applications.
15
DATABASE SYSTEMS (FALL 2025)
DATABASE EXAMPLE
Create a database that models a digital music store to
keep track of artists and albums.
Information we need to keep track of in our store:
→ Information about Artists
→ The Albums those Artists released
16
DATABASE SYSTEMS (FALL 2025)
FLAT FILE STRAWMAN
Store our database as comma-separated value (CSV)
files that we manage ourselves in application code.
→ Use a separate file per entity.
→ The application must parse the files each time they want to
read/update records.
17
"Enter the Wu-Tang","Wu-Tang Clan",1993
"St.Ides Mix Tape","Wu-Tang Clan",1994
"Liquid Swords","GZA",1990
Album(name, artist, year)
"Wu-Tang Clan",1992,"USA"
"Notorious BIG",1992,"USA"
"GZA",1990,"USA"
Artist(name, year, country)
DATABASE SYSTEMS (FALL 2025)
FLAT FILE STRAWMAN
Example: Get the year that GZA went solo.
18
for line in file.readlines():
 record = parse(line)
 if record[0] == "GZA":
 print(int(record[1]))
"Wu-Tang Clan",1992,"USA"
"Notorious BIG",1992,"USA"
"GZA",1990,"USA"
Artist(name, year, country)
DATABASE SYSTEMS (FALL 2025)
FLAT FILES: DATA INTEGRITY
How do we ensure that the artist is the same for each
album entry?
What if somebody overwrites the album year with an
invalid string?
What if there are multiple artists on an album?
What happens if we delete an artist that has albums?
19
DATABASE SYSTEMS (FALL 2025)
FLAT FILES: IMPLEMENTATION
How do you find a particular record?
What if we now want to create a new application that
uses the same database? What if that application is
running on a different machine?
What if two threads try to write to the same file at the
same time?
20
DATABASE SYSTEMS (FALL 2025)
FLAT FILES: DURABILITY
What if the machine crashes while our program is
updating a record?
What if we want to replicate the database on multiple
machines for high availability?
21
DATABASE SYSTEMS (FALL 2025)
FLAT FILES: DURABILITY
What if the machine crashes while our program is
updating a record?
What if we want to replicate the database on multiple
machines for high availability?
21

DATABASE SYSTEMS (FALL 2025)
DATABASE MANAGEMENT SYSTEM
A database management system (DBMS) is software
that allows applications to store and analyze
information in a database.
A general-purpose DBMS supports the definition,
creation, querying, update, and administration of
databases in accordance with some data model.
22
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
A data model is a collection of concepts for describing
the data in a database.
→ Rules that define the types of things that could exist and how
they relate.
A schema is a description of a particular collection of
data, using a given data model.
→ This defines the structure of database for a data model.
→ Otherwise, you have random bits with no meaning.
23
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
A data model is a collection of concepts for describing
the data in a database.
→ Rules that define the types of things that could exist and how
they relate.
A schema is a description of a particular collection of
data, using a given data model.
→ This defines the structure of database for a data model.
→ Otherwise, you have random bits with no meaning.
23
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
24
←
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
10
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
10
11
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
10
11
12
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
PROCEDURE GET_ARTISTS_FOR_ALBUM;
BEGIN
 /* Declare variables */
 DECLARE ARTIST_RECORD ARTIST;
 DECLARE APPEARS_RECORD APPEARS;
 DECLARE ALBUM_RECORD ALBUM;
 /* Start navigation */
 FIND ALBUM USING ALBUM.NAME = "Mooshoo Tribute"
 ON ERROR DISPLAY "Album not found" AND EXIT;
 /* For each appearance on the album */
 FIND FIRST APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
 ON ERROR DISPLAY "No artists found for this album" AND EXIT;
 /* Loop through the set of APPEARS */
 REPEAT
 /* Navigate to the corresponding artist */
 FIND OWNER WITHIN ARTIST_APPEARS OF APPEARS_RECORD
 ON ERROR DISPLAY "Error finding artist";
 /* Display artist name */
 DISPLAY ARTIST_RECORD.NAME;
 /* Move to the next APPEARS record in the set */
 FIND NEXT APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
 ON ERROR EXIT;
 END REPEAT;
END PROCEDURE;
Retrieve the names of artists that appear
on the DJ Mooshoo Tribute mixtape.
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
PROCEDURE GET_ARTISTS_FOR_ALBUM;
BEGIN
 /* Declare variables */
 DECLARE ARTIST_RECORD ARTIST;
 DECLARE APPEARS_RECORD APPEARS;
 DECLARE ALBUM_RECORD ALBUM;
 /* Start navigation */
 FIND ALBUM USING ALBUM.NAME = "Mooshoo Tribute"
 ON ERROR DISPLAY "Album not found" AND EXIT;
 /* For each appearance on the album */
 FIND FIRST APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
 ON ERROR DISPLAY "No artists found for this album" AND EXIT;
 /* Loop through the set of APPEARS */
 REPEAT
 /* Navigate to the corresponding artist */
 FIND OWNER WITHIN ARTIST_APPEARS OF APPEARS_RECORD
 ON ERROR DISPLAY "Error finding artist";
 /* Display artist name */
 DISPLAY ARTIST_RECORD.NAME;
 /* Move to the next APPEARS record in the set */
 FIND NEXT APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
 ON ERROR EXIT;
 END REPEAT;
END PROCEDURE;
Retrieve the names of artists that appear
on the DJ Mooshoo Tribute mixtape.
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
IDS IMS CODASYL
In the late 1960s, early DBMSs
required developers to write queries
using procedural code.
→ Examples: IDS, IMS, CODASYL
The developer had to choose access
paths and execution ordering based
on the current database contents.
→ If the database changes, then the
developer must rewrite the query code.
25
Retrieve the names of artists that appear
on the DJ Mooshoo Tribute mixtape.
SELECT ARTIST.NAME
 FROM ARTIST, APPEARS, ALBUM
WHERE ARTIST.ID=APPEARS.ARTIST_ID
 AND APPEARS.ALBUM_ID=ALBUM.ID
 AND ALBUM.NAME="Mooshoo Tribute"
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
ACM SIGFIDET Workshop on Data
Description, Access, and Control in Ann
Arbor, Michigan, held 1–3 May 1974
The Differences and Similarities
Between the Data Base Set and
Relational Views of Data.
→ ACM SIGFIDET Workshop on Data
Description, Access, and Control in Ann
Arbor, Michigan, held 1–3 May 1974
26
Codd
DATABASE SYSTEMS (FALL 2025)
EARLY DATABASE SYSTEMS
ACM SIGFIDET Workshop on Data
Description, Access, and Control in Ann
Arbor, Michigan, held 1–3 May 1974
The Differences and Similarities
Between the Data Base Set and
Relational Views of Data.
→ ACM SIGFIDET Workshop on Data
Description, Access, and Control in Ann
Arbor, Michigan, held 1–3 May 1974
26
Codd
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL
Structure: The definition of the
database's relations and their contents
independent of their physical
representation.
Integrity: Ensure the database’s
contents satisfy constraints.
Manipulation: Declarative API for
accessing and modifying a database's
contents via relations (sets).
8
DATABASE SYSTEMS (FALL 2025)
DATA INDEPENDENCE
Isolate the user/application from lowlevel data representation.
→ The user only worries about high-level
application logic.
DBMS optimizes the layout according
to operating environment, database
contents, and workload.
→ Re-optimize if/when these factors
changes.
28
Pages, Files, Extents…
Database
Storage
Physical Schema
Logical Schema
Schema, Constraints…
(SQL)
External Schema External Schema
Views (SQL)
Application Application
DATABASE SYSTEMS (FALL 2025)
DATA INDEPENDENCE
Isolate the user/application from lowlevel data representation.
→ The user only worries about high-level
application logic.
DBMS optimizes the layout according
to operating environment, database
contents, and workload.
→ Re-optimize if/when these factors
changes.
28
Pages, Files, Extents…
Database
Storage
Physical Schema
Logical Schema
Schema, Constraints…
(SQL)
External Schema External Schema
Views (SQL)
Application Application
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL
A relation is an unordered set that
contain the relationship of attributes
that represent entities.
A tuple is a set of attribute values
(aka its domain) in the relation.
→ Values are (normally) atomic/scalar.
→ The special value NULL is a member of
every domain (if allowed).
29
Artist(name, year, country)
name year country
Wu-Tang Clan 1992 USA
Notorious BIG 1992 USA
GZA 1990 USA
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: PRIMARY KEYS
identity column
A relation's primary key uniquely
identifies a single tuple.
Some DBMSs automatically create an
internal primary key if a table does
not define one.
DBMS can auto-generation unique
primary keys via an identity column:
→ IDENTITY (SQL Standard)
→ SEQUENCE (PostgreSQL / Oracle)
→ AUTO_INCREMENT (MySQL)
30
Artist(name, year, country)
name year country
Wu-Tang Clan 1992 USA
Notorious BIG 1992 USA
GZA 1990 USA
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: PRIMARY KEYS
identity column
A relation's primary key uniquely
identifies a single tuple.
Some DBMSs automatically create an
internal primary key if a table does
not define one.
DBMS can auto-generation unique
primary keys via an identity column:
→ IDENTITY (SQL Standard)
→ SEQUENCE (PostgreSQL / Oracle)
→ AUTO_INCREMENT (MySQL)
30
Artist(id, name, year, country)
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: FOREIGN KEYS
A foreign key specifies that an
attribute from one relation maps to a
tuple in another relation.
31
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: FOREIGN KEYS



31
Album(id, name, artist, year)
Enter the Wu-Tang
St.Ides Mix Tape
Liquid Swords
id name artist year
11 Enter the Wu-Tang 101 1993
22 St.Ides Mix Tape ??? 1994
33 Liquid Swords 103 1995
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
Artist(id, name, year, country)
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: FOREIGN KEYS



31
Album(id, name, artist, year)
Enter the Wu-Tang
St.Ides Mix Tape
Liquid Swords
id name artist year
11 Enter the Wu-Tang 101 1993
22 St.Ides Mix Tape ??? 1994
33 Liquid Swords 103 1995
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
ArtistAlbum(artist_id, album_id)
artist_id album_id
101 11
101 22
103 22
102 22
Artist(id, name, year, country)
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: FOREIGN KEYS



31
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
ArtistAlbum(artist_id, album_id)
artist_id album_id
101 11
101 22
103 22
102 22
Album(id, name, year)
Enter the Wu-Tang
St.Ides Mix Tape
Liquid Swords
id name year
11 Enter the Wu-Tang 1993
22 St.Ides Mix Tape 1994
33 Liquid Swords 1995
Artist(id, name, year, country)
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: CONSTRAINTS
User-defined conditions that must
hold for any instance of the database.
→ Can validate data within a single tuple
or across entire relation(s).
→ DBMS prevents modifications that
violate any constraint.
Unique key and referential (fkey)
constraints are the most common.
SQL:92 supports global asserts but
these are rarely used (too slow).
32
Artist(id, name, year, country)
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
CREATE TABLE Artist (
name VARCHAR NOT NULL,
year INT,
country CHAR(60),
CHECK (year > 1900)
);
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: CONSTRAINTS
User-defined conditions that must
hold for any instance of the database.
→ Can validate data within a single tuple
or across entire relation(s).
→ DBMS prevents modifications that
violate any constraint.
Unique key and referential (fkey)
constraints are the most common.
SQL:92 supports global asserts but
these are rarely used (too slow).
32
Artist(id, name, year, country)
id name year country
101 Wu-Tang Clan 1992 USA
102 Notorious BIG 1992 USA
103 GZA 1990 USA
CREATE TABLE Artist (
name VARCHAR NOT NULL,
year INT,
country CHAR(60),
CHECK (year > 1900)
);
CREATE ASSERTION myAssert
CHECK ( <SQL> );
DATABASE SYSTEMS (FALL 2025)
DATA MANIPULATION LANGUAGES (DML)
The API that a DBMS exposes to applications to store
and retrieve information from a database.
Procedural:
→ The query specifies the (high-level) strategy to find
the desired result based on sets / bags.
Non-Procedural (Declarative):
→ The query specifies only what data is wanted and
not how to find it.
33
←
←
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA
Fundamental operations to retrieve
and manipulate tuples in a relation.
→ Based on set algebra (unordered lists with
no duplicates).
Each operator takes one or more
relations as its inputs and outputs a
new relation.
→ We can "chain" operators together to
create more complex operations.
34
σ
π
∪
∩
–
×
⋈
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: SELECT
Choose a subset of the tuples in a
relation satisfying selection predicate.
→ Predicate acts as a filter to retain only
tuples that fulfill its qualifying
requirement.
→ Can combine multiple predicates using
conjunctions / disjunctions.
Syntax: σpredicate(R)
35
σa_id='a2'∧ b_id>102(R)
a_id b_id
a1 101
a2 102
a2 103
a3 104
R(a_id,b_id)
a_id b_id
a2 103
σa_id='a2'(R)
a_id b_id
a2 102
a2 103
SELECT * FROM R
WHERE a_id='a2' AND b_id>102;
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: SELECT
Choose a subset of the tuples in a
relation satisfying selection predicate.
→ Predicate acts as a filter to retain only
tuples that fulfill its qualifying
requirement.
→ Can combine multiple predicates using
conjunctions / disjunctions.
Syntax: σpredicate(R)
35
σa_id='a2'∧ b_id>102(R)
a_id b_id
a1 101
a2 102
a2 103
a3 104
R(a_id,b_id)
a_id b_id
a2 103
σa_id='a2'(R)
a_id b_id
a2 102
a2 103
SELECT * FROM R
WHERE a_id='a2' AND b_id>102;
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: PROJECTION
Generate a relation with tuples that
contains only the specified attributes.
→ Rearrange attributes’ ordering.
→ Remove unwanted attributes.
→ Manipulate values to create derived
attributes.
Syntax: ΠA1,A2,…,An(R)
36
Πb_id-100,a_id(σa_id='a2'(R))
a_id b_id
a1 101
a2 102
a2 103
a3 104
R(a_id,b_id)
b_id-100 a_id
2 a2
3 a2
SELECT b_id-100, a_id
 FROM R WHERE a_id = 'a2';
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: UNION
Generate a relation that contains all
tuples that appear in either only one
or both input relations, eliminating
duplicates.
→ Both relations must have the same
attributes (based on names).
Syntax: (R ∪ S)
37
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id)
a_id b_id
a3 103
a4 104
a5 105
(R ∪ S)
a_id b_id
a1 101
a2 102
a3 103
a4 104
a5 105
(SELECT * FROM R)
UNION
(SELECT * FROM S);
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: INTERSECTION
Generate a relation that contains only
the tuples that appear in both input
relations.
→ Both relations must have the same
attributes (based on names).
Syntax: (R ∩ S)
38
(R ∩ S)
a_id b_id
a3 103
(SELECT * FROM R)
INTERSECT
(SELECT * FROM S);
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id)
a_id b_id
a3 103
a4 104
a5 105
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: DIFFERENCE
Generate a relation that contains only
the tuples that appear in the first and
not the second of the input relations.
→ Both relations must have the same
attributes (based on names).
Syntax: (R – S)
39
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id)
a_id b_id
a3 103
a4 104
a5 105
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: DIFFERENCE
Generate a relation that contains only
the tuples that appear in the first and
not the second of the input relations.
→ Both relations must have the same
attributes (based on names).
Syntax: (R – S)
39
(R – S)
a_id b_id
a1 101
a2 102
(SELECT * FROM R)
EXCEPT
(SELECT * FROM S);
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id)
a_id b_id
a3 103
a4 104
a5 105
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: PRODUCT
Generate a relation that contains all
possible combinations of tuples from
the input relations.
→ Input relations do not have to have the
same attributes.
→ Output includes all the attributes from the
input relations.
Syntax: (R × S)
40
(R × S)
R.a_id R.b_id S.a_id S.b_id
a1 101 a3 103
a1 101 a4 104
a1 101 a5 105
a2 102 a3 103
a2 102 a4 104
a2 102 a5 105
a3 103 a3 103
a3 103 a4 104
a3 103 a5 105
SELECT * FROM R CROSS JOIN S;
SELECT * FROM R, S;
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id)
a_id b_id
a3 103
a4 104
a5 105
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: JOIN
Generate a relation that contains all
tuples that are a combination of two
tuples (one from each input relation)
with a common value(s) for one or
more attributes.
Syntax: (R ⋈ S)
41
(R ⋈ S)
a_id b_id val
a3 103 XXX
R.a_id R.b_id S.a_id S.b_id S.val
a3 103 a3 103 XXX
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id,val)
a_id b_id val
a3 103 XXX
a4 104 YYY
a5 105 ZZZ
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: JOIN
Generate a relation that contains all
tuples that are a combination of two
tuples (one from each input relation)
with a common value(s) for one or
more attributes.
Syntax: (R ⋈ S)
41
(R ⋈ S)
a_id b_id val
a3 103 XXX
R.a_id R.b_id S.a_id S.b_id S.val
a3 103 a3 103 XXX
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id,val)
a_id b_id val
a3 103 XXX
a4 104 YYY
a5 105 ZZZ
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: JOIN
Generate a relation that contains all
tuples that are a combination of two
tuples (one from each input relation)
with a common value(s) for one or
more attributes.
Syntax: (R ⋈ S)
41
(R ⋈ S)
SELECT * FROM R NATURAL JOIN S;
a_id b_id val
a3 103 XXX
SELECT * FROM R JOIN S USING (a_id, b_id);
a_id b_id
a1 101
a2 102
a3 103
R(a_id,b_id) S(a_id,b_id,val)
a_id b_id val
a3 103 XXX
a4 104 YYY
a5 105 ZZZ
SELECT * FROM R JOIN S
 ON R.a_id = S.a_id AND R.b_id = S.b_id;
DATABASE SYSTEMS (FALL 2025)
RELATIONAL ALGEBRA: EXTRA OPERATORS
Rename (ρ)
Assignment (R←S)
Duplicate Elimination (δ)
Aggregation (γ)
Sorting (τ)
Division (R÷S)
42
DATABASE SYSTEMS (FALL 2025)
OBSERVATION
Relational algebra defines an ordering of the high-level
steps of how to compute a query.
→ Example: σb_id=102(R⋈S) vs. (R⋈(σb_id=102(S))
A better approach is to state the high-level answer that
you want the DBMS to compute.
→ Example: Retrieve the joined tuples from R and S where
S.b_id equals 102.
43
DATABASE SYSTEMS (FALL 2025)
RELATIONAL MODEL: QUERIES
The relational model is independent of any query
language implementation.
SQL is the de facto standard (many dialects).
44
for line in file.readlines():
 record = parse(line)
 if record[0] == "GZA":
 print(int(record[1]))
SELECT year FROM artists
WHERE name = 'GZA';
DATABASE SYSTEMS (FALL 2025)
DATA MODELS
Relational
Key/Value
Graph
Document / JSON / XML / Object
Wide
-Column / Column
-family
Array (Vector, Matrix, Tensor)
Hierarchical
Network
Semantic
Entity
-Relationship
45
←
←
←
DATABASE SYSTEMS (FALL 2025)
DOCUMENT DATA MODEL
A collection of record documents containing a
hierarchy of named field/value pairs.
→ A field's value can be either a scalar type, an array of values, or
another document.
→ Modern implementations use JSON. Older systems use XML or
custom object representations.
Avoid object-relational impedance mismatch by tightly
coupling objects and database.
46
DATABASE SYSTEMS (FALL 2025)
DOCUMENT DATA MODEL 47
Artist
ArtistAlbum
R1(id,…)
⨝
⨝
Album
R2(artist_id,album_id)
R3(id,…)
DATABASE SYSTEMS (FALL 2025)
DOCUMENT DATA MODEL 47
Artist
ArtistAlbum
R1(id,…)
⨝
⨝
Album
R2(artist_id,album_id)
R3(id,…)
DATABASE SYSTEMS (FALL 2025)
DOCUMENT DATA MODEL 47
Artist
{
"name": "GZA",
"year": 1990,
"albums": [
 {
 "name": "Liquid Swords",
 "year": 1995
 },
 {
 "name": "Beneath the Surface",
 "year": 1999
 }
]
}
Album
class Artist {
 int id;
 String name;
 int year;
 Album albums[];
}
class Album {
 int id;
 String name;
 int year;
}
Application Code
DATABASE SYSTEMS (FALL 2025)
DOCUMENT DATA MODEL 47
Artist
{
"name": "GZA",
"year": 1990,
"albums": [
 {
 "name": "Liquid Swords",
 "year": 1995
 },
 {
 "name": "Beneath the Surface",
 "year": 1999
 }
]
}
Album
class Artist {
 int id;
 String name;
 int year;
 Album albums[];
}
class Album {
 int id;
 String name;
 int year;
}
Application Code
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL
One-dimensional arrays used for nearest-neighbor
search (exact or approximate).
→ Used for semantic search on embeddings generated by MLtrained transformer models (think ChatGPT).
→ Native integration with modern ML tools and APIs (e.g.,
LangChain, OpenAI).
At their core, these systems use specialized indexes to
perform NN searches quickly.
48
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL
One-dimensional arrays used for nearest-neighbor
search (exact or approximate).
→ Used for semantic search on embeddings generated by MLtrained transformer models (think ChatGPT).
→ Native integration with modern ML tools and APIs (e.g.,
LangChain, OpenAI).
At their core, these systems use specialized indexes to
perform NN searches quickly.
48
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
Transformer
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
Transformer
Find albums with lyrics about
running from the police
Query
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
[0.02, 0.10, 0.24, ...]
Transformer
Ranked List of Ids Find albums with lyrics about
running from the police
Query
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
Transformer
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
Transformer
Find albums with lyrics about
running from the police
and released after 2005
Query
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
[0.02, 0.10, 0.24, ...]
Transformer
Find albums with lyrics about
running from the police
and released after 2005
Query
year > 2005
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL 49
Enter the Wu-Tang
Run the Jewels 2
Liquid Swords
We Got It from Here
id name year lyrics
Id1 Enter the Wu-Tang 1993 <text>
Id2 Run the Jewels 2 2015 <text>
Id3 Liquid Swords 1995 <text>
Id4 We Got It from Here 2016 <text>
Embeddings
Id1 → [0.32, 0.78, 0.30, ...]
Id2 → [0.99, 0.19, 0.81, ...]
Id3 → [0.01, 0.18, 0.85, ...]
Id4 → [0.19, 0.82, 0.24, ...]
⋮
Vector
Index
HNSW
Meta Faiss Spotify Annoy
Microsoft DiskANN
HNSW, IVFFlat
Meta Faiss, Spotify Annoy,
Microsoft DiskANN
[0.02, 0.10, 0.24, ...]
Transformer
Find albums with lyrics about
running from the police
and released after 2005
Query
year > 2005
Album(id, name, year, lyrics)
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL
The vector model is not a substantial deviation from
existing models that requires new DBMS architectures.
→ Every major DBMS now provides native vector index support.
Vector DBMSs offer better integration with AI tooling
ecosystem (e.g., OpenAI, LangChain).
50
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL
The vector model is not a substantial deviation from
existing models that requires new DBMS architectures.
→ Every major DBMS now provides native vector index support.
Vector DBMSs offer better integration with AI tooling
ecosystem (e.g., OpenAI, LangChain).
50
DATABASE SYSTEMS (FALL 2025)
VECTOR DATA MODEL
The vector model is not a substantial deviation from
existing models that requires new DBMS architectures.
→ Every major DBMS now provides native vector index support.
Vector DBMSs offer better integration with AI tooling
ecosystem (e.g., OpenAI, LangChain).
50
DATABASE SYSTEMS (FALL 2025)
CONCLUSION
Databases are the most important and beautiful
software in all of computer science.
Relational algebra defines the primitives for processing
queries on a relational database.
We will see relational algebra again when we talk about
query optimization + execution.