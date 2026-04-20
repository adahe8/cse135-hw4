# Analytics App
Email [carmen.he0908@gmail.com] and [ada.he0908@gmail.com] with your feedback, questions, or any advice for this project and Web Dev in general.
## Creators
Ada He  
Carmen He

## Server, Domain, & Repo Information
Droplet Name: ubuntu-s-1vcpu-2gb-70gb-intel-sfo3-homework

### Domain
Interact at [https://reporting.literallycreates.site/]
View analytics at [https://reporting.literallycreates.site/login.html]

### Testing It Out: User Levels & Role-Based Authentication
We created four user levels: owner, admin, analyst, and viewer. Each role can view different "tabs" - categories of data - and perform different actions. This is implemented through express (Node.js) endpoints configured with role authentication middleware to limit access to specific routes.  
1. *Owners* can view all data, create/edit reports, and modify roles _and_ create new users, including adding other owners.
2. *Admin* can view all data, create/edit reports, and modify roles.
3. *Analysts* can view all data, and create/edit reports.
4. *Viewers* can only view analyst-created reports.  
Below are some scenarios to guide exploration, if you want to log int to each role and try out the different permitted actions.  

#### Admin Scenarios
*Scenario: Edit Lower User Roles*
1. Login with [admin credentials](#admin-credentials) and navigate to the 'Admin' tab in the side bar.
2. Change the role of a user using the drop down menu in the table and save your changes.

#### Analyst Scenarios
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

#### Admin Credentials
Display name: Admin
Email: admin@example.com
Password: secret123

#### Analyst Credentials
Display name: R2D2
Email: analyst1@example.com
Password: 2enCryptIonInSpace$2

Display name: C3P0
Email: analyst2@example.com
Password: eTtiquette30_

#### Viewer Credentials
Display name: Luke
Email: viewer1@example.com
Password: somethingsecure321  
  
For security reasons, we are not disclosing the owner login. Admin has similar permissions.


## Implementation Details
### AI & Our Process
We used the LLM Claude Code with Sonnet 4.6 (by Anthropic) for assistance styling the dashboard and login, adding security and more RBAC enhancements, building more endpoints to allow for report generation & export, and adding routes for user creation & modification based on what we had built in HW4. Our general workflow was to decide our architectural approach and desired output, write a prompt to Claude, review suggested changes and approve or reject based on whether it met our need. If it did not meet our need, we would provide more context in our prompt. If we accepted the change, we would test, make a list of bugs, and then manually resolve them or prompt Claude with additional information.

#### Tradeoffs
This was the only sprint of our analytics app project where we leveraged a coding agent extensively. With it, we wrote significantly more code, and it felt like we made decisions and implemented them much more rapidly than we would have without it. However, we understand that our approach may be buying into the illusion of short term productivity. We approach these tools with a feeling of caution, and did not feel comfortable accepting changes without first understanding them and if they were in line with our architectural decisions. Notably, we did not use Claude to make decisions about or modify our SQL schema.

### Reports
We utilized the CRUD pattern to allow analysts to curate analytics reports for viewers to read.  
1. Create - analysts can select from the various data metrics and charts already displayed in the Overview, Activity, and Performance tabs to highlight specific metrics/ relationships and tell a unique story in their report.  
2. Update - analysts can also change the metrics viewable in the report. They can publish the report for viewers, or unpublish it to restore it to draft status, where they make changes without viewer access.
3. Delete - the default view (for analysts and above) of the Reports tab is a list of all published and unpublished reports. Each report "card" has a a delete option.  

Analysts can annotate reports in three ways: commenting at the end of a report, directly commenting on a metrics card, or annotating a data point on a chart. We also follow CRUD architecture with RESTful endpoints to implement notes. We chose the plain text approach to writing comments for simplicity. Analysts can bold, italicize, and list/enumerate with Mardkdown syntax using Regex patterns.  

Each of the buttons - add a new report/annotation, delete, and change metric/ edit - are tied to an endpoint that writes, deletes, or updates a row of the according tracking tables in our SQL schema. We added 2 new tables, reports and reports_annotations, to store reports and report annotations.  

View our schema in the [schema.sql] server-side file.

### Data Viz
Package used: ChartJS.  
This package was a good middle ground between Canvas API and more complex chart libraries. We noticed that the charts we made using Canvas were grainy when embedded into our dashboard, and exporting would've required redrawing them. Plus, data-point based annotations were not supported. ChartJS is based on Canvas and still cannot translate to PDF, but it is equipped with functions and features that made it easier to implement data point annotations. The graphs also have much better resolution.

### Exports
All roles can export a report. We used the Puppeteer package to convert the report HTML frames (after it has been fully rendered with JS) into PDFs in [reporting-api/api.js]. To include data charts in report PDFs, we chose to do a client-side capture to get a static snapshot of the desired chart, which is converted to a data url and inserted into the HTML frame as an image. Once the PDF is generated, the user can choose to download it, which runs a script that directly downloads it to their computer, or save an accessible link to download it later, which is also generated by Puppeteer with the UUID package from Node.

## Future Directions
*No-Script Handling*
Our analytics app is a SPA, therefore much of its features, including rendering the sidebar that allows users to navigate between metrics and handling form submissions, is done with javascript. Due to time, we did not write noscript alternatives to address these cases, which would be crucial to making our site accessible across more environments. This can be addressed in the future by handling form submission with server-side scripts (PHP, etc) instead of express endpoints that validate and sanitize the request, build and execute SQL queries, and render the response data. This would reduce the interactivity of the site, but maintain some core functions.

*More Visualizations*
An inexhaustive list of more visualizations we would love to add in the future:
1. Pageviews | goal: understand how "long" users are spending on our site
    - Line charts:
        - avg pageviews _per session_ over time
        - avg pageviews _per unique visitor_ over time
2. Visitors & Technnographics| goal: understand the technographics of user base to inform our development approach
    - Pie charts:
        - percentage breakdown of real users vs. bots
        - percentage breakdown of user-agent (browsers_)
            -  Chrome, Firefox, Safari, Explorer, known bots, other
    - Metrics:
        - percentage of no-script, no-css, no-image
    - Bar chart:
        - browser versions
    - Line chart: average length of visit per user

### Security & Organizational Risk: Relaxed Owner Permissions Approach
We built our site assuming there would only be a few users who would need access to the analytics dashboard, and that site traffic would be low. As such, when building configuring role-based access to routes, we decided to allow owners to create and "promote" other users to owner status also. This means that if a malicious actor were to gain access to an "owner" account, they would be able to create other accounts with ownership privileges. In the worst case, if they came into knowlege of our endpoints, they could create forms and inject maliceful data into our database. On a less serious note, this approach also enables internal organizational drama, as owners and admin can promote, demote, and create other users easily, quickly, and - in times of conflict - pettily.

The security risk of this approach can be addressed by sanitizing and validating form field input and other request data more rigorously. Currently we validate that all necessary fields are included in the request and role-based permissions are being met before querying from our database, but did not take extensive precautions to sanitize the content of the request packet data. In the future, we hope to employ regex pattern matching, length constraints, and other content sanization procedures.

 In addition to maintaining clear organizational expectations and a positive culture, the organizational risk of this approach can also be mitigated by making creating new users and editing roles more difficult. This can be accomplished by delaying responses and sending requests. We could additionally add a column into our schema for newly created or promoted/demoted users indicating whether the change is "approved" or not, and require a certain threshold of "votes" in order to set that flag to true, after which permissions are updated.
