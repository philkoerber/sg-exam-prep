import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { questionBlocks, questionLabel } from "../../src/lib/corpus/content";
import { readPilot } from "../../scripts/pilot-review";
import { officialCorpus } from "../../src/lib/corpus";

test("all native exam content renders without image requests or clipped cells", async ({
  page,
}, testInfo) => {
  const styles = readFileSync("src/app/globals.css", "utf8");
  const fixtures: Record<string, string> = JSON.parse(
    readFileSync("tmp/content-fixtures.json", "utf8"),
  );
  for (const q of [...officialCorpus, ...readPilot()]) {
    const content = fixtures[q.id];
    await page.setContent(
      `<!doctype html><html lang="ja"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${styles}</style></head><body><main class="page results-page"><h1>${questionLabel(q)}</h1>${content}</main></body></html>`,
    );
    await expect(
      page.locator("img, picture, canvas, object, embed"),
    ).toHaveCount(0);
    await expect(page.locator("table")).toHaveCount(
      questionBlocks(q).filter((b) => b.type === "table").length,
    );
    await expect(page.locator(".question-diagram")).toHaveCount(
      questionBlocks(q).filter((b) => b.type === "diagram").length,
    );
    await expect(page.locator('input[type="radio"]')).toHaveCount(
      q.choices.length,
    );
    await expect(page.locator(".question-source")).toHaveCount(
      q.source.kind === "official" ? 1 : 0,
    );
    await expect(page.locator(".feedback")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      q.id,
    ).toBe(true);
    const clipped = await page
      .locator("td, th")
      .evaluateAll((cells) =>
        cells
          .filter((c) => c.scrollWidth > c.clientWidth + 2)
          .map((c) => c.textContent),
      );
    expect(clipped, q.id).toEqual([]);
    for (const table of await page.locator("table").all()) {
      await expect(table).toBeVisible();
    }
    await page.screenshot({
      path: testInfo.outputPath(`${q.id}.png`),
      fullPage: true,
    });
  }
});
