import { test, expect, Page } from "@playwright/test";

const site = "https://profound-unicorn-a2fe56.netlify.app/";
const todoText = "Wash the car!!";

// Annotate entire file as serial.
test.describe.configure({ mode: "serial" });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto(site);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("GIVEN: an empty Todo list", () => {
  test(`WHEN: user adds a Todo for '${todoText}'`, async () => {
    const addTodoLink = page.getByTestId("add-todo-link");
    await expect(addTodoLink).toHaveAttribute("href", "/addtodo");
    await addTodoLink.click();
    await expect(page).toHaveURL(/.*addtodo/);

    const newTodo = page.getByTestId("todo-input");
    await newTodo.fill(todoText);
    await newTodo.press("Enter");
    await expect(page.url()).toMatch(site);
  });

  test("THEN: that item is listed", async () => {
    await expect(page.getByTestId("todo-title").first()).toHaveText(todoText);
  });
});

test.describe(`GIVEN: a Todo list with item '${todoText}'`, () => {
  let todos;

  test(`WHEN: user clicks trash button for item '${todoText}'`, async () => {
    todos = page.getByTestId("todo-title").allTextContents();
    console.log("todos", todos);

    const trashButton = page
      .locator(`[data-testid=remove-todo][aria-label="Remove ${todoText}"]`)
      .first();
    await trashButton.click();
  });

  test("THEN: that item is removed from the list", async () => {
    const oldTodos = Array.from(todos);
    oldTodos.shift();
    const newTodos = Array.from(page.getByTestId("todo-title"));
    await expect(oldTodos.length).toEqual(newTodos.length);
  });
});
