export let __page;

export function setPage(page) {
    __page = page;
}

export async function smartHeal(originalSelector, clueText = '') {

    const isXPath =
        originalSelector.startsWith('//') ||
        originalSelector.startsWith('(');

    const isCSS = !isXPath && (
        originalSelector.startsWith('.') ||
        originalSelector.startsWith('#') ||
        originalSelector.startsWith('[') ||
        /^[a-zA-Z]/.test(originalSelector)
    );

    //fallback
    const findBestMatch = async (tag) => {

        const candidates = await __page.locator(tag).all();

        if (candidates.length === 0) {
            throw new Error(`No <${tag}> elements found`);
        }

        let bestScore = -1;
        let bestLocator = null;
        let bestMeta = null;

        for (const locator of candidates) {

            let score = 0;

            const text =
                ((await locator.textContent()) || '').toLowerCase();

            const id =
                ((await locator.getAttribute('id')) || '').toLowerCase();

            const className =
                ((await locator.getAttribute('class')) || '').toLowerCase();

            const clue = clueText.toLowerCase();

            if (clue && text.includes(clue)) score += 3;
            if (clue && id.includes(clue)) score += 2;
            if (clue && className.includes(clue)) score += 1;

            if (score > bestScore) {
                bestScore = score;
                bestLocator = locator;
                bestMeta = {
                    text,
                    id,
                    className
                };
            }
        }

        if (!bestLocator || bestScore <= 0) {
            throw new Error(
                `No matching <${tag}> found for clue "${clueText}"`
            );
        }

        // Priority:
        // ID → class → text
        if (bestMeta.id) {
            console.log(
                `[smartHeal] Fallback by ID: #${bestMeta.id}`
            );
            return __page.locator(`#${bestMeta.id}`);
        }

        if (bestMeta.className) {
            const firstClass =
                bestMeta.className.trim().split(/\s+/)[0];
            console.log(
                `[smartHeal] Fallback by class: ${tag}.${firstClass}`
            );
            return __page.locator(`${tag}.${firstClass}`);
        }

        if (bestMeta.text) {

            console.log(
                `[smartHeal] Fallback by text: ${bestMeta.text}`
            );

            return __page.locator(tag, {
                hasText: bestMeta.text.trim()
            });
        }

        throw new Error(
            `Unable to create fallback selector`
        );
    };


    // XPath Handling
    if (isXPath) {

        const locator =
            __page.locator(`xpath=${originalSelector}`);

        const count = await locator.count();

        if (count > 0) {

            console.log(
                `[smartHeal] XPath matched: ${originalSelector}`
            );

            return locator.first();
        }

        const tagMatch =
            originalSelector.match(/^\/\/(\w+)/);

        const fallbackTag =
            tagMatch ? tagMatch[1] : 'div';

        console.log(
            `[smartHeal] XPath failed. Trying fallback <${fallbackTag}>`
        );

        return await findBestMatch(fallbackTag);
    }

    // CSS Handling
    if (isCSS) {

        try {

            const locator =
                __page.locator(originalSelector);

            const count = await locator.count();

            if (count > 0) {

                console.log(
                    `[smartHeal] CSS matched: ${originalSelector}`
                );

                return locator.first();
            }

        } catch (e) {

            throw new Error(
                `Invalid CSS selector: ${originalSelector}`
            );
        }

        const tagMatch =
            originalSelector.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);

        const fallbackTag =
            tagMatch ? tagMatch[1] : 'div';

        console.log(
            `[smartHeal] CSS failed. Trying fallback <${fallbackTag}>`
        );

        return await findBestMatch(fallbackTag);
    }

    // Default
    return __page.locator(originalSelector).first();
}