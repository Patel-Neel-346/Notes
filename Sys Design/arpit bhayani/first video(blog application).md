#### First Video
- blog table has a `is_deleted` which will reduce the rebalancing of the btree else db have to do io operation and rebalancing of tree.
- reason for not having the huge rows in the table is that db is going to load the row in a contingous memory space for operating on it.
- using  `epoch` instead of date time object in sql will increase in performance in range queries and normal queries. Db has to serialize it when saving it into the disk and deserialize it when operating on it. **MakeMyTrip** removed date time objects with epoch and gain performance by 20%.
  Or you can use `YYYYMMDD` format but then we will manually write numbers like this `20240212` it gives best of both worlds, human readbility plus performance.
- Trick to handle time zones is to store date as UTC or ISO then according to the user local handle on the frontend.