# Analytics Project Grading Information
Thank you for your time and knowledge this quarter! Email [cah010@ucsd.edu] and [adhe@ucsd.edu] with your feedback, questions, or any advice for this project and Web Dev in general.

## Analytics Dashboard Information
We 4 user roles: owner, admin, analyst, and viewer. The full permissions of these roles are explained in README.md

### Owner Credentials
Display name: Obi Wan
Email: owner@example.com
Password: 201SecuritY

### Admin Credentials
Display name: Admin
Email: admin@example.com
Password: secret123

### Analyst Credentials
Display name: R2D2
Email: analyst1@example.com
Password: 2enCryptIonInSpace$2

Display name: C3P0
Email: analyst2@example.com
Password: eTtiquette30_

### Viewer Credentials
Display name: Luke
Email: viewer1@example.com
Password: somethingsecure321

## Scenarios
### Owner Scenarios
*Scenario 1: Create User*
1. Login with [owner credentials](#owner-credentials) and navigate to the 'Admin' tab in the side bar.
2. Fill out the 'ADD USER' form fields at the top of the page with relevant information and role selection.
3. Save by clicking the 'Add User' button.
4. Optional: logout and login with the new account.

*Scenario 2: Delete User*
1. Click the delete button for the user you just created.
2. Confirm deletion by selecting 'ok' for the browser dialogue.
3. Optional: confirm deletion by logging out and trying to log in with deleted account.

### Admin Scenarios
*Scenario: Edit Lower User Roles*
1. Login with [admin credentials](#admin-credentials) and navigate to the 'Admin' tab in the side bar.
2. Change the role of a user using the drop down menu in the table and save your changes.

### Analyst Scenarios
*Scenario 1: Report Creation*
1. Login to dashboard using one of the [analyst credentials](#analyst-credentials) and navigate to 'Reports' tab on the sidebar.
2. Click '+ New Report'. Select any information you are interested in viewing.
3. When you are done, click 'Save Draft' if you don't want otehrs to see the report details yet. Otherwise, click 'Publish'.

*Scenario 2: Leaving Analyst Comments*
We recommend logging in to the 2nd [analyst account](#analyst-credentials) for this phase to explore more features. From the second analyst account, you will not be able to edit reports created by another user.
1. Click on a published report.
2. Leave general notes by entering text into the text area labeled 'Analyst Notes' at the bottom of the report. Click 'Post Note' to publish it.
3. Optional: experiment with editing and delet
3. Leave notes on metric cards by clicking on the circle at the top right corner of each card. It should highlight bright blue when a note is save.
4. Leave notes on specific data points in visualizations by clicking on them and saving a note. Saved notes can be read by hovering over annotated data points.

#### Viewer Scenarios
*Export Reports*
1. Login with [viewer credentials](#viewer-credentials) and navigate to the 'Reports' tab using the sidebar.
2. Click on your desired report to open it, then click the 'Export' button on the top right corner of the page.
3. Click 'Generate PDF' to download the report.

## Bugs, Architectural Decisions, & Future Directions
### Security & Organizational Risk: Relaxed Owner Permissions Approach
We built our site assuming there would only be a few users who would need access to the analytics dashboard, and that site traffic would be low. As such, when building configuring role-based access to routes, we decided to allow owners to create and "promote" other users to owner status also. This means that if a malicious actor were to gain access to an "owner" account, they would be able to create other accounts with ownership privileges. In the worst case, if they came into knowlege of our endpoints, they could create forms and inject maliceful data into our database. On a less serious note, this approach also enables internal organizational drama, as owners and admin can promote, demote, and create other users easily, quickly, and - in times of conflict - pettily.

The security risk of this approach can be addressed by sanitizing and validating form field input and other request data more rigorously. Currently we validate that all necessary fields are included in the request and role-based permissions are being met before querying from our database, but did not take extensive precautions to sanitize the content of the request packet data. In the future, we hope to employ regex pattern matching, length constraints, and other content sanization procedures.

 In addition to maintaining clear organizational expectations and a positive culture, the organizational risk of this approach can also be mitigated by making creating new users and editing roles more difficult. This can be accomplished by delaying responses and sending requests. We could additionally add a column into our schema for newly created or promoted/demoted users indicating whether the change is "approved" or not, and require a certain threshold of "votes" in order to set that flag to true, after which permissions are updated.
