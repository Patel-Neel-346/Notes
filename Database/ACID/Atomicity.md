all queries in a transaction are executed or none of them are executed


its like an antom that can not the spilit 
all the queries with the transaction are treated as a single unit of work and must successed 
what happens if one of the query fails?
- then all the queries are rolled back
- and the database is restored to the state before the transaction

even if you had 100 successfully queries with one transaction one failed all will be rollback


what if db went down prior to a commit a transaction all the successfully queries in thranscation should be rolled back


db will first check the trnsaction if faile then it will rollback all the queries
if success then it will commit all the queries to the disk


example

acc a sends 100$ to acc b

1. debit 100$ from acc a
2. credit 100$ to acc b

if step 1 is done but step 2 is not done then money is lost
so we use transaction to make sure that both the steps are done or none of them are done




add an explanation 

if automicity is not implemented

after debiting the amount from acc a if the 
database is crash due to some reason 

then the amoun is lost 

like user a has first 1000 $ now its 900 $ but acc b has no change in balance

this is called as data inconsistency


if automicity is implemented

after debiting the amount from acc a if the 
database is crash due to some reason 

then the amount is credited back to acc a

this is called as atomicity

