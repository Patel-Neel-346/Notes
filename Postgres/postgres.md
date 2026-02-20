#### Datatypes
```sql
-- Numeric
SMALLINT            -- -32,768 to 32,767
INTEGER             -- -2,147,483,648 to 2,147,483,647
BIGINT              -- -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
DECIMAL/NUMERIC     -- Exact decimal numbers
REAL/FLOAT          -- Floating-point numbers

-- String
CHAR(n)             -- Fixed-length string
VARCHAR(n)          -- Variable-length string with limit
TEXT                -- Variable unlimited length

-- Date/Time
DATE                -- Date only
TIME                -- Time only
TIMESTAMP           -- Date and time
INTERVAL            -- Time period

-- Others
BOOLEAN             -- true/false
UUID                -- Universally unique identifier
JSON/JSONB          -- JSON data
ARRAY               -- Array of any type
```

##### Numbers
```sql
SMALLINT -- 2 bytes alias int2, ranges from -32000 - 32000
INTEGER  -- 4 bytes alias int4, ranges from -2.1 billion  - 2.1 billion
BIGINT -- 8 bytes alias int8, ranges from -9 quintallian - 9 quintallian
NUMERIC - DECIMAL is an alias for NUMERIC
```

##### Numeric
- A NUMERIC can hold bigger ranges than the BIGINT

```sql
             INTEGER  - Perfectly ccurate all the maths is going to tie out
								|     - They are fast
								|     - They support only whole numbers
								|
						DECIMAL/NUMERIC  - They support fractions of number
								|            - They are perfectly accurate
								|            - They are extremly slow
								|						 
						  FLOAT          - They are not perfectly accurate it is approximation
														 - They are very fast
```
- `NUMERIC(precision,scale)` the entire number of digits is called precision `123.2 -> precision = 4, scale = 1`. We can set this how many total digits we want and how many numbers we want after the decimal point.
##### Float
- `real` 4 bytes 6 digits after the decimal point. `float4` is the alias for this
- double precision 8 bytes 15 digits after the decimal point. `float8` is the alias for this
##### Money
- We will loose precision it won't allow more than 2 digits after the decimal point
- When we change the `lc_monetary` to something else like `SET lc_monetary = 'en_GB.UTF-8`. It will just change the symbol of the currency value but it won't change the vlaue itself according to the current exchange rate.
- BTW `lc_monetary` is option which decides which type of symbol we want to provide to the money type in postgres.
##### Casting
- Postgres provides this alias `::` for SQL generic `cast(100 as money)`
- eg. `SELECT 1000 :: money` or `SELECT cast(1000 as money)`
- `pg_typeof(100::int4)` to knwo the type of the data
- `pg_column_size` it shows the size of the column. `pg_column_size(100::int4)`

##### Character Types
- `char(5)` , `character varying(255) --OR-- VARCAR(255)` and `TEXT` are all stored in the same datastructure.
- `char` is worst performing in all of them. If the text is under the specified length the postgress will fill the it with the empty spaces and if the text is greater than the specified length the postgress will throw error.
- TOAST, which stands for **The Oversized Attribute Storage Technique**, is a PostgreSQL feature designed to handle large data efficiently, especially for columns with large text or bytea (binary) data. PostgreSQL uses TOAST to store large data values (like long strings or binary objects) outside of the main table to avoid bloating and to improve performance.
- PostgreSQL creates a separate TOAST table automatically for any table that has columns capable of storing large data types (like `TEXT`, `BYTEA`, or large `VARCHAR`). This TOAST table is used to store and manage large values for the main table, and it is maintained by PostgreSQL without user intervention. 

##### Domain types
- Domain types are custom types which can be used in the table as constraints for business logic purpose.
```sql
CREATE DOMAIN adult AS INT2
    CHECK (VALUE > 18);

CREATE TABLE person (
    name VARCHAR(255),
    age adult
);
```

##### UUID
- UUID type is given in postgress to save the space in the disk. 
```sql
create extension if not exists pgcrypto

create table uuid_example(
    id uuid
);

insert into uuid_example (id) values (gen_random_uuid())

select pg_column_size(id), pg_column_size(id::text) from uuid_example
--        16bytes               40
```
##### Enums
- They are stored as text formate in postgres but postgres considers them as integers, auto incrementing integers
```sql
create type mood as enum ('happy','sad','crying');
alter type mood add value 'hugging face'; -- it will automatically added to the very end
alter type mood add value 'hugging face' before 'sad';-- it will be added before said
alter type mood add value 'hugging face' after 'sad';-- self explanatory
insert into enum_example (current_mood) values ('crying'),('happy')
select * from enum_example
```
- Ok so here the values would be something liek this
	- `happy` = `1`
	- `sad` = `2`
	- `crying` = `3`
and when i added the `hugging face` before or after the `sad` it will take the difference like this
	- `happy` = `1`
	- `hugging face` = `1.5`  <-
	- `sad` = `2`              |- OR based upon the condition
	- `hugging face` = `2.5`  <-
	- `crying` = `3`
#### Checked constrains
This is colum level constaint.
```sql
create table check_example(
    name varchar(255),
    price int4 check(price > 0),
    discount int4 check(discount > 0)
);
```
Giving name to the constraints for better error message because, the example shown above is going to throw the error but it will be very weird.
```sql
create table check_example(
    name varchar(255),
    price int4 constraint price_should_be_greater_than_0 check(price > 0),
    discount int4 constraint discount_should_be_greater_than_0 check(discount > 0)
);

```
Now this is going ot show the name of the constraint which is failing.
Every column level constraints can be used as table level constraints but not every table level constraint can be used as column level constraint.
But this thing has its own opinions by the develoers how much business logic should you put in the database.
```sql
create table check_example(
    name varchar(255),
    price int4,
    discount int4,
    constraint price_should_be_greater_than_0 check(price > 0), -- this is column level constraint
    constraint discount_should_be_greater_than_0 check(discount > 0), -- this is column level constraint
    constraint discount_should_be_less_than_price check(discount < price) -- this is table level constraint
);
insert into check_example (name,price,discount) values
('salt',10,100);
```
way to drop a constraint from the table
```sql
ALTER TABLE check_example
DROP CONSTRAINT discount_should_be_less_than_price;
```

#### String functions and Operators
- `||` join two strings
- `CONCAT()` 
- `LOWER()`
- `LENGTH()`
- `UPPER()`
```sql
SELECT first_name || lastName as full_name from persons
```
#### Where clause
```sql
SELECT state FROM countries WHERE population > 200000;
SELECT state FROM countries WHERE population NOT IN (460000, 415800);
SELECT state FROM countries WHERE population IN (460000, 415800);
SELECT state FROM countries WHERE population BETWEEN 200000 AND 450000;
SELECT state FROM countries WHERE population NOT BETWEEN 200000 AND 450000;
SELECT * FROM countries WHERE country = 'india' AND population > 100000;
SELECT * FROM countries WHERE population > 400000 OR country = 'albania';
-- use <> or != for not equal to.
```
#### Update and Delete
```sql
UPDATE countries
SET population = 200000
WHERE country = 'india';

DELETE FROM countries
WHERE country = 'india2';
```
#### Primary key and foreign key
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);

INSERT INTO users (username)
VALUES
	('monahan93'),
  ('pferrer'),
  ('si93onis'),
  ('99stroman');

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER REFERENCES users(id) -- this is foreign key
);

INSERT INTO photos (url, user_id)
VALUES
	('http://one.jpg', 4);
```
#### JOIN or INNER JOIN
```sql
SELECT usernmae,url FROM photos
JOIN users ON users.id = photos.user_id
```

**Things to consider when doing insertion in tables which have a foreign key constraint**
- It wont throw any error if we are trying to insert a photo with a user id which exist in the user table
- It will throw error if we are trying to insert a photo with a user id which doesn't exist in the user table. `It voilets the foreign key constraint of the postgres`
- It won't throw any error if we put the `NULL` in the place of user_id in the photos table
**Things to consider when doing deletion in tables which have a foreign key constraint**
If we try to delete the user then some photos will left in the phots table with dangling user_id columns to fix that we can use.
- `ON DELETE RESTRICT` -> throw an error
- `ON DELETE NO ACTION` -> throw an error
- `ON DELETE CASCADE` -> delete photo too
- `ON DELETE SET NULL` -> set the `user_id` to `NULL`
- `ON DELETE SET DEFAULT` -> set the `user_id` of photo to a default value if one is provided

##### All four kinds of joins
![[joins.pdf]]
#### Aggregation and Grouping and Having
##### Aggregate functions
- `COUNT()`
- `MIN()`
- `MAX()`
- `AVG()`
- `SUM()`
Corner cases around `COUNT` is that it won't count the null value in a column.
##### Having and Grouping
Certainly! The `HAVING` clause is used in SQL to filter groups of rows created by the `GROUP BY` clause. Unlike `WHERE`, which filters rows before grouping, `HAVING` filters groups after aggregations have been applied.

Here’s a simple example to illustrate:

##### Example Table: `sales`

| product | quantity | revenue |
| ------- | -------- | ------- |
| Apple   | 10       | 100     |
| Banana  | 20       | 200     |
| Apple   | 5        | 50      |
| Orange  | 15       | 150     |
| Banana  | 10       | 100     |
| Orange  | 10       | 100     |

##### Scenario
Suppose you want to find products with a **total revenue greater than 200**. To do this, you’d first group the rows by `product`, calculate the total `revenue` per product, and then use the `HAVING` clause to filter only those groups with total revenue above 200.

##### Query Using `HAVING`

```sql
SELECT product, SUM(revenue) AS total_revenue
FROM sales
GROUP BY product
HAVING SUM(revenue) > 200;
```

##### Explanation
- **`GROUP BY product`**: Groups rows by each unique `product`.
- **`SUM(revenue)`**: Calculates the total revenue for each `product` group.
- **`HAVING SUM(revenue) > 200`**: Filters the grouped results to show only products where the total revenue is greater than 200.

##### Result

| product | total_revenue |
|---------|---------------|
| Banana  | 300           |
| Orange  | 250           |

In this case, only `Banana` and `Orange` meet the `HAVING` condition of `SUM(revenue) > 200`. The `Apple` group is filtered out since its total revenue is 150. 

Without the `HAVING` clause, the query would show all products with their total revenues. The `HAVING` clause allows you to add conditions to these aggregated results.

#### Sorting
In SQL, you can sort query results using the `ORDER BY` clause. The `ORDER BY` clause allows you to specify one or more columns to sort by, and you can choose to sort in **ascending** (`ASC`) or **descending** (`DESC`) order. By default, `ORDER BY` sorts in ascending order if no sort direction is specified.

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column_name [ASC|DESC];
```

- **`column_name`**: The column by which you want to sort the results.
- **`ASC`**: Optional keyword for ascending order (default).
- **`DESC`**: Optional keyword for descending order.

##### 1. Sort by One Column in Ascending Order (Default)

```sql
SELECT product, price
FROM products
ORDER BY price;
```

This sorts the results by `price` in ascending order (smallest to largest).

##### 2. Sort by One Column in Descending Order

```sql
SELECT product, price
FROM products
ORDER BY price DESC;
```

This sorts the results by `price` in descending order (largest to smallest).

##### 3. Sort by Multiple Columns

You can also sort by more than one column. For example, if you want to sort by `category` first (ascending), and then by `price` within each category (descending), you can do:

```sql
SELECT product, category, price
FROM products
ORDER BY category ASC, price DESC;
```

This will:
1. Sort by `category` in ascending order.
2. Within each category, sort by `price` in descending order.

##### Using `ORDER BY` with Aliases or Calculated Columns

You can also sort by aliases or calculated columns:

```sql
SELECT product, price, price * 0.9 AS discounted_price
FROM products
ORDER BY discounted_price DESC;
```

In this case, the results are sorted by the `discounted_price` column in descending order.
#### Unions
It is used to execute two queries and combine their results into one.

```sql
(
	-- first select statement
)
UNION
(
	-- Second select statement
)
```
- There is `UNION ALL` it has the same syntax but it does not remove duplicate rows
```sql
(
    select * from products
    order by products.price desc
    limit 4
)UNION All (
    select * from products
    order by products.price / products.weight desc
    limit 4
);
```
- It is mandatory that **both the queries shold return the same columsn which has same data types**.
**there are other clauses which has the same syntax as UNION and UNION ALL.**
- `INTERSECT` find rows common in the  result of two queries. **Rmove duplicates**
- `INTERSECT ALL` find  rows commin in the result of two queries.
- `EXCEPT` find the rows that are present in first query but not in second query. **Remove duplicates**
- `EXCEPT ALL` find hte rows that are present in first query but not in second query.

