# Contributing to CubeCommons

We welcome code contributions from everyone. By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

Contributions are reviewed annually at our community meeting called the Town Hall. Pull requests can be made at any point between the last town hall and one month before the next Town Hall. In the month before a town hall, PRs with over 5 votes go into a final vote at the Town Hall and are rated based on the function, service or fix they would provide the community. They are not typically code reviewed at this point. The code contributions that are selected then go into review by a CubeCommons developer, who may make tweaks before being merging into CubeCommons main branch.


## How to Contribute

### Reporting Issues

If you find a bug or have a feature request, please [open a new issue](https://github.com/cubeca/cube/issues) and add the `gov4git:managed` label to the issue to ensure the Gov4Git bot can process it.

### Submitting Changes

1. **Locate the CubeCommons repository**
   - Search for 'cubeca' on GitHub to locate the Cube Commons repository.

2. **Fork the repository**:
   - Click the "Fork" dropdown and select "Create new fork"
   - This fork will be within your own account so you can call it whatever you like.
   - _Ensure "Copy the main branch only" is checked._

3. **Clone your fork**:
   - Click the green Code button to clone the repo using the command line, GitHub Desktop App, or whatever your personal preference.
   ```sh
   git clone https://github.com/cubeca/cube
   cd cube
   ```
4. **Setup your local environment**:
   - Once the code is downloaded locally, open the `README` and scroll to "Project Infrastructure" to learn how the project is setup and guidelines on what external tools are needed to run your own instance.
   - _Cube Commons utilizes a serverless database solution called Cockroach, an email unification system called Brevo, and Docker containers deployed through Google Cloud Run. Some of these tools offer free options, however you can choose to use other services (* except for Brevo which is required by the code *)._

5. **Create a new branch and name it after the featur your code provides. Ex: '-b feature/new-tagging-feature'**:
   ```sh
   git checkout -b feature/your-feature-name
   ```
6. **Make your changes**:
   - Ensure your changes follow the project's coding standards.
   - Write or update tests as necessary.

7. **Commit your changes**:
   ```sh
   git add .
   git commit -m "Your Description here should include who contributed to this code - both the organization and artist names, their GitHub handles and list all developers and their GitHub handles, and over what dates this code was developed."
   ```
8. **Push to your fork**:

   ```sh
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**:

- Navigate to the 'cubeca' repository on GitHub in your browser, and click the "New Pull Request" button.
- Select your branch from the "compare" dropdown.
- Add a Title that includes your CubeCommons Profil Name (if you have one) & your-feature-name
- Add a Description that accurately describes what User Experience your code contribution will add or fix on CubeCommons. This non-technical description is what the community will vote on.

 ex: "This code adds a button that handles the submission of a second video of sign-language translations that can appear as picture on picture when users view the associated content. This makes it possible for organisations to add sign-language translations whenever they can afford to."

- Add under the header Label: `gov4git:managed` to ensure the Gov4Git bot will process your pull request and push it to the desktop app for community voting.
- Press submit.

10. **Acknowledge Contributions**:

- After your pull request is merged, we will acknowledge which files were added to the main branch by the contributors listed in your PR.

### Contribution Reviews

- The community 'Prioritizes' you PR by voting for it on the Gov4git desktop app in the period before the next community Town Hall. Town Hall's happen annually and anyone with a login on CubeCommons can attend. PR's with more than 5 votes will be voted on again at the Town Hall based on the User Experience or Fix they can provide. This is not a code review. 
- If your PR is approved by the community then it goes into code review.
- Code review is managed by the CubeCommons board and a developer. Code review can take up to seven months and may require changes to the code.
- Once code has been reviewed and tested, it's pushed to the main branch.

### Style Guide

- Follow the existing code style in the repository - this is described in the main README file.
- Ensure your code is clean and well-documented.

### Additional Notes

- Contributions are not limited to code. You can also help by providing feedback on issues and pull requests, suggesting policy review or making proposals for code development, even if you are unable to provide code. This is all done using the "New Pull Request" or "New Issue" buttons in the cubca repository on Github. To push seither to a community vote they need the label: `gov4git:managed`
- If you have any questions, feel free to reach out by opening an issue or contacting the maintainers directly.

### License

By contributing to this project, you agree that your contributions will be licensed under the [Project License](LICENSE).

Thank you for your interest in contributing to CubeCommons!
