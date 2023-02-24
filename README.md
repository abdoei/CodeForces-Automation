# CodeForces-Automation
Web scrapping codeforces after passing the authantication
This project is a seed to an opensource CodeForces automation tool that is mainly focusing on helping NGOs interesting in forming groups and teaching them problem solving for the sake of Allah.
## Work done
Now it only supports fetching the top 10 each second in a private contest when supplying the cookie text of an member of that group on CodeForces.
![image](https://user-images.githubusercontent.com/64744285/221087198-327a7b19-cf9e-4ae1-bec8-27145d7a9385.png)


### step 1
The project can be hosted on a Gmail account by visiting ![this page](https://script.google.com/home/projects) and upload the .gs and source.html files.
### step 2
Create a new Google sheet from ![here](https://docs.google.com/spreadsheets/d/) and get the link of the file (this file is the target like the picture above) and name the sheet with the name of the contest instead of "Sheet1"
### step 3
Go to the contest standing page while you are loged in (not required to be admin) and open the console then type `document.cookie` then keep the output 

You are almost done now open the .gs file change the values of `cFURL, ssURL, sssName, cookie` with the values you have got. Then run the function `initiateSheet()` once then make a trigger to call the function `updateSheet()` each second if you like 


