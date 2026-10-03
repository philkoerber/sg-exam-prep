import { expect, test, type Page } from "@playwright/test";
import { corpus } from "../../src/lib/corpus";

async function chooseEnglish(page: Page, route = "/") {
  await page.goto(route);
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
}

async function expectJapaneseSession(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".language-switch")).toHaveCount(0);
  await expect(page.locator(".brand-name")).toContainText("学習室");
  await expect(page.locator(".site-footer")).toContainText(
    "学ぶことを、少しずつ。",
  );
  expect(await page.evaluate(() => localStorage.getItem("sg-language"))).toBe(
    "en",
  );
}

async function currentQuestion(page: Page) {
  const source = await page.locator(".question-source > span").textContent();
  const question = corpus.find((q) => source === `出典：${q.source.label}`);
  expect(question).toBeDefined();
  return question!;
}

test("English persists across pages without changing the illustration or selected topic", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "日本語", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const illustration = await page.locator(".hero-illustration").innerHTML();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".brand-name")).toContainText("Study Room");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "One step at a time.Build your knowledge.",
  );
  expect(await page.locator(".hero-illustration").innerHTML()).toBe(
    illustration,
  );

  for (const route of ["/", "/practice/?topic=law", "/exam/"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("button", { name: "English", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(
        `english-${route === "/" ? "home" : route.split("/")[1]}.png`,
      ),
      fullPage: true,
    });
  }
  await page.goto("/practice/?topic=law");
  await expect(page.locator(".topic-card.selected")).toContainText(
    "Law and compliance",
  );
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(page.locator(".topic-card.selected")).toContainText(
    "法務・コンプライアンス",
  );
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Topic practice", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({
    "sg-language": "en",
  });
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(await page.context().cookies()).toEqual([]);
  expect(errors).toEqual([]);
});

test("practice stays Japanese and returns to English results with original Japanese content", async ({
  page,
}, testInfo) => {
  await chooseEnglish(page, "/practice/?topic=law");
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  await expectJapaneseSession(page);
  const attempted: typeof corpus = [];
  await page.getByRole("button", { name: "分野選択へ" }).click();
  await expect(page.getByRole("dialog")).toContainText("練習を終了しますか？");
  await page.getByRole("button", { name: "続ける", exact: true }).click();
  for (let i = 0; i < 10; i++) {
    const q = await currentQuestion(page);
    attempted.push(q);
    await page.locator(`input[value="${q.answer}"]`).check();
    await page.getByRole("button", { name: "答え合わせ" }).click();
    await expect(page.getByRole("status")).toContainText("正解です。");
    await page
      .getByRole("button", { name: i === 9 ? "結果を見る" : "次の問題へ" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Session complete." }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".result-percent")).toHaveText("100%");
  await page.getByRole("button", { name: "All", exact: true }).click();
  const reviewIndex = attempted.findIndex((q) => q.display === "text");
  expect(reviewIndex).toBeGreaterThanOrEqual(0);
  const first = attempted[reviewIndex];
  await page.locator(".review-toggle").nth(reviewIndex).click();
  await expect(page.locator(".question-prompt")).toHaveText(first.prompt);
  await expect(page.locator(".question-prompt")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".choice-text")).toHaveText(
    first.choices.map((c) => c.text),
  );
  await expect(page.locator(".feedback strong")).toHaveText("Correct.");
  await expect(
    page.getByRole("link", { name: "Official answer" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(page.locator(".result-percent")).toHaveText("100%");
  await expect(page.locator(".question-prompt")).toHaveText(first.prompt);
  await expect(page.locator(".feedback strong")).toHaveText("正解です。");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.screenshot({
    path: testInfo.outputPath("english-review.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Choose another topic" }).click();
  await expect(
    page.getByRole("button", { name: "Start practice", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  await page.getByRole("button", { name: "分野選択へ" }).click();
  await page.getByRole("button", { name: "終了する", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  await expectJapaneseSession(page);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "ホーム", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "knowledge",
  );
});

test("exam submission, exit, and timeout restore English without saving study state", async ({
  page,
}) => {
  await page.clock.install();
  await chooseEnglish(page, "/exam/");
  await page.getByRole("button", { name: "Start mock exam" }).click();
  await expectJapaneseSession(page);
  const first = await currentQuestion(page);
  await page.locator(`input[value="${first.answer}"]`).check();
  await page.getByRole("button", { name: "次の問題", exact: true }).click();
  await page.getByRole("button", { name: "前の問題", exact: true }).click();
  await expect(page.locator(`input[value="${first.answer}"]`)).toBeChecked();
  await expect(page.locator(".feedback")).toHaveCount(0);
  await page
    .getByRole("button", { name: "提出して採点する", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("未解答の59問");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "提出して採点する" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".result-summary strong")).toHaveText(
    "1 / 60 correct",
  );
  // Review a scenario: Japanese prose stays intact and diagrams use native content.
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.locator(".review-toggle").nth(48).click();
  const label = await page
    .locator(".question-source > span > span")
    .textContent();
  const scenario = corpus.find((q) => q.source.label === label)!;
  await expect(page.locator(".question-blocks > p")).toHaveText(
    scenario.blocks.filter((b) => b.type === "paragraph").map((b) => b.text),
  );
  await expect(page.locator(".question-card img")).toHaveCount(0);
  await expect(
    page.locator(".question-table, .question-panel, .question-diagram").first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to exam setup" }).click();
  await page.getByRole("button", { name: "Start mock exam" }).click();
  await page.getByRole("button", { name: "試験を終了", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "模擬試験を終了しますか？",
  );
  await page.getByRole("button", { name: "終了する", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start mock exam" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start mock exam" }).click();
  await page.clock.fastForward(120 * 60 * 1000 + 1000);
  await expect(
    page.getByRole("heading", { name: "Session complete." }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".result-summary strong")).toHaveText(
    "0 / 60 correct",
  );
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({
    "sg-language": "en",
  });
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start mock exam" }),
  ).toBeVisible();
  await expect(page.locator(".result-percent")).toHaveCount(0);
});

test("an invalid saved language falls back to Japanese", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("sg-language", "invalid"),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "日本語", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the switch works for the visit when browser storage is unavailable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        value() {
          throw new DOMException("Storage blocked", "SecurityError");
        },
      });
    }
  });
  await chooseEnglish(page);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Mock exam", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start mock exam" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start mock exam" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page.getByRole("button", { name: "試験を終了", exact: true }).click();
  await page.getByRole("button", { name: "終了する", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(errors).toEqual([]);
});
