import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { getStoryContext } from "@storybook/test-runner";

const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };
const config = {
    async preVisit(page, story) {
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
    },
};

export default config;
