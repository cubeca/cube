# Contributing to CubeCommons

We welcome code contributions from everyone. By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

Contributions are reviewed on an annual basis. Pull requests can be made at any point between the last town hall and one month before the next town hall. In the month before a town hall, PRs with a vote over 5 go into review at the town hall for a final vote. The code contributions that are selected then go into review by a developer before being merged into CubeCommons.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request, please [open a new issue](https://github.com/cubeca/cube/issues) and add the `gov4git:managed` label to the issue to ensure the Gov4Git bot can process it.

### Submitting Changes

1. **Locate the CubeCommons repository**
   - Search for 'cubeca' on GitHub to locate the Cube Commons repository.
2. **Read the project README**
   - Click the `README` on the right hand side to find information on how to contribute to the project
3. **Fork the repository**:
   - Click the "Fork" dropdown and select "Create new fork"
   - This fork will be within your own account so you can call it whatever you like.
   - _Ensure "Copy the main branch only" is checked._
4. **Clone your fork**:
   - Click the green Code button to clone the repo using the command line, GitHub Desktop, or whatever your personal preference.
   ```sh
   git clone https://github.com/cubeca/cube
   cd cube
   ```
5. **Setup your local environment**:
   - Once the code is downloaded locally, open the `README` and scroll to "Project Infrastructure" to learn how the project is setup and guidelines on what external tools are needed to run your own instance.
   - _Cube Commons utilizes a serverless database solution called Cockroach, an email unification system called Brevo, and Docker containers deployed through Google Cloud Run. Some of these tools offer free options, however you can choose to use other services (except for Brevo which is required by the code)._
6. **Create a new branch**:
   ```sh
   git checkout -b feature/your-feature-name
   ```
7. **Make your changes**:
   - Ensure your changes follow the project's coding standards.
   - Write or update tests as necessary.
8. **Commit your changes**:
   ```sh
   git add .
   git commit -m "Description of the changes"
   ```
9. **Push to your fork**:

   ```sh
   git push origin feature/your-feature-name
   ```

10. **Open a Pull Request**:

- Navigate to the original repository and click the "New Pull Request" button.
- Select your branch from the "compare" dropdown.
- Add the `gov4git:managed` label to ensure the Gov4Git bot will process your pull request.
- Ensure that your PR title and description describes accurately what the code does.
  ie. "This code adds a button that handles the submission of an extra video."
- Press submit.

11. **Acknowledge Contributions**:

- After your pull request is merged, acknowledge which files were added to the main branch by the contributor.
- Include both the organization or artist name and their GitHub handle.
- List all developers and their GitHub handles who worked on the project.

### Contribution Reviews

Ensure that your PR title and description describes accurately what the code does.
ie. "This code adds a button that handles the submission of an extra video."

### Code Review Process

- Add `gov4git:managed` label to your PR
- Ensure that your PR title and description describes accurately what the code does.
  ie. "This code adds a button that handles the submission of an extra video."
- Your pull request will become an issue for community vote on the Gov4Git desktop app. Here community members can ask questions and decide whether they want this new feature.
- If your PR is approved by the community then it goes into code review.
- Code review is managed by the CubeCommons board and a developer code review can take up to seven months and may require changes to the code.
- Once code has been reviewed and tested, it's pushed to the main branch.

### Style Guide

- Follow the existing code style in the repository - this is described in the main README file.
- Ensure your code is clean and well-documented.

### Additional Notes

- Contributions are not limited to code. You can also help by providing feedback on issues and pull requests.
- If you have any questions, feel free to reach out by opening an issue or contacting the maintainers directly.

### License

By contributing to this project, you agree that your contributions will be licensed under the [Project License](LICENSE).

Thank you for your interest in contributing to CubeCommons!
