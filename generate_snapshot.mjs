
import { detectAllSnapshot } from './src/main/core/scripts.js';

(async () => {
    try {
        console.log("Generating new snapshot...");
        await detectAllSnapshot();
        console.log("Snapshot generation complete.");
    } catch (error) {
        console.error("Failed to generate snapshot:", error);
        process.exit(1);
    }
})();
