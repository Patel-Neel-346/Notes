```dataviewjs
const file = dv.page("Questions");
dv.table(
  ["Sr No.", "Question", "Source", "URL"],
  file.questions.map((q, index) => {
    return [
      index + 1,
      q.question,
      q.source,
      q.url ? `[Link](${q.url})` : "",
    ];
  })
);
```
