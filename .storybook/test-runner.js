import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { getStoryContext, waitForPageReady } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;
const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };

const setupScreenSize = async (page, story) => {
    // Accesses the story's parameters and retrieves the viewport used to render it
    const context = await getStoryContext(page, story);
    const viewportName = context.parameters?.viewport?.defaultViewport;
    const viewportParameter = MINIMAL_VIEWPORTS[viewportName];

    if (viewportParameter) {
        const viewportSize = Object.entries(viewportParameter.styles).reduce(
            (acc, [screen, size]) => ({
                // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
                ...acc,
                // Converts the viewport size from percentages to numbers
                [screen]: Number.parseInt(size),
            }),
            {},
        );
        // Configures the Playwright page to use the viewport size
        page.setViewportSize(viewportSize);
    } else {
        page.setViewportSize(DEFAULT_VIEWPORT_SIZE);
    }
};

const setupVisualTest = async (page, context) => {
    await waitForPageReady(page);
    const ScreenshotCompare = async (suffix = "") => {
        const image = await page.screenshot();
        expect(image).toMatchImageSnapshot({
            customSnapshotsDir,
            customSnapshotIdentifier: context.id + suffix,
        });
    };
    return ScreenshotCompare
};

const config = {
    setup() {
        expect.extend({ toMatchImageSnapshot });
    },
    async preVisit(page, story) {
        await setupScreenSize(page, story);
        const ScreenshotCompare = await setupVisualTest(page, story);
        await ScreenshotCompare()
    },
};

export default config;
