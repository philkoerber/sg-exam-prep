import { expect, test } from "@playwright/test";
import { corpus } from "../../src/lib/corpus";

test("home and both setup pages fit the viewport", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("確かな");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  for (const route of ["/", "/practice/", "/exam/"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(
        `${route === "/" ? "home" : route.split("/")[1]}.png`,
      ),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("topic practice gives immediate feedback and an accurate session result", async ({
  page,
}, testInfo) => {
  await page.goto("/practice/?topic=law");
  await expect(page.locator('input[name="topic"]:checked')).toHaveCount(1);
  await page.getByRole("button", { name: "練習を始める" }).click();
  for (let i = 0; i < 10; i++) {
    const source = await page.locator(".question-source>span").textContent();
    const question = corpus.find((q) => source === `出典：${q.source.label}`)!;
    expect(question.topic).toBe("law");
    expect(question.pool).toBe("study");
    await expect(
      page.getByRole("button", { name: "答え合わせ" }),
    ).toBeDisabled();
    await page.locator(`input[value="${question.answer}"]`).check();
    await page.getByRole("button", { name: "答え合わせ" }).click();
    await expect(page.getByRole("status")).toContainText("正解です。");
    if (i === 0)
      await page.screenshot({
        path: testInfo.outputPath("practice-feedback.png"),
        fullPage: true,
      });
    await page
      .getByRole("button", { name: i === 9 ? "結果を見る" : "次の問題へ" })
      .click();
  }
  await expect(page.locator(".result-percent")).toHaveText("100%");
  await expect(
    page.getByText("すべて正解です。この調子で続けましょう。"),
  ).toBeVisible();
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(await page.context().cookies()).toEqual([]);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "練習を始める" }),
  ).toBeVisible();
  await expect(page.locator(".result-percent")).toHaveCount(0);
});

test("exam keeps choices in memory, hides answers until submission, and grades blanks", async ({
  page,
}, testInfo) => {
  await page.goto("/exam/");
  await page.getByRole("button", { name: "模擬試験を始める" }).click();
  await expect(page.getByLabel("残り時間")).toHaveText(/1(19|20):\d{2}/);
  await expect(page.locator(".map-grid button")).toHaveCount(60);
  const source = await page.locator(".question-source>span").textContent();
  const question = corpus.find((q) => source === `出典：${q.source.label}`)!;
  await page.locator(`input[value="${question.answer}"]`).check();
  await expect(page.locator(".feedback")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "公式解答" })).toHaveCount(0);
  await page.getByRole("button", { name: "次の問題", exact: true }).click();
  await page.getByRole("button", { name: "前の問題", exact: true }).click();
  await expect(page.locator(`input[value="${question.answer}"]`)).toBeChecked();
  await page.screenshot({
    path: testInfo.outputPath("exam-running.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "提出して採点する", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("未解答の59問");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "提出して採点する" })
    .click();
  await expect(page.locator(".result-summary strong")).toHaveText(
    "1 / 60 問正解",
  );
  await expect(page.locator(".result-percent")).toHaveText("2%");
  await page.screenshot({
    path: testInfo.outputPath("exam-result.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "模擬試験を始める" }),
  ).toBeVisible();
});

test("deadline submits automatically after the tab sleeps", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/exam/");
  await page.getByRole("button", { name: "模擬試験を始める" }).click();
  await page.clock.fastForward(120 * 60 * 1000 + 1000);
  await expect(
    page.getByRole("heading", { name: "おつかれさまでした。" }),
  ).toBeVisible();
  await expect(page.locator(".result-summary strong")).toHaveText(
    "0 / 60 問正解",
  );
});

test("original question diagrams are present and readable", async ({
  page,
}, testInfo) => {
  await page.goto("/exam/");
  await page.getByRole("button", { name: "模擬試験を始める" }).click();
  await page
    .getByRole("button", { name: "第49問 未解答", exact: true })
    .click();
  await expect(page.locator(".question-blocks")).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("scenario.png"),
    fullPage: true,
  });
  await page.getByText("原文のレイアウトを確認する").click();
  const image = page.locator(".original-image-link img").first();
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
