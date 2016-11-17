------Angular employee manager. Dataart course project------


Main angular js files you can find in src/app/js directory.


app.module.js - main application module.
employee-manager.module.js - submodule, responsible for managing application states depending on specified URL.
 this module also unites all major application modules such as :

    - data-repository.module.js - module, responsible for storing and managing employees and teams data.
    - team.module.js - module, responsible for managing user actions and rendering data in views concerning teams. Includes:

            - TeamController - controller for displaying data and managing user actions.
            - TeamService - service for interaction with data-repository.
            - TeamAccordion - directive for displaying teams list and adding new teams.

    - employee.module.js - module, responsible for managing user actions and rendering data in views concerning employees. Includes:
            - EmployeeController - controller for displaying data and managing user actions.
            - EmployeeService - service for interaction with data-repository.
            - EmployeeFilter - filter for searching employees by using search bar.
            - EmployeeTable - directive for managing employees by using table.
            - EmployeeSearchBar - directive for managing employees by using search bar.

------HOW TO START APP:------

- make sure you have npm installed
- go to application main directory
- run : "npm start"
- check working application on localhost:8000


