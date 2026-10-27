import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/ca/", "/en/", "/design-system/"];

for (const path of paths) {
  test(`${path} no tiene violaciones de accesibilidad WCAG 2.2 AA`, async ({
    page,
  }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      violations.map(
        ({ id, help, nodes }) =>
          `${id}: ${help} → ${nodes.map((node) => node.target.join(" ")).join(" | ")}`
      )
    ).toEqual([]);
  });
}
