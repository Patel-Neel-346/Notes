# Available data types in drizzle of postgres

## Number
### Integer
- Jab number **-2 billion** se leke **2 billion** tak ho to integer use karte hai **(-2^31 or 2^31)** *Signed 4 bytes*
```ts
 qty: integer("qty")
```
#### Smallint
- Jab number **- 32 thousand** se leke **2 thousand** tak ho to integer use karte hai **(-2^7 or 2^7)** *Signed 2 bytes*
```ts
 qty: smallint("qty")
```
#### bigint
- The biggest number you can possibly imagine
```ts
  qty: bigint("qty", { mode: "bigint" })
```
- Agar **2^31<number<2^53** iske beech men hai toh bigint ka mode number de sakte hain
#### Serial
- Ye number type apne app khud ko increment karta rahata hai  iska use **id** field ke liye hota hai
```ts
  qty: serial("id")
```
##### smallserial
##### bigserial
- Isme hame mode batana padta hai
### Decimal
```ts
 price: numeric("price", { precision: 7, scale: 2 }), // 12345.67
```
- **precision** total number kitne honge 
- **scale** un total numbers me se decimal kitne honge
##### real or float 4
##### double precision or float 8
```ts
score: doublePrecision("score")
score: real("score")
```

## Boolean
### True/false or 0/1

## Text
- Unlimited amout of characters
```ts
 description: text("description"),
```

## Varchar
- It allows us to specify limit of characters
```ts
description: varchar("description", { length: 256 })
```

## Char
- Isme bhi ham length batate hain lekin length se chhota agar text hai to uske aage aur peechhe **space** 
```ts
 name: char("name", { length: 10 }), ➡️// "chair     "
```

## Json
```ts
 data: json("data")
  data: jsonb("data") // it stores but in binary formate and so it will be proccessed faster compared to json
```

## Date
```ts
startAt: time("startAt", { withTimezone: false }).defaultNow(),
date: interval("date"),
date: timestamps("date",{mode:"date"or"string"}),
```
## enum
```ts
export const moodEnum = pgEnum("mood", ["sad", "ok", "happy"]);
export const testTable = pgTable("testTable", {
  mood: moodEnum("mood").default("ok"),
});
```

# Query filters 
## eq
```ts
....where(eq(user.id,2)) // where user id is equal to 2
```
## ne
```ts
....where(ne(user.id,2)) // where user id is not equal to 2
```
## gt(greater than)
## gte(greater than or eaqual to)
## lt(less than)
## lte(less than equal to)
## isNull
```ts
....where(isNull(user.address)) // it will return all the users who doesn't contain any adress or address is null
```
## isNotNull
## inArray
```ts
....where(inArray(user.id,[1,2,3,4])) // it will return the  users with these id's in an array
```
## noInArray
```ts
....where(notInArray(user.score,[20,30])) // it will return the users with an array whose score is not equal to 20 and 30
```
## between and notBetween
```ts
....where(between(user.score,20,30))
//              OR 🫵
....where(notBetween(user.score,20,30))
```
## like
```ts
....where(like(user.fullName,'%bnb%'))// give me all the users which contains bnb at their fullName
//              OR 🫵
....where(like(user.fullName,'bnb'))// give me all the users with exact bnb name
//              OR 🫵
....where(like(user.fullName,'bnb%'))// give me all the users whose name starts with bnb
```
## notlike
## ilike
- Same as like but it doesn't care about **case** of the text
## notIlike
- Same as notlike but it doesn't care about **case** of the text
## not
- It's like utitlity function for others
```ts
....where(not(eq(user.id,1))) 
```
## and
```ts
....where(and(like(user.fullName,'Mohit%'),gt(user.score,50)))
```
## or
# Relations
## One to One relation
```ts
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	fullName: text("full_name"),
	phone: varchar("phone", { length: 256 }),
	score: integer("score"),
});
export const profileInfo = pgTable("profile",{
	id: serial("id").primaryKey(),
	bio:varchar('bio',{length:256}),
	userId:integer("user_id").notNull().refrences(() => user.id)
})
```
- Agar hamre primary key ka data type **serial** hai to **integer** lagaenge foreign key mein lekin agar **bigserial** hai primary key mein toh foriegn key mein **bigint** lagaenge
```ts
export const usersRelations = relations(users, ({ one }) => ({
	profile: one(profileInfo, { 
		fields: [users.id],
		references: [profileInfo.userId],
	}),
}));
```
- Hame ek relations ka function bhi export karna padta hai
```ts
const user = db.query.users.findFirst({
	with:{
		profile:true
	}
})
// RESULT
[
	{
		id:1,
		fullname:...
		score:...
		profile:{
			userId:...
			bio:...
		}
	}
]
```

## One to many
```ts
export const posts = pgTable('posts', { 
	id: serial('id').primaryKey(),
	content: text('content'), 
	authorId: integer('author_id').notNull().refrences(() => user.id)
});
```

```ts
export const usersRelations = relations(users, ({ one,many }) => ({
	profile: one(profileInfo, { 
		fields: [users.id],
		references: [profileInfo.userId],
	}),
	posts:many(posts) // name of table passing as argument
}));
```
- Ek user ke pass bahot saari post ho sakti hain
- Ab hame ye cheez hamare posts ke table ke liye bhi karni hogi
```ts
export const postsRelations = relations(posts, ({ one }) => ({ 
	author: one(users, { 
		fields: [posts.authorId],
		references: [users.id], 
	}),
}));
```

```ts
const user = db.query.users.findFirst({
	with:{
		profile:true,
		posts:true
	}
})
```

## Many to many
- Iske liye hame ek extra table bana hoga taki ham id's ka track rakh sake
```ts
export const postOnCategories = pgTable(
  "post_categories",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey(t.postId, t.categoryId),
  })
);
```
- Ab ham baki tables se saath one to many relation banenge
```ts
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  posts: many(postOnCategories),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),

  postCategories: many(postOnCategories),
}));
```

```ts
export const postOnCategoriesRelations = relations(postOnCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postOnCategories.postId],
    references: [posts.id],
  }),

  category: one(categories, {
    fields: [postOnCategories.categoryId],
    references: [categories.id],
  }),
}));
```
