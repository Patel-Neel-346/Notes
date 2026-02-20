**HTTP** is a protocol which is written by IETF.
# Request & response

Request and response messages are similar. Both messages consist of:

- a request/response line
- zero or more header lines
- a blank line (ie, CRLF by itself)
- an optional message body
## HTTP request

Request

- request line
- headers
- optional message body

Request-Line

- Method SP Request-URI SP HTTP-Version CRLF

example request line:

- GET /path/to/file/index.html HTTP/1.1


## HTTP response

Reponse

- status line
- headers
- optional message body

Status-Line

- HTTP-Version SP Status-Code SP Reason-Phrase CRLF

example status line:

- HTTP/1.1 200 OK

### Creating a TCP server in go
```go
func main() {
    li,err := net.Listen("tcp",":3001")
    if err != nil {
        log.Fatal(err)
    }
    defer li.Close()

    for {
        conn, err := li.Accept()   
        if err != nil {
            log.Println(err)
        }
        io.WriteString(conn,"\nHello from TCP server\n")
        conn.Close()
    }
}
```

#### Bcrypt in go 
```go
package main

import (
	"fmt"
	"log"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "mysecurepassword"

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}
	fmt.Println("Hashed password:", string(hashedPassword))

	// Verify the password
	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
	if err != nil {
		fmt.Println("Password is incorrect")
	} else {
		fmt.Println("Password is correct")
	}
}
```
