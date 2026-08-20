Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d ""C:\Users\Practical5\Desktop\Neel\Extra\Notes\OS\Process"" && python -m http.server 51743", 0, False
MsgBox "OS Notes server started!" & Chr(13) & Chr(13) & "http://localhost:51743/", 64, "Server Running"
