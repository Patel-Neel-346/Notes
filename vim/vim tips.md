- **Mark** for marking use **m<*any letter to mark that line*>** and then use **'<*that specified letter*>**
	- To delte a mark **dm<*any letter which is previsouly marked*>**
	- **(backticks)<*specified id of mark*>** it will take to that line as well as column
	- **(left squre bracket)' go to previous marks
	- **(right square bracket)'** go to next marks
	- **(left squre bracket)/\`/\** go to previous marks line as well as colomn
	- **(right square bracket)'** go to next marks as well as colomn
	- `.`  jumps to where the lasts change was made
- **fold** 
	- **zf<*motion*>**
	- **zf** create a fold
	- **zd** to delete a fold
	- **zD** to delete all the folds
	- **zc** close a fold
	- **zo** open a fold
	- **za** toggle a fold
	- **za1j** will create fold from current line to one line beneath it
	- **zM** close all folds
	- **zR** open all folds
- **Auto increment**
	- **Ctrl + x** to decrement
	- **g+Ctrl+a** to increment globaly
- **find and replace**
	- ***.s/word/word*** . means current line
	- **5j/s/*word*/*word*** or can be used with **/g** or **/gc**
	- **s/*word*/*word*** if already cursor is in line
	- **2,8s/*word*/*word*** from second line to 8th line
	- **,+2s/*word*/*word*** from current line to next 2 lines
	- **,$s/*word*/*word*** from current line to last line
	- and **%** means all lines in file
	- **%s//*word*** from current line to last line. After using **shift+8(means * --star)** the select words will be replaced 
	- **%s#*word*#*word*** use of symbols instead of slashes. It will solve the problem us slash escaping
		```bash
		some text /user/main/server.js
		# target is to replace `/user/` with `/admin/`
		# -> .s/\user\///\admin/\
		# -> .s#/user/#/admin/
	```
	- **%s/apple/apples** this is uselss.Better way **%s/apple/\0s** 