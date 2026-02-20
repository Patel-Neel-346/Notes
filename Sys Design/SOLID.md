## S: Single Responsibility
*A class should have only reason to change*
We can relate this from domain entities which are present in domain layer. A class should be responsible for a entity like product, invoice etc.
## O:Open Close principle
*Software entities(classes,functions) should be open for extention but closed for modification*
And that's why we use dependency injection so that we can make these classes less coupled

# L: Liskove Substitution Principle
It means every child class should extends his parent class seamlessly such that all the methods works as expected without throwing an error. 

# I: Interface Segregation
There should be no unnecessary method in the class. This usually happens when we implement interface for a class. 
We can separate the methods in a interface into smaller interface so that we can use what we want
# D: Dependency Inversion
Class should depend on abstraction instead of original class. 
Abstraction in our means could be interface which will work as a contraints for class so that we can do depedency injection.