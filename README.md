# Easy Apply Automater Chrome Extension
### Tutorial 
https://www.youtube.com/watch?v=yt4jeIB02Eg&t=3s

## Description

This Chrome extension streamlines the job application process on LinkedIn by automating certain actions. Below are the key files:

## Future Features
1. Scroll to load all jobs on page when first starting.
2. Go to next page of jobs.
3. Save questions and answers for later.
4. Fix timing to be exact for clicking of buttons.
5. Random timing just to be safe. 


## Files

### 1. Popup.html

#### Description

`popup.html` is the user interface, presenting a button labeled "Easy Apply." When clicked, it triggers the automation process.
![User Interface](images/user_interface.png)

### 2. Popup.js

#### Description

`popup.js` contains the main script for automating LinkedIn job applications. It interacts with the active tab, clicking buttons and unchecking checkboxes sequentially.

### 3. Manifest.json

#### Description

`manifest.json` is a configuration file defining metadata and behavior. It includes an empty `content.js` file, required for extension updates.

### 4. Content.js

#### Description

`content.js` is an empty file required for extension updates. It does not contain specific logic but is crucial for the extension's structure.

## Note

- Ensure all files are correctly referenced in the extension directory.
- Set necessary permissions for the extension to function on LinkedIn pages.

The empty `content.js` file is essential for extension updates, maintaining a framework for future developments.
