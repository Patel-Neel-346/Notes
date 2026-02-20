-A collection of queries is called as a transaction
-It can be a single query or multiple queries
-It can be a single query or multiple queries


One unit of work is called as a transaction


Ex. account deposit
```
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;
```


another example read + update + insert + update + read commit 




-Trandaction Lifefspan 
 - transcation Begin 
 - transcation Commited
 - transcation Rollback
 - transaction unexpected termination == Rollback(e.g crash) 
 - transcation Aborted 
 - transcation End
 