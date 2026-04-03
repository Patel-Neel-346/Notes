Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d ""C:\Users\Practical5\Desktop\Neel\Extra\Notes\Database\Database Internal Book version\1-Storage Engine\Chapter-4"" && python -m http.server 51742", 0, False
MsgBox "Notes server started!" & Chr(13) & Chr(13) & "http://localhost:51742/b-tree.html", 64, "Server Running"