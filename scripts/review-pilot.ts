import { selectBatch } from "./corpus-batches";
import { writeBatchReport } from "./pilot-review";
writeBatchReport(selectBatch(process.argv.slice(2)).id);
